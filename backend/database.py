import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), 'glooba.db')

def init_db():
    """Initializes the database and creates the necessary tables."""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()

        # Drop tables if they exist for a clean slate during development
        cursor.execute("DROP TABLE IF EXISTS user_interests")
        cursor.execute("DROP TABLE IF EXISTS interests")
        cursor.execute("DROP TABLE IF EXISTS users")

        # Create users table with new columns
        cursor.execute('''
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            full_name TEXT NOT NULL,
            username TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            bio TEXT,
            profile_image_url TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
        ''')

        # Create interests table
        cursor.execute('''
        CREATE TABLE interests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE
        )
        ''')

        # Create user_interests join table for many-to-many relationship
        cursor.execute('''
        CREATE TABLE user_interests (
            user_id INTEGER,
            interest_id INTEGER,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (interest_id) REFERENCES interests (id),
            PRIMARY KEY (user_id, interest_id)
        )
        ''')

        # Populate the interests table with default values
        default_interests = ['Sports', 'Music', 'Tech', 'Lifestyle', 'Gaming', 'Travel']
        cursor.executemany("INSERT INTO interests (name) VALUES (?)", [(i,) for i in default_interests])

        conn.commit()
        print("Database initialized successfully with updated schema.")
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == '__main__':
    # It's good practice to remove the old db file to ensure a fresh start
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
        print("Removed old database file.")

    print("Initializing new database...")
    init_db()
