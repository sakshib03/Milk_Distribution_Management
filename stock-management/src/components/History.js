import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './History.css';

const History = () => {
    const [reportData, setReportData] = useState({});

    const fetchMonthlyReport = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/get-monthly-report/");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setReportData(data);
        } catch (error) {
            console.error("Error fetching report data:", error);
            toast.error('Failed to fetch the report. Please try again later!');
        }
    };

    useEffect(() => {
        fetchMonthlyReport(); 
    }, []); 

    return (
        <div>
         <ToastContainer />
            <h1>Monthly Stock Report</h1>
            {Object.keys(reportData).length>0 ? (
                <table border="1" className="report-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>In Quantity</th>
                            <th>In Cost</th>
                            <th>Out Quantity</th>
                            <th>Out Cost</th>
                            <th>Profit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(reportData).map((date) => (
                            <tr key={date}>
                                <td>{date}</td>
                                <td>{(reportData[date].inQuantity || 0).toFixed(2)}</td>
                                <td>{(reportData[date].inCost || 0).toFixed(2)}</td>
                                <td>{(reportData[date].outQuantity || 0).toFixed(2)}</td>
                                <td>{(reportData[date].outCost || 0).toFixed(2)}</td>
                                <td>{(reportData[date].profit || 0).toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No data available for the current month.</p>
            )}
        </div>
    );
};

export default History;
