import { useParams } from 'react-router-dom';
import './StocksStockHolding.css';
export default function SingleResult({ stock }) {
    const uid = localStorage.getItem('userid');
    const portfolioID = useParams().id;
    async function addStock() {
        try {
            const response = await fetch(`http://localhost:5000/stockholding/${portfolioID}/${uid}`, {
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
            <td><button onClick={() => addStock()}>Add</button></td>
        </tr>
    );
}