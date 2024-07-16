import { useState } from 'react';
import SingleStock from './SingleStock';

export default function StockInfo({ openStockInfo }) {
    return(
        <tr>
            <td>{stockInformation.stockSymbol}</td>
            <td>{stockInformation.timestamp}</td>
            <td>{stockInformation.open}</td>
            <td>{stockInformation.high}</td>
            <td>{stockInformation.low}</td>
            <td>{stockInformation.close}</td>
            <td>{stockInformation.volume}</td>
            <td><button onClick={() => {openStockInfo(true);}}>View Statistics</button></td>
        </tr>
    );
}

export const stockInformation = {
    stockSymbol: 'GOOGL',
    timestamp: '7/16/2024',
    open: '$2000',
    high: '$2200',
    low: '$1600',
    close: '$1800',
    volume: '5'
}