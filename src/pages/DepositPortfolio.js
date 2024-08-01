import Header from '../components/Header';
import { useEffect, useState } from 'react';
import '../components/Portfolio.css';
import { useParams, useNavigate } from 'react-router-dom';

export default function DepositPortfolio({setOpenDeposit}) {
    let uid = localStorage.getItem('userid');
    const portfolioID = useParams().id;
    const navigate = useNavigate();
    const [portfolioList, setPortfolioList] = useState([]);
    const [portfolio, setPortfolio] = useState([]);
    const [amounts, setAmounts] = useState({});
    const [bankamt, setBankAmt] = useState();
    const [temp, setTemp] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/getportfolios/${uid}/${portfolioID}`);
                const jsonData = await response.json();
                setPortfolioList(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, [temp, portfolioList]);
    useEffect (() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/portfolios/${portfolioID}/${uid}`);
                const jsonData = await response.json();
                setPortfolio(jsonData[0]);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, [temp, portfolio]);

    async function updateCash(id, amt) {
        try {
            const response = await fetch(`http://localhost:5000/portfolios/${id}/${uid}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cash_account: amt })
            });
            const jsonData = await response.json();
        } catch (err) {
            console.error(err.message);
        }
    }

    const handleClick = (pid, currentcash) => {
        const amount = amounts[pid] || 0;
        if (currentcash - amount > 0) {
            updateCash(pid, Number(currentcash) - Number(amount));
            updateCash(portfolioID, Number(portfolio.cash_account) + Number(amount));
            setTemp(1);
            setAmounts({});
        } else {
            alert('Not enough cash in portfolio');
        }
    }

    const handleDeposit = () => {
        updateCash(portfolioID, Number(portfolio.cash_account) + Number(bankamt));
        setTemp(1);
        setBankAmt(0);
    }
    // const handleInputChange = (e) => {
    //     setAmount(Number(e.target.value));
    // }
    const handleInputChange = (e, pid) => {
        setAmounts({ ...amounts, [pid]: Number(e.target.value) });
    }
    const handleBankChange = (e) => {
        setBankAmt(Number(e.target.value));
    }

    return (
        <div>
            <Header profile={true}/>
            <div className='portfolio-info'>
                <h1 className='portfolio-title'>Deposit From a Portfolio or From your bank</h1>
                <button className='button' onClick={() => setOpenDeposit(false)}>X</button>
            </div>
            <h3>You are depositing into Portfolio #{portfolioID}</h3>
            <h2>Cash Account: ${portfolio.cash_account}</h2>
            <div className='portfolios'>
                {portfolioList.map((portfolio) => (
                    <div className = "single-portfolio" key={portfolio.portfolioid}>
                        <div>
                            <h2>Portfolio: {portfolio.portfolioid}</h2>
                            <p>Cash Account: ${portfolio.cash_account}</p>
                        </div>
                        <input key={portfolio.portfolioid} className='money-input' type='number' placeholder='Amount' value={amounts[portfolio.portfolioid] || ''} onChange={(e) => handleInputChange(e, portfolio.portfolioid)}></input>
                        <button onClick={() => handleClick(portfolio.portfolioid, portfolio.cash_account)}>Deposit</button>
                    </div>
                ))}
            </div>
            <div style={{alignItems: 'center', textAlign: 'center', paddingBottom: '50px'}}>
                <h3>Deposit into the portfolio from your bank account:</h3>
                <input style={{height: '50px', width: '300px', margin: '0 auto'}} type='number' placeholder='Enter Amount' value={bankamt} onChange={handleBankChange}></input>
                <button onClick={() => handleDeposit()}>Deposit</button>
            </div>
        </div>
    );
}