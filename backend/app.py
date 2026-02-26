import os
import bcrypt
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.efficientnet import preprocess_input
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
print("Mongo URI:", MONGO_URI)
db = client["bloodgroupdb"]
users_collection = db["users"]

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

CONFIDENCE_THRESHOLD = 40.0


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend is running",
        "message": "Blood Group Detection API is working",
        "available_routes": [
            "/api/signup",
            "/api/login",
            "/api/predict"
        ]
    }), 200

# ================= AUTH ROUTES =================

@app.route("/signup", methods=["POST"])
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
            return jsonify({"message": "All fields are required"}), 400

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


@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"message": "No data received"}), 400

        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"message": "Email and password are required"}), 400

        user = users_collection.find_one({"email": email})

        if not user:
            return jsonify({"message": "Invalid email or password"}), 401

        if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
            return jsonify({"message": "Invalid email or password"}), 401

        return jsonify({
            "message": "Login successful",
            "username": user["username"]
        }), 200

    except Exception as e:
        print("Login Error:", str(e))
        return jsonify({"message": "Server error"}), 500


# ================= PREDICTION ROUTE =================
from tensorflow.keras.applications.imagenet_utils import preprocess_input

@app.route("/predict", methods=["POST"])
def predict():

    if "fingerprint" not in request.files:
        return jsonify({"message": "No fingerprint uploaded"}), 400

    file = request.files["fingerprint"]

    try:
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        img = image.load_img(filepath, target_size=(256, 256))
        x = image.img_to_array(img)

        x = np.expand_dims(x, axis=0)
        x = preprocess_input(x)

        preds = model.predict(x, verbose=0)

        print("Predictions:", preds[0])

        class_index = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0])) * 100

        return jsonify({
            "prediction": LABELS[class_index],
            "confidence": round(confidence, 2)
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ================= RUN =================

if __name__ == "__main__":
    app.run(debug=True)