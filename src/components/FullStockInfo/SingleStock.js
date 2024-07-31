import React from "react";
import './SingleStock.css';
import Graph from '../Analytics/Graph';
import { useState, useEffect } from 'react';
import FutureGraph from "../Analytics/FutureGraph";

export default function SingleStock({ closeStockInfo, stockSymbol }) {
    const [pastData, setPastData] = useState([]);
    const [activeButton, setActiveButton] = useState('Week');
    const [predButton, setPredButton] = useState('Week');
    const [openTable, setOpenTable] = useState(false);
    const [FP, setFP] = useState(7);

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

    function predWeek() {
        console.log('Setting FP to 7');
        handleWeek();
        setPredButton('Week');
        setFP(7);
    }
    function predMonth() {
        console.log('Setting FP to 30');
        handleMonth();
        setPredButton('Month');
        setFP(30);
    }
    function predQuarter() {
        console.log('Setting FP to 90');
        handleQuarter();
        setPredButton('Quarter');
        setFP(90);
    }
    function predYear() {
        console.log('Setting FP to 365');
        handleYear();
        setPredButton('Year');
        setFP(365);
    }
    function pred5Years() {
        console.log('Setting FP to 1825');
        handle5Years();
        setPredButton('5 Years');
        setFP(1825);
    }

    const [selectedOption, setSelectedOption] = useState('Historical Analytics');

    function handleOptionChange(event) {
        setSelectedOption(event.target.value);
    }

    if (openTable) {
        return (
            <div>
            <div className="header" style={{backgroundColor: 'black'}}>
                <h1>{stockSymbol}'s Analytics Table</h1>
                <button className="closeInfo" onClick={() => setOpenTable(false)}> X </button>
            </div>
            {selectedOption === 'Historical Analytics' && (
                <div className="data-container" style={{maxHeight: '500px', overflowY: 'scroll'}}>
                    <div className="data-header">
                        <h3>Symbol</h3>
                        <h3>Timestamp</h3>
                        <h3>Close</h3>
                    </div>
                {pastData.map((data, index) => (
                    <div key={index} className="data">
                        <p>{data.symbol}</p>
                        <p>{data.timestamp}</p>
                        <p>{data.close}</p>
                    </div>
                ))}
                </div>
            )}
            </div>
        );
    }
    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>{stockSymbol}'s Analytics</h1>
                    <button className="closeInfo" onClick={() => closeStockInfo(false)}> X </button>
                </div>
                <select className="dropdown" onChange={handleOptionChange}>
                    <option value="Historical Analytics">Historical Analytics</option>
                    <option value="Future Prediction">Future Prediction</option>
                </select>
                {selectedOption === 'Historical Analytics' && (
                    <div className="buttons">
                        <button className={activeButton === 'Week' ? 'active' : ''} onClick={() => handleWeek()}>Week</button>
                        <button className={activeButton === 'Month' ? 'active' : ''} onClick={() => handleMonth()}>Month</button>
                        <button className={activeButton === 'Quarter' ? 'active' : ''} onClick={() => handleQuarter()}>Quarter</button>
                        <button className={activeButton === 'Year' ? 'active' : ''} onClick={() => handleYear()}>Year</button>
                        <button className={activeButton === '5 Years' ? 'active' : ''} onClick={() => handle5Years()}>5 Years</button>
                    </div>
                )}
                {selectedOption === 'Future Prediction' && (
                    <div className="pred-buttons">
                        <button className={predButton === 'Week' ? 'active' : ''} onClick={() => predWeek()}>Week</button>
                        <button className={predButton === 'Month' ? 'active' : ''} onClick={() => predMonth()}>Month</button>
                        <button className={predButton === 'Quarter' ? 'active' : ''} onClick={() => predQuarter()}>Quarter</button>
                        <button className={predButton === 'Year' ? 'active' : ''} onClick={() => predYear()}>Year</button>
                        <button className={predButton === '5 Years' ? 'active' : ''} onClick={() => pred5Years()}>5 Years</button>
                    </div>
                )}
                {selectedOption === 'Future Prediction' && (
                    <FutureGraph pastData={pastData} forecastPeriod={FP}/>
                )}
                {selectedOption === 'Historical Analytics' && (
                    <Graph pastData={pastData}/>
                )}
                <div className="footer">
                    {selectedOption === 'Historical Analytics' && (<button onClick={() => setOpenTable(true)}>View Table</button>)}
                    <button className="cancel-btn" onClick={() => closeStockInfo(false)}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
