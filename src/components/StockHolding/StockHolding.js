import './StockHolding.css';
import { useEffect, useState } from 'react';
import SingleStock from '../FullStockInfo/SingleStock';

export default function StockHolding({ stock, cashAccount, openAnalytics, stockSymbol }) {
    const uid = localStorage.getItem('userid');
    const [amount, setAmount] = useState(stock.num_shares);
    const [tempAmount, setTempAmount] = useState(0);
    const [stockPrice, setStockPrice] = useState(0);
    const [latestStockPrice, setLatestStockPrice] = useState(0);
    const [cost, setCost] = useState(0);
    const [confirm, setConfirm] = useState(false);
    
    function buy() {
        setTempAmount(tempAmount + 1);
        setCost((tempAmount + 1) * latestStockPrice);
    }
    function sell() {
        if(amount != 0) {
            setTempAmount(tempAmount - 1);
            setAmount(amount - 1);
            setCost((tempAmount - 1) * latestStockPrice);
        }
    }
    async function confirmSale() {
        try {
            const res = await fetch(`http://localhost:5000/updatevolume/${stock.stock_symbol}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ volume: Math.abs(tempAmount) })
            })
            const data = await res.json();
            if(data){
                updateShares(stock.num_shares + tempAmount);
                updateCash(cashAccount - cost);
                createTransaction();
            } else {
                alert(`Not enough volume to purchase stock: ${stock.stock_symbol}`)
            }
            setConfirm(true);
            setTempAmount(0);
            setCost(0);
        } catch (error) {
            console.error(error);
        }
    }
    function rejectSale() {
        setConfirm(false);
        setTempAmount(0);
        setCost(0);
    }
    // get full stock info
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocks/${stock.stock_symbol}/${stock.timestamp}`);
                const jsonData = await response.json();
                setStockPrice(jsonData[0].close);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/lateststocks/${stock.stock_symbol}`);
                const jsonData = await response.json();
                setLatestStockPrice(jsonData[0].close);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);

    async function updateCash(amount) {
        try {
            const response = await fetch(`http://localhost:5000/portfolios/${stock.portfolioid}/${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cash_account: amount })
            });
            const jsonData = await response.json();
        } catch (err) {
            console.error(err.message);
        }
    }
    async function updateShares(amount) {
        try {
            const response = await fetch(`http://localhost:5000/stockholding/${stock.portfolioid}/${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ num_shares: amount, stock_symbol: stock.stock_symbol, timestamp: stock.timestamp })
            });
            const jsonData = await response.json();
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }
    async function createTransaction() {
        try {
            const response = await fetch(`http://localhost:5000/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ portfolioid: stock.portfolioid, userid: uid, stock_symbol: stock.stock_symbol, timestamp: stock.timestamp, total_cost: cost, num_shares: tempAmount })
            });
            const jsonData = await response.json();
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }

    function handleClick () {
        openAnalytics(true);
        stockSymbol(stock.stock_symbol);
    }
    return (
        <tr>
            <td>
                <button className = 'analytics-button' onClick={() => handleClick()}>View</button>
            </td>
            <th scope="row">{stock.stock_symbol}</th>
            <td>{stock.num_shares}</td>
            <td>{stockPrice}</td>
            <td>{latestStockPrice}</td>
            <td>
                <button className='buy' onClick={buy}>+</button>    
            </td>
            <td>
                <button className='sell' onClick={sell}>-</button>
            </td>
            <td>{cost}</td>
            <td>
                <button className='confirm' onClick={confirmSale}>Yes</button>
                <button className='reject' onClick={rejectSale}>No</button>
            </td>
        </tr>
    );
}