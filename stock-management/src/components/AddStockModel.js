import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './AddStockModel.css';

const AddStockModel = ({ onSubmit, onClose }) => {
    const [liters, setLiters] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (liters <= 0 || cost <= 0) {
            toast.info('Please provide valid data!');
            return;
        }
        onSubmit({ liters: parseFloat(liters), cost: parseFloat(cost) });
    };

    return (
        <>
        <ToastContainer />
        <div className="modal-background" />
            <div className="modal">
                <h2>Add Stock</h2>
                <form onSubmit={handleSubmit}>
                    <label>Liters:</label>
                    <input
                        type="number"
                        value={liters}
                        onChange={(e) => setLiters(e.target.value)}
                        required
                    />
                    <label>Cost:</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onClose}>Cancel</button>
                </form>
           
            </div>
        </>
    );
};

export default AddStockModel;
