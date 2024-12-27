from fastapi import FastAPI, HTTPException
from datetime import datetime, timedelta
import sqlite3
from fastapi.middleware.cors import CORSMiddleware

DB_PATH = "history.db"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# @app.get("/get-monthly-report/")
# def get_monthly_report():
#     conn = sqlite3.connect(DB_PATH)
#     cursor = conn.cursor()
#     try:
#         today = datetime.now()
#         start_of_month = today.replace(day=1)
#         response = {}
#         current_date = start_of_month

#         while current_date <= today:
#             next_date = current_date + timedelta(days=1)

#             cursor.execute(
#                 """
#                 SELECT SUM(liters), AVG(cost) FROM stocks WHERE status='in' AND in_datetime BETWEEN ? AND ?
#                 """,
#                 (current_date.isoformat(), next_date.isoformat())
#             )
#             in_quantity, in_cost = cursor.fetchone() or (0, 0)

#             cursor.execute(
#                 """
#                 SELECT SUM(liters), AVG(cost) FROM stocks WHERE status='out' AND out_datetime BETWEEN ? AND ?
#                 """,
#                 (current_date.isoformat(), next_date.isoformat())
#             )
#             out_quantity, out_cost = cursor.fetchone() or (0, 0)

#             response[current_date.strftime("%Y-%m-%d")] = {
#                 "inQuantity": in_quantity or 0,
#                 "inCost": in_cost or 0,
#                 "outQuantity": out_quantity or 0,
#                 "outCost": out_cost or 0,
#             }

#             current_date = next_date

#         return response

#     except sqlite3.Error as e:
#         raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
#     finally:
#         conn.close()