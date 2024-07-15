import './StockHolding.css';
import { useState } from 'react';

export default function StockHolding({ updateCashAccount }) {
    const [amount, setAmount] = useState(500);
    const [tempAmount, setTempAmount] = useState(0);
    const [stockPrice, setStockPrice] = useState(50);
    const [cost, setCost] = useState(0);
    const [confirm, setConfirm] = useState(false);
    
    function buy() {
        setTempAmount(tempAmount + 1);
        setCost((tempAmount + 1) * stockPrice);
    }
    function sell() {
        setTempAmount(tempAmount - 1);
        setCost((tempAmount - 1) * stockPrice);
    }
    function confirmSale() {
        setConfirm(true);
        setTempAmount(0);
        setAmount(amount + tempAmount);
        updateCashAccount(cost);
        setCost(0);
    }
    function rejectSale() {
        setConfirm(false);
        setTempAmount(0);
        setCost(0);
    }
    return(
        <tr>
            <th scope="row">APL</th>
            <td>{amount}</td>
            <td>{stockPrice}</td>
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