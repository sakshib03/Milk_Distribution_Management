import React from 'react';
import './Report.css';

const Report = ({ report }) => {
  console.log(report);

  if (!report) {
    return <p className="no-data">No data available</p>;
  }

  const { 
    inQuantity = 0,
    availableQuantity = 0,
    outQuantity = 0,
    costPerLiter = 50,
    inCost = 0,
    outCost=0
  } = report;

  const totalCost = inQuantity * inCost;
  const expectedRevenue = inQuantity * outCost;
  const availableStockValue = availableQuantity * costPerLiter;
  const outStockRevenue = outQuantity * outCost;
  const profit = outStockRevenue - totalCost;

  return (
    <div className="report-container">
      <h2 className="report-title">Stock Report</h2>
      <div className="report-section">
        <h3 className="section-title">Added Stock</h3>
        <p>Quantity: {inQuantity} liters</p>
        <p>Cost: {totalCost.toLocaleString()} Rs</p>
        <p>Expected Rev: {expectedRevenue.toLocaleString()} Rs</p>
      </div>

      <div className="report-section">
        <h3 className="section-title">Available Stock</h3>
        <p>Quantity: {availableQuantity} liters</p>
        <p>Value: {availableStockValue.toLocaleString()} Rs</p>
      </div>

      <div className="report-section">
        <h3 className="section-title">Out Stock</h3>
        <p>Quantity: {outQuantity} liters</p>
        <p>Revenue: {outStockRevenue.toLocaleString()} Rs</p>
      </div>

      <div className="report-summary">
        <h3 className="section-title">Profit</h3>
        <p>Profit: {profit.toLocaleString()} Rs</p>
      </div>
    </div>
  );
};

export default Report;
