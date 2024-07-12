import './StockHoldingList.css';
import StockHolding from './StockHolding';
export default function Table() {
    return (
    <table>
        <thead>
            <tr>
                <th scope="col">Stock Symbol</th>
                <th scope="col">Amount Owned</th>
                <th scope="col">Stock Price</th>
                <th scope="col">Buy</th>
                <th scope="col">Sell</th>
                <th scope="col">Cost</th>
                <th scope="col">Confirm Sale</th>
            </tr>
        </thead>
        <tbody className='stocks'>
            <StockHolding />
            <StockHolding />
            <StockHolding />
            <StockHolding />
            <StockHolding />
            <StockHolding />
        </tbody>
    </table>
    );
}