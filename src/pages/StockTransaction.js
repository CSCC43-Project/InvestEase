import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

export default function StockTransaction({openTransactions}) {
    const [stockInfo, setStockInfo] = useState([]);
    const portfolioID = useParams().id;
    const uid = localStorage.getItem('userid');
    const type = '';

    // const stockInfo = [
    //     {stock: 'Apple', timestamp: '12:00', date: '12/12/2021', price: '-100', shares: 10, transaction: 'Bought'},
    //     {stock: 'Google', timestamp: '12:00', date: '12/12/2021', price: '200', shares: 5, transaction: 'Sold'},
    //     {stock: 'Amazon', timestamp: '12:00', date: '12/12/2021', price: '-300', shares: 2, transaction: 'Bought'},
    //     {stock: 'Tesla', timestamp: '12:00', date: '12/12/2021', price: '400', shares: 1, transaction: 'Sold'},
    // ];
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/transactions/${portfolioID}/${uid}`);
                const jsonData = await response.json();
                setStockInfo(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    return(
        <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginInline: '20px'}}>
                <h1>Stock Transactions for Portfolio # {portfolioID}</h1>
                <button onClick={() => openTransactions(false)}>Back</button>
            </div>
            <div style={{ height: '500px', overflowY: 'scroll' }}>
                <table>
                    <thead>
                        <tr>
                            <th>Stock</th>
                            <th>Timestamp</th>
                            <th>Date Bought</th>
                            <th>Price</th>
                            <th>Shares</th>
                            <th>Transaction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stockInfo.map((stock, index) => (
                            <tr key={index}>
                                <td>{stock.stock_symbol}</td>
                                <td>{stock.timestamp}</td>
                                <td>{stock.time_of_purchase}</td>
                                <td>${-1*(stock.total_cost)}</td>
                                <td>{Math.abs(stock.num_shares_purchased)}</td>
                                <td>
                                    {stock.total_cost > 0 ? 'Bought' : 'Sold'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}