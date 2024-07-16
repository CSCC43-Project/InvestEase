import React from "react";
import './SingleStock.css';
import { stockInformation } from "./StockInfo";

export default function SingleStock({ closeStockInfo }) {
    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>{stockInformation.stockSymbol}'s Analytics</h1>
                    <button className="closeInfo"
                        onClick={() => closeStockInfo(false)}> X </button>
                </div>
                <div className="body">
                    <p>GRAPH: has historical data and predicted data, with a marking on the current date</p>
                </div>
                <div className="footer">
                    <button>Buy Stock</button>
                    <button className="cancel-btn"onClick={() => closeStockInfo(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}