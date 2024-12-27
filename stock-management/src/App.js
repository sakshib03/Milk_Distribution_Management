import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AddStockModel from './components/AddStockModel';
import OutStockModel from './components/OutStockModel';
import Report from './components/Report';
import InsufficientStockModal from './components/InsufficientStockModal'; 
import History from './components/History';
import axios from 'axios';
import './components/Style.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showOutModal, setShowOutModal] = useState(false);
    const [showInsufficientModal, setShowInsufficientModal] = useState(false); 
    const [report, setReport] = useState(null);

    const fetchReport = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/get-report/");
            setReport(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to fetch report!');
        }
    };

    const handleAddStock = async (data) => {
        try {
            await axios.post("http://127.0.0.1:8000/in-out-stock/", {
                ...data,
                in_datetime: new Date().toISOString(),
                status: "in",
            });
            setShowAddModal(false);
            toast.success('Stock added successfully!');
            fetchReport();
        } catch (error) {
            console.error(error);
            toast.error('Failed to add stock!');
        }
    };

    const handleOutStock = async (data) => {
        if (!report || report.availableQuantity < data.liters) { 
            setShowInsufficientModal(true);
            return;
        }
        try {
            await axios.post("http://127.0.0.1:8000/in-out-stock/", {
                ...data,
                out_datetime: new Date().toISOString(),
                status: "out",
            });
            setShowOutModal(false);
            fetchReport();
        } catch (error) {
            console.error(error);
            toast.error('Failed to dispatch stock!');
        }
    };

    const closeInsufficientModal = () => {
        setShowInsufficientModal(false);
    };

    useEffect(() => {
        fetchReport();
    }, []);

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={
                        <div className="container">
                            <ToastContainer />
                            <h1>Milk Distribution Management</h1>
                            <img src="/images/img.webp" alt="Milk Distribution" style={{ width: '100%', height: 'auto' }} />
                            <button onClick={() => setShowAddModal(true)}>Add Stock</button>
                            <button onClick={() => setShowOutModal(true)}>Out Stock</button>

                            {showAddModal && (
                                <AddStockModel
                                    onSubmit={handleAddStock}
                                    onClose={() => setShowAddModal(false)}
                                />
                            )}
                            {showOutModal && (
                                <OutStockModel
                                    onSubmit={handleOutStock}
                                    onClose={() => setShowOutModal(false)}
                                    inQuantity={report ? report.availableQuantity : 0}
                                />
                            )}
                            {showInsufficientModal && (
                                <InsufficientStockModal
                                    onClose={closeInsufficientModal}
                                    message={`Insufficient milk liters! Available stock is ${report?.availableQuantity || 0} liters.`}
                                />
                            )}
                            <Report report={report} />
                            <Link to="/history">
                                <button>Stock History</button>
                            </Link>
                        </div>
                    }
                />
                <Route path="/history" element={<History />} />
            </Routes>
        </Router>
    );
};

export default App;
