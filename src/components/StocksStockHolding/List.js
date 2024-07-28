import { useState, useEffect } from 'react';
import SingleResult from './SingleResult';
import './StocksStockHolding.css';

export default function List({ stocklist }) {
    const [latestStocks, setLatestStocks] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/lateststocks`);
                const jsonData = await response.json();
                setLatestStocks(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    });

    //search
    // const response = await fetch(`http://localhost:5000/lateststocks/${search}`);

    return(
        <div>
            <h1 className='title'>Add Stocks to Stock Holding</h1>
            <div className='search'>
                <h2 className='stockheader'> Search for Stocks</h2>
                <div className='searc'>
                    <input classname='inputbar' placeholder="Enter a symbol" type='text'></input>
                    <button className='searchButton'>Search</button>
                </div>
                <button onClick={() => stocklist(false)}>Back</button>
            </div>
            <div style={{ height: '500px', overflowY: 'scroll' }}>
            <h2>Results</h2>
                <table>
                    <thread>
                        <tr>
                            <th scope="col">Stock Symbol</th>
                            <th scope="col">Stock Timestamp</th>
                            <th scope="col">Close Value</th>
                            <th scope="col">Volume</th>
                            <th scope="col">Add to Stock Holding</th>
                        </tr>
                    </thread>
                    <tbody className='stocks'>
                        {latestStocks.map((stock) => (
                            <SingleResult stock={stock}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}