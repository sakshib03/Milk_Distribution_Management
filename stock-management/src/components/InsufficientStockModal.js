import React from 'react';

const InsufficientStockModal = ({ onClose, message }) => {
    return (
        <div>
            <div>
                <h2>{message}</h2>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default InsufficientStockModal;

