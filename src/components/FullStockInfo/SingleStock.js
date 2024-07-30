import React from "react";
import './SingleStock.css';
import Graph from '../Analytics/Graph';

export default function SingleStock({ closeStockInfo, stockSymbol }) {
    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>{stockSymbol}'s Analytics</h1>
                    <button className="closeInfo"
                        onClick={() => closeStockInfo(false)}> X </button>
                </div>
                <div className="buttons">
                    <button>Week</button>
                    <button>Month</button>
                    <button>Quarter</button>
                    <button>Year</button>
                    <button>5 Years</button>
                </div>
                <Graph stockSymbol={stockSymbol}/>
                <div className="footer">
                    <button className="cancel-btn"onClick={() => closeStockInfo(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}