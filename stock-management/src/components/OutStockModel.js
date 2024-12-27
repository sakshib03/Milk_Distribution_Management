import React, { useState } from 'react';
import './AddStockModel.css';  
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const OutStockModel = ({ onSubmit, onClose, inQuantity }) => {
    const [liters, setLiters] = useState("");
    const [cost, setCost] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (liters <= 0 || cost <= 0) {
            toast.info('Please provide valid data!');
            return;
        }

        if (parseFloat(liters) > inQuantity) {
            toast.error(`Insufficient stock! Available stock is ${inQuantity} liters.`);
            return;
        }

        onSubmit({ liters: parseFloat(liters), cost: parseFloat(cost) });
    };

    return (
        <>
        <div className="modal-background" />
            <div className="modal">
            <ToastContainer />
                <h2>Out Stock</h2>
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

export default OutStockModel;
