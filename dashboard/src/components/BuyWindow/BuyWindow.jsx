import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "../GeneralContext";
import "./BuyWindow.css";

const BuyWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [isLoading, setIsLoading] = useState(false);

  const { closeBuyWindow } = useContext(GeneralContext);

  const handleBuyClick = async () => {
    if (!stockPrice || stockPrice <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(
        "https://zerodha-9zmu.onrender.com/newOrder",
        {
          name: uid,
          qty: parseInt(stockQuantity, 10),
          price: parseFloat(stockPrice),
          mode: "BUY",
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log("Order response:", response.data);
      alert("Order placed successfully ✅");
      closeBuyWindow();
    } catch (err) {
      console.error("Error placing order:", err);
      
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = 'https://zerodha-b03g67fs6-arfat-fakihs-projects.vercel.app/';
      } else {
        const errorMessage = err.response?.data?.message || "Failed to place order";
        alert(`Failed to place order: ${errorMessage} ❌`);
      }
    } finally {
      setIsLoading(false);
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
              name="qty"
              id="qty"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              disabled={isLoading}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              min="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
              disabled={isLoading}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required ₹140.65</span>
        <div>
          <Link 
            className={`btn btn-blue ${isLoading ? 'disabled' : ''}`}
            onClick={!isLoading ? handleBuyClick : undefined}
          >
            {isLoading ? "Placing..." : "Buy"}
          </Link>
          <Link 
            to="" 
            className="btn btn-grey" 
            onClick={!isLoading ? handleCancelClick : undefined}
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyWindow;