from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes

import sqlite3
from werkzeug.security import generate_password_hash
import os

# Database file path
DB_FILE = os.path.join(os.path.dirname(__file__), 'glooba.db')

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

    # Hash the password for security
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
        # This error occurs if the username is not unique
        return jsonify({"error": "Username already exists"}), 409  # 409 Conflict
    except sqlite3.Error as e:
        # Handle other potential database errors
        return jsonify({"error": f"Database error: {e}"}), 500
    finally:
        if conn:
            conn.close()

    return jsonify({"message": "User registered successfully"}), 201


if __name__ == '__main__':
    app.run(debug=True, port=5001)
