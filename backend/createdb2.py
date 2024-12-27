import sqlite3

DB_PATH = "history.db"

def create_db2():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS history(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            in_quantity REAL NOT NULL,
            in_cost REAL NOT NULL,
            out_quantity REAL NOT NULL,
            out_cost REAL NOT NULL,
            profit REAL NOT NULL
        )
        """
    )
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")


if __name__ == "__main__":
    create_db2()