import Header from '../components/Header';
import StockHoldingList from '../components/StockHolding/StockHoldingList';
import '../components/Portfolio.css';
import { useState } from 'react';

export default function SinglePortfolio() {
    const [cashAccount, setCashAccount] = useState(5000);
    const [marketValue, setMarketValue] = useState(10);

    const updateCashAccount = (amount) => {
        setCashAccount(cashAccount - amount);
    }

    return (
        <div>
            <Header />
            <div className='portfolio' style={{ color: 'white', padding: 5 }}>
                <div className='full-p-info'>
                    <div className='portfolio-info'
                        style={{ color: 'white' }}>
                            <h1>Portfolio Name</h1>
                            <button>View Portfolio Statistics</button>
                    </div>
                    <p><span style={{ fontWeight: 'bold' }}>Owner</span>: Username</p>
                    <p><span style={{ fontWeight: 'bold' }}>Created</span>: Date</p>
                    <p><span style={{ fontWeight: 'bold' }}>Cash Account</span>: ${cashAccount}</p>
                    <p><span style={{ fontWeight: 'bold' }}>Estimated present market value</span>: {marketValue}%</p>
                </div>
            </div>
            <div className='money-transactions'>
                <button className='money'>Deposit</button>
                <button className='money'>Withdraw</button>
            </div>
            <div>
                <h1 style={{ color: 'white', paddingTop: 20 }}>Stock Holdings</h1>
                <StockHoldingList updateCashAccount={updateCashAccount} />
            </div>
            <button className='trans-history'>View Stock Transaction List</button>
            <button className='add-stocks'>Add Stocks to Holdings</button>
        </div>
    );
}