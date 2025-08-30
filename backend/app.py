import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

# --- App Setup ---
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes

# --- Database Configuration ---
DB_FILE = os.path.join(os.path.dirname(__file__), 'glooba.db')


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
        return jsonify({"error": "Missing required fields: fullName, username, password"}), 400

    password_hash = generate_password_hash(password)

    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO users (full_name, username, password_hash) VALUES (?, ?, ?)",
            (full_name, username, password_hash)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Username already exists"}), 409
    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "User registered successfully"}), 201


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
        conn.row_factory = sqlite3.Row  # Allows accessing columns by name
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM users WHERE username = ?", (username,))
        user = cursor.fetchone()

    except sqlite3.Error as e:
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    if user and check_password_hash(user['password_hash'], password):
        # In a real app, you would create a session or JWT here
        return jsonify({"message": f"Welcome back, {user['full_name']}!"}), 200
    else:
        return jsonify({"error": "Invalid username or password"}), 401


# --- Main Execution ---
if __name__ == '__main__':
    app.run(debug=True, port=5001)
