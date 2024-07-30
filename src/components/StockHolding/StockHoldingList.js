import './StockHoldingList.css';
import StockHolding from './StockHolding';
import { useState, useEffect } from 'react';

export default function StockHoldingList({ cashAccount, portfolioID }) {
    const uid = localStorage.getItem('userid');
    const [stockHoldings, setStockHoldings] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/stockholdings/${portfolioID}/${uid}`);
                const jsonData = await response.json();
                setStockHoldings(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    return (
    <table>
        <thead>
            <tr>
                <th scope="col">Stock Symbol</th>
                <th scope="col">Amount Owned</th>
                <th scope="col">Price when Bought</th>
                <th scope="col">Current Price</th>
                <th scope="col">Buy</th>
                <th scope="col">Sell</th>
                <th scope="col">Cost</th>
                <th scope="col">Confirm Sale</th>
            </tr>
        </thead>
        <tbody className='stocks'>
            {stockHoldings.map((stock) => (
                <StockHolding key={stock.stockid} stock={stock} cashAccount={cashAccount} />
            ))}
        </tbody>
    </table>
    );
}