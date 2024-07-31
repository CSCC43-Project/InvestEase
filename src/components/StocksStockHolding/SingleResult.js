import { useParams } from 'react-router-dom';
import './StocksStockHolding.css';
export default function SingleResult({ stock , listBool, holdingBool, id}) {
    const uid = localStorage.getItem('userid');

    async function addStockList() {
        try {
            const response = await fetch(`http://localhost:5000/addstocklist/${id}/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stock_symbol: stock.symbol,
                    timestamp: stock.timestamp,
                    num_shares: 0
                })
            });
            const jsonData = await response.json();
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }

    async function addStockHolding() {
        try {
            const response = await fetch(`http://localhost:5000/stockholding/${id}/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    stock_symbol: stock.symbol,
                    timestamp: stock.timestamp,
                    num_shares: 0
                })
            });
            const jsonData = await response.json();
            window.location.reload();
            console.log(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <tr>
            <th scope="row">{stock.symbol}</th>
            <td>{stock.timestamp}</td>
            <td>${stock.close}</td>
            <td>{stock.volume}</td>
            { holdingBool && (
                <td><button onClick={() => addStockHolding()}>Add</button></td>
            )}
            { listBool && (
                <td><button onClick={() => addStockList()}>Add</button></td>
            )}
        </tr>
    );
}