import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "../GeneralContext";

import "./BuyWindow.css"; // Make sure this is imported

const BuyWindow = ({ uid, defaultMode = "BUY" }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [orderType, setOrderType] = useState(defaultMode);

  const { closeBuyWindow } = useContext(GeneralContext);

  // Reset order type when window opens with new mode
  useEffect(() => {
    setOrderType(defaultMode);
  }, [defaultMode]);

  const handlePlaceOrder = async () => {
    try {
      await axios.post(
        "http://localhost:3002/orders/",
        {
          name: uid,
          qty: parseInt(stockQuantity, 10),
          price: parseFloat(stockPrice),
          mode: orderType,
        },
        { withCredentials: true }
      );

      alert(`${orderType} order placed successfully`);
      closeBuyWindow();
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order");
    }
  };

  const handleCancelClick = () => {
    closeBuyWindow();
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
              step="0.05"
            />
          </fieldset>
          <fieldset>
            <legend>Mode</legend>
            <select value={orderType} onChange={(e) => setOrderType(e.target.value)}>
              <option value="BUY">BUY</option>
              <option value="SELL">SELL</option>
              <option value="INTRADAY_BUY">Intraday BUY</option>
              <option value="INTRADAY_SELL">Intraday SELL</option>
            </select>
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handlePlaceOrder}>
            {orderType === "SELL" ? "Sell" : "Buy"}
          </Link>
          <Link className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyWindow;
