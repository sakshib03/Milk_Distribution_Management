from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = "stock.db"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Stock(BaseModel): 
    in_datetime: datetime | None = None
    out_datetime: datetime | None = None
    liters: float
    cost: float
    status: str

@app.post("/in-out-stock/")
def create_stock(stock: Stock):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        prname = "milk"

        cursor.execute(
            "SELECT SUM(liters) FROM stocks WHERE status='in'"
        )
        in_quantity = cursor.fetchone()[0] or 0

        cursor.execute(
            "SELECT SUM(liters) FROM stocks WHERE status='out'"
        )
        out_quantity = cursor.fetchone()[0] or 0

        available_stock = in_quantity - out_quantity

        if stock.status == "out" and stock.liters > available_stock:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock! Available stock is {available_stock:.2f} liters."
            )

        cursor.execute(
            """
            INSERT INTO stocks (product_name, in_datetime, out_datetime, liters, cost, status)
            VALUES (?, ?, ?, ?, ?, ?)
            """,
            (
                prname,
                stock.in_datetime.isoformat() if stock.in_datetime else None,
                stock.out_datetime.isoformat() if stock.out_datetime else None,
                stock.liters,
                stock.cost,
                stock.status,
            ),
        )    
        conn.commit()
        return {"message": "Stock operation successful"}

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        conn.close()


@app.get("/get-report/")
def get_stock():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        current_date = datetime.now().date()
        print(f"Debug: Current Date - {current_date}")

        cursor.execute("SELECT SUM(liters) FROM stocks WHERE status='in' AND in_datetime >= ?", (current_date,))
        in_quantity = cursor.fetchone()[0] or 0
        print(f"Debug: In Quantity - {in_quantity}")

        cursor.execute("SELECT AVG(cost) FROM stocks WHERE status='in' AND in_datetime >= ?", (current_date,))
        in_cost = cursor.fetchone()[0] or 0
       
        cursor.execute("SELECT AVG(cost) FROM stocks WHERE status='out' AND out_datetime >= ?", (current_date,))
        out_cost = cursor.fetchone()[0] or 0

        cursor.execute("SELECT SUM(liters) FROM stocks WHERE status='out' AND out_datetime >= ?", (current_date,))
        out_quantity = cursor.fetchone()[0] or 0
        print(f"Debug: Out Quantity - {out_quantity}")

        if in_quantity == 0 and out_quantity == 0:
            return {"message": "No stock records found"}
        else:
            return {
                "inQuantity": in_quantity,
                "inCost":in_cost,
                "outCost":out_cost,
                "outQuantity": out_quantity,
                "availableQuantity": in_quantity - out_quantity,
            }
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    finally:
        conn.close()



@app.get("/get-monthly-report/")
def get_monthly_report():
    print("inside")
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        today = datetime.now()
        start_of_month = today.replace(day=1)
        response = {}
        current_date = start_of_month

        while current_date <= today:
            next_date =current_date+timedelta(days=1)

            cursor.execute(
                """
                SELECT SUM(liters), AVG(cost) FROM stocks WHERE status='in' AND in_datetime BETWEEN ? AND ? 
                """,
                (current_date.isoformat(), next_date.isoformat())
            )
            in_quantity, in_cost = cursor.fetchone() or (0,0)

            cursor.execute(
                """
                SELECT SUM(liters), AVG(cost) FROM stocks WHERE status='out' AND  out_datetime BETWEEN ? AND ?
                """,
                (current_date.isoformat(), next_date.isoformat())
            )
            out_quantity, out_cost = cursor.fetchone() or (0,0)

            response[current_date.strftime("%Y-%m-%d")] = {
                "inQuantity": in_quantity or 0,
                "inCost": in_cost or 0,
                "outQuantity": out_quantity or 0,
                "outCost": out_cost or 0,
                "profit" : (out_cost or 0)-(in_cost or 0)  
            }
            current_date = next_date
        return response

    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

    finally:
        conn.close()