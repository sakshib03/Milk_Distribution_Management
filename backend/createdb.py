import sqlite3

DB_PATH = "stock.db"

def create_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS stocks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            product_name TEXT NOT NULL,
            in_datetime TEXT NOT NULL,
            out_datetime TEXT,
            liters REAL NOT NULL,
            cost REAL NOT NULL,
            status TEXT NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    create_db()
