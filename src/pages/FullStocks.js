import { useState, useEffect } from 'react';
import StockInfo from "../components/FullStockInfo/StockInfo";
import SingleStock from "../components/FullStockInfo/SingleStock";
import "../components/FullStockInfo/Stocks.css";
export default function Stocks() {
    const [openStocks, setOpenStocks] = useState(false);
    const [stockSymbol, setStockSymbol] = useState('');
    const [stocks, setStocks] = useState([]);
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

    if (openStocks) {
        return (
        <div>
            <SingleStock closeStockInfo={setOpenStocks} stockSymbol={stockSymbol} />
        </div>);
    }
    return (
        <div>
            <h1 className="list">Available Stocks</h1>
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