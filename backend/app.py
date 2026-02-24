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
CORS(app)

# ---------------- DATABASE ----------------
client = MongoClient(MONGO_URI)
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


# ================= AUTH ROUTES =================

@app.route("/api/signup", methods=["POST"])
def signup():
    data = request.json

    full_name = data.get("fullName")
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "Email already exists"}), 400

    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

    users_collection.insert_one({
        "fullName": full_name,
        "email": email,
        "username": username,
        "password": hashed_password
    })

    return jsonify({"message": "User registered successfully"}), 201


@app.route("/api/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    user = users_collection.find_one({"email": email})

    if not user:
        return jsonify({"error": "Invalid email or password"}), 401

    if not bcrypt.checkpw(password.encode("utf-8"), user["password"]):
        return jsonify({"error": "Invalid email or password"}), 401

    return jsonify({
        "message": "Login successful",
        "username": user["username"]
    }), 200


# ================= PREDICTION ROUTE =================

from flask import request, jsonify
import numpy as np
import os
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.imagenet_utils import preprocess_input

@app.route("/api/predict", methods=["POST"])
def predict():

    # 1️⃣ Check file key matches frontend
    if "fingerprint" not in request.files:
        return jsonify({"message": "No fingerprint uploaded"}), 400

    file = request.files["fingerprint"]

    if file.filename == "":
        return jsonify({"message": "No selected file"}), 400

    try:
        # 2️⃣ Save file temporarily
        filepath = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(filepath)

        # 3️⃣ Load & preprocess image
        img = image.load_img(filepath, target_size=(256, 256))
        x = image.img_to_array(img)

        # IMPORTANT: normalize properly
        x = x / 255.0   # safer than preprocess_input unless using specific pretrained model

        x = np.expand_dims(x, axis=0)

        # 4️⃣ Predict
        preds = model.predict(x)

        class_index = int(np.argmax(preds[0]))
        confidence = float(np.max(preds[0])) * 100

        print("Raw predictions:", preds)

        # 5️⃣ Confidence threshold check
        if confidence < CONFIDENCE_THRESHOLD:
            return jsonify({
                "prediction": "Uncertain",
                "confidence": round(confidence, 2)
            }), 200

        # 6️⃣ Return correct label
        return jsonify({
            "prediction": LABELS[class_index],
            "confidence": round(confidence, 2)
        }), 200

    except Exception as e:
        return jsonify({"message": str(e)}), 500


# ================= RUN =================

if __name__ == "__main__":
    app.run(debug=True)