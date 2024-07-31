import React from "react";
import './SingleStock.css';
import Graph from '../Analytics/Graph';
import { useState, useEffect } from 'react';

export default function SingleStock({ closeStockInfo, stockSymbol }) {
    const [pastData, setPastData] = useState([]);
    const [activeButton, setActiveButton] = useState('Week');

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphingWeek/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('Week');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, [stockSymbol]);

    function handleWeek() {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphingWeek/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('Week');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }
    function handleMonth() {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphingMonth/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('Month');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }
    function handleQuarter() {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphingQuarter/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('Quarter');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }
    function handleYear() {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphingYear/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('Year');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }
    function handle5Years() {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/graphing5Years/${stockSymbol}`);
                const data = await res.json();
                setPastData(data);
                setActiveButton('5 Years');
            } catch (error) {
                console.error(error.message);
            }
        })();
    }

    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>{stockSymbol}'s Analytics</h1>
                    <button className="closeInfo" onClick={() => closeStockInfo(false)}> X </button>
                </div>
                <div className="buttons">
                    <h3>Past Analytics</h3>
                    <button className={activeButton === 'Week' ? 'active' : ''} onClick={() => handleWeek()}>Week</button>
                    <button className={activeButton === 'Month' ? 'active' : ''} onClick={() => handleMonth()}>Month</button>
                    <button className={activeButton === 'Quarter' ? 'active' : ''} onClick={() => handleQuarter()}>Quarter</button>
                    <button className={activeButton === 'Year' ? 'active' : ''} onClick={() => handleYear()}>Year</button>
                    <button className={activeButton === '5 Years' ? 'active' : ''} onClick={() => handle5Years()}>5 Years</button>
                </div>
                <div className="pred-buttons">
                    <h3>Future Prediction</h3>
                    <button>Week</button>
                    <button>Month</button>
                    <button>Quarter</button>
                    <button>Year</button>
                    <button>5 Years</button>
                </div>
                <Graph pastData={pastData}/>
                <div className="footer">
                    <button className="cancel-btn" onClick={() => closeStockInfo(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
