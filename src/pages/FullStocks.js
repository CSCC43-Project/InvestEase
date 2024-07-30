import { useState, useEffect } from 'react';
import StockInfo from "../components/FullStockInfo/StockInfo";
import SingleStock from "../components/FullStockInfo/SingleStock";
import "../components/FullStockInfo/Stocks.css";
export default function Stocks() {
    const [openStocks, setOpenStocks] = useState(false);
    const [stockSymbol, setStockSymbol] = useState('');
    const [stocks, setStocks] = useState([]);
    const [openAddInfo, setOpenAddInfo] = useState(false);
    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("http://localhost:5000/lateststocks");
                const data = await res.json();
                setStocks(data);
            } catch (err) {
                console.error(err);
            }
        }
        )();
    }, []);

    useEffect(() => {
        const searchBar = document.querySelector('.searchBar');
        const searchButton = document.querySelector('.searchButton');
        searchButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:5000/lateststocks/${searchBar.value}`);
                const jsonData = await response.json();
                setStocks(jsonData);
            } catch (err) {
                console.log('Error occured when fetching user');
            }
        });
    }, []);

    async function addStocks() {
        const symbol = document.querySelector('.symbol').value;
        const open = Number(document.querySelector('.open').value);
        const high = Number(document.querySelector('.high').value);
        const low = Number(document.querySelector('.low').value);
        const close = Number(document.querySelector('.close').value);
        const volume = Number(document.querySelector('.volume').value);
        try {
            const response = await fetch('http://localhost:5000/addstocks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ symbol, open, high, low, close, volume }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occurred when adding stocks');
        }
    }

    if (openStocks) {
        return (
        <div>
            <SingleStock closeStockInfo={setOpenStocks} stockSymbol={stockSymbol} />
        </div>);
    }
    if (openAddInfo) {
        return (
            <div>
                <h2 style={{ marginLeft: '20px' }}>Insert Information About a Stock</h2>
                <div className='guh'>
                    <input className="symbol" placeholder='Enter Stock Symbol: '></input>
                    <input className="open" placeholder='Enter Open Value: ' type="number"></input>
                    <input className="high" placeholder='Enter High Value: ' type="number"></input>
                    <input className="low" placeholder='Enter Low Value: ' type="number"></input>
                    <input className="close" placeholder='Enter Close Value: ' type="number"></input>
                    <input className="volume" placeholder='Enter Volume: ' type="number"></input>
                    <button onClick={() => addStocks()}>Add Stock</button>
                </div>
                <button style={{ marginLeft: '20px' }} onClick={() => setOpenAddInfo(false)}>Close</button>
            </div>
        );
    }
    return (
        <div>
            <div className='header-and-button'>
                <h1 className="list">Available Stocks</h1>
                <button onClick={() => setOpenAddInfo(true)}>Add data to stocks</button>
            </div>
            <div className='searc'>
                <input type="text" placeholder="Search for a stock" className="searchBar"/>
                <button className="searchButton">Search</button>
            </div>
            <div className="full-stock-list" style={{ overflowY: 'scroll', height: '500px' }}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Symbol</th>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Open</th>
                            <th scope="col">High</th>
                            <th scope="col">Low</th>
                            <th scope="col">Close</th>
                            <th scope="col">Volume</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className='stocks'>
                        {stocks.map(stock => (
                            <StockInfo stockInformation={stock} openStockInfo={setOpenStocks} setStockSymbol={setStockSymbol}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}