import os
import sqlite3
import time
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename

# --- App Setup ---
app = Flask(__name__)
CORS(app)

# --- Configuration ---
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

DB_FILE = os.path.join(os.path.dirname(__file__), 'glooba.db')

# --- Helper Functions ---
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# --- API Routes ---
@app.route('/')
def index():
    return jsonify({"message": "Welcome to the GLOOBA backend!"})

@app.route('/api/register', methods=['POST'])
def register():
    """Endpoint to register a new user."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    full_name = data.get('fullName')
    username = data.get('username')
    password = data.get('password')

    if not all([full_name, username, password]):
        return jsonify({"error": "Missing required fields"}), 400

    password_hash = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (full_name, username, password_hash) VALUES (?, ?, ?)",
            (full_name, username, password_hash)
        )
        conn.commit()
        user_id = cursor.lastrowid
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "User registered successfully", "userId": user_id}), 201

@app.route('/api/profile/setup', methods=['POST'])
def profile_setup():
    """Endpoint to handle profile setup after registration."""
    user_id = request.form.get('userId')
    bio = request.form.get('bio')
    interests = request.form.getlist('interests[]')

    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    profile_image_url = None
    if 'profilePhoto' in request.files:
        file = request.files['profilePhoto']
        if file and file.filename != '' and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{user_id}_{int(time.time())}_{filename}"
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(file_path)
            profile_image_url = f"/uploads/{unique_filename}"

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        cursor.execute(
            "UPDATE users SET bio = ?, profile_image_url = ? WHERE id = ?",
            (bio, profile_image_url, user_id)
        )

        if interests:
            interest_ids = []
            for interest_name in interests:
                cursor.execute("SELECT id FROM interests WHERE name = ?", (interest_name,))
                interest_id_row = cursor.fetchone()
                if interest_id_row:
                    interest_ids.append(interest_id_row[0])

            for interest_id in interest_ids:
                cursor.execute(
                    "INSERT INTO user_interests (user_id, interest_id) VALUES (?, ?)",
                    (user_id, interest_id)
                )

        conn.commit()
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "Profile updated successfully"}), 200


@app.route('/api/login', methods=['POST'])
def login():
    """Endpoint to log in a user."""
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    username = data.get('username')
    password = data.get('password')

    if not all([username, password]):
        return jsonify({"error": "Missing username or password"}), 400

    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    if user and check_password_hash(user['password_hash'], password):
        return jsonify({"message": f"Welcome back, {user['full_name']}!"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401

# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)
