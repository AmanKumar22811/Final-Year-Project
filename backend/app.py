import os
import bcrypt
import jwt
import datetime
import numpy as np
from functools import wraps
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from pymongo import MongoClient
from bson.objectid import ObjectId
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.imagenet_utils import preprocess_input
from dotenv import load_dotenv

# ---------------- LOAD ENV ----------------
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
SECRET_KEY = os.getenv("SECRET_KEY")

# ---------------- APP ----------------
app = Flask(__name__)
CORS(app, origins="http://localhost:5173", supports_credentials=True)

# ---------------- DATABASE ----------------
client = MongoClient(MONGO_URI, tlsAllowInvalidCertificates=True)
db = client["bloodgroupdb"]
users_collection = db["users"]
predictions_collection = db["predictions"]

# ---------------- MODEL ----------------
MODEL_PATH = "model_blood_group_detection.h5"
model = load_model(MODEL_PATH)

LABELS = {
    0: "A+",
    1: "A-",
    2: "AB+",
    3: "AB-",
    4: "B+",
    5: "B-",
    6: "O+",
    7: "O-"
}

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# =====================================================
#               AUTH MIDDLEWARE
# =====================================================

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):

        token = None

        if "Authorization" in request.headers:
            token = request.headers["Authorization"]

        if not token:
            return jsonify({"message": "Token missing"}), 401

        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = users_collection.find_one(
                {"_id": ObjectId(data["user_id"])}
            )
        except Exception as e:
            return jsonify({"message": "Invalid or expired token"}), 401

        return f(current_user, *args, **kwargs)

    return decorated


# =====================================================
#               HOME ROUTE
# =====================================================

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend is running",
        "message": "Blood Group Detection API is working",
        "routes": [
            "/api/signup",
            "/api/login",
            "/api/predict (protected)"
        ]
    })


# =====================================================
#                       SIGNUP
# =====================================================

@app.route("/api/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data received"}), 400

        full_name = data.get("fullName")
        email = data.get("email")
        username = data.get("username")
        password = data.get("password")

        if not full_name or not email or not username or not password:
            return jsonify({"message": "All fields required"}), 400

        if users_collection.find_one({"email": email}):
            return jsonify({"message": "Email already exists"}), 400

        hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

        users_collection.insert_one({
            "fullName": full_name,
            "email": email,
            "username": username,
            "password": hashed_password
        })

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        print("Signup Error:", str(e))
        return jsonify({"message": str(e)}), 500


# =====================================================
#                   LOGIN
# =====================================================

@app.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data received"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password required"}), 400

        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"message": "Invalid email or password"}), 401

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return jsonify({"message": "Invalid email or password"}), 401

        token = jwt.encode({
            "user_id": str(user["_id"]),
            "email": user["email"],
            "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, SECRET_KEY, algorithm="HS256")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "username": user["username"]
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# =====================================================
#           PREDICT (PROTECTED)
# =====================================================

@app.route("/api/predict", methods=["POST"])
@token_required
def predict(current_user):

    if "fingerprint" not in request.files:
        return jsonify({"message": "No fingerprint uploaded"}), 400

    file = request.files["fingerprint"]

    # GET FORM DATA
    full_name = request.form.get("fullName")
    email = request.form.get("email")
    dob = request.form.get("dateOfBirth")
    phone = request.form.get("phone")

    try:

        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        img = image.load_img(filepath, target_size=(256, 256))
        x = image.img_to_array(img)

        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        preds = model.predict(x, verbose=0)

        class_index = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0])) * 100

        prediction_result = LABELS[class_index]

        # SAVE HISTORY
        predictions_collection.insert_one({

            "user_id": str(current_user["_id"]),
            "username": current_user["username"],

            "fullName": full_name,
            "email": email,
            "dateOfBirth": dob,
            "phone": phone,

            "prediction": prediction_result,
            "confidence": round(confidence, 2),

            "fingerprint_image": file.filename,
            "created_at": datetime.datetime.utcnow()
        })

        return jsonify({
            "prediction": prediction_result,
            "confidence": round(confidence, 2)
        })

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# =====================================================
#               USER PREDICTION HISTORY
# =====================================================

@app.route("/api/history", methods=["GET"])
@token_required
def history(current_user):

    history = list(
        predictions_collection.find(
            {"user_id": str(current_user["_id"])}
        ).sort("created_at", -1)
    )

    for item in history:
        item["_id"] = str(item["_id"])

    return jsonify(history)


# =====================================================
#           PROFILE (CHECK LOGIN)
# =====================================================

@app.route("/api/profile", methods=["GET"])
@token_required
def profile(current_user):

    return jsonify({
        "username": current_user["username"],
        "email": current_user["email"],
        "fullName": current_user["fullName"]
    })


# =====================================================
#                   SEND IMAGE
# =====================================================

@app.route("/uploads/<filename>")
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)


# =====================================================
#                   RUN SERVER
# =====================================================

if __name__ == "__main__":
    app.run(debug=True)