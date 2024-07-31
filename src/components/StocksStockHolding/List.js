import { useState, useEffect, useRef } from 'react';
import SingleResult from './SingleResult';
import './StocksStockHolding.css';

export default function List({ stocklist , listBool, holdingBool, id}) {
    const [latestStocks, setLatestStocks] = useState([]);
    const searchBarRef = useRef(null);
    const searchButtonRef = useRef(null);

    useEffect(() => {
        const getLatestStocks = async () => {
            try {
                const response = await fetch('http://localhost:5000/lateststocks');
                const jsonData = await response.json();
                setLatestStocks(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };

        getLatestStocks();
    }, []);
    useEffect(() => {
        const searchbar = searchBarRef.current;
        const searchButton = searchButtonRef.current;
        
        const handleClick = async () => {
            try {
                const response = await fetch(`http://localhost:5000/lateststocks/${searchbar.value}`);
                const jsonData = await response.json();
                setLatestStocks(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        };

        searchButton.addEventListener('click', handleClick);

        return () => {
            searchButton.removeEventListener('click', handleClick);
        };
    }, []);
    
    return(
        <div>
            { listBool && (
                <h1 className='title'>Add Stocks to Stock List: {id}</h1>
            )}
            { holdingBool && (
                <h1 className='title'>Add Stocks to Stock Holding</h1>
            )}
            <div className='search'>
                <h2 className='stockheader'> Search for Stocks</h2>
                <div className='searc'>
                    <input classname='inputbar' placeholder="Enter a symbol" type='text' ref={searchBarRef}></input>
                    <button className='searchButton' ref={searchButtonRef}>Search</button>
                </div>
                <button onClick={() => stocklist(false)}>Back</button>
            </div>
            <div style={{ height: '500px', overflowY: 'scroll' }}>
            <h2>Results</h2>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Stock Symbol</th>
                            <th scope="col">Stock Timestamp</th>
                            <th scope="col">Close Value</th>
                            <th scope="col">Volume</th>
                            <th scope="col">Add to Stock Holding</th>
                        </tr>
                    </thead>
                    <tbody className='stocks'>
                        {latestStocks.map((stock) => (
                            <SingleResult stock={stock} listBool={listBool} holdingBool={holdingBool} id={id}/>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}