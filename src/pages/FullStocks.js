import { useState } from 'react';
import Header from "../components/Header";
import StockInfo from "../components/FullStockInfo/StockInfo";
import SingleStock from "../components/FullStockInfo/SingleStock";
import "../components/FullStockInfo/Stocks.css";
export default function Stocks() {
    const [openStocks, setOpenStocks] = useState(false);
    if (openStocks) {
        return (
        <div>
            <Header />
            <SingleStock closeStockInfo={setOpenStocks} />
        </div>);
    }
    return (
        <div>
            <Header />
            <h1 className="list">Available Stocks</h1>
            <div className="full-stock-list" style={{ overflowY: 'scroll', height: '500px' }}>
                <table>
                    <thead>
                        <tr>
                            <th scope="col">Symbol</th>
                            <th scope="col">Timestamp</th>
                            <th scope="col">Open</th>
                            <th scope="col">High</th>
                            <th scope="col">Low</th>
                            <th scope="col">Close</th>
                            <th scope="col">Volume</th>
                            <th scope="col"></th>
                        </tr>
                    </thead>
                    <tbody className='stocks'>
                        <StockInfo openStockInfo={setOpenStocks}/>
                        <StockInfo openStockInfo={setOpenStocks}/>
                        <StockInfo openStockInfo={setOpenStocks}/>
                        <StockInfo openStockInfo={setOpenStocks}/>
                        <StockInfo openStockInfo={setOpenStocks}/>
                    </tbody>
                </table>
            </div>
        </div>
    );
}