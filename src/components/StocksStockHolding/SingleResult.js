import './StocksStockHolding.css';
export default function SingleResult({ stock }) {
    // ADD button
    return (
        <tr>
            <th scope="row">{stock.symbol}</th>
            <td>{stock.timestamp}</td>
            <td>${stock.close}</td>
            <td>{stock.volume}</td>
            <td><button>Add</button></td>
        </tr>
    );
}