import React from 'react'
// import { holdings } from '../data/data'
import { useState, useEffect } from 'react'
import axios from 'axios';

import VerticalGraph from './Graphs/VerticalGraph';

const Holdings = () => {
  
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect( () =>{
    axios.get("https://zerodha-u26q.onrender.com/allHoldings", { withCredentials: true }).then((res) => {
      setAllHoldings(res.data);
    })
  }, []);


  //Graph logic

  const labels = allHoldings.map((curr) => curr["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <tr>
            <th>Instrument</th>
            <th>Qty.</th>
            <th>Avg. cost</th>
            <th>LTP</th>
            <th>Cur. val</th>
            <th>P&L</th>
            <th>Net chg.</th>
            <th>Day chg.</th>
          </tr>


          {allHoldings.map((stock, idx) => {
            const currValue = stock.price * stock.qty;
            const isProfit = currValue - stock.avg * stock.qty >= 0.0;
            const profitClass = isProfit ? "profit" : "loss";
            const dayClass = stock.isLoss ? "loss" : "profit";

            return (
              <tr key={idx}>
                <td>{stock.name}</td>
                <td>{stock.qty}</td>
                <td>{stock.avg}</td>
                <td>{stock.price.toFixed(2)}</td>
                <td>{currValue.toFixed(2)}</td>
                <td className={profitClass}>
                  {(currValue - stock.avg * stock.qty).toFixed(2)}
                </td>
                <td className={profitClass}>{stock.net}</td>
                <td className={dayClass}>{stock.day}</td>
              </tr>
            )
          })}

        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data}/>
    </>
  )
}

export default Holdings