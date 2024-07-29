import Header from '../components/Header';
import { useEffect, useState } from 'react';
import '../components/Portfolio.css';
import { useNavigate } from 'react-router-dom';

export default function PortfolioList() {
    let uid = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [portfolioList, setPortfolioList] = useState([]);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/portfolios/${uid}`);
                const jsonData = await response.json();
                setPortfolioList(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    
    function handleClick(id) {
        navigate(`/portfolio/${id}`);
    }
    return (
        <div>
            <Header profile={true}/>
            <div className='portfolio-info'>
                <h1 className='portfolio-title'>Portfolio List</h1>
                <button className='portfolio-add-button'>Add Portfolio List</button>
            </div>
            <div className='portfolios'>
                {portfolioList.map((portfolio) => (
                    <div className = "single-portfolio" onClick = {() => handleClick(portfolio.portfolioid)} key={portfolio.portfolioid}>
                        <div>
                            <h2>Portfolio: {portfolio.portfolioid}</h2>
                            <p>Cash Account: ${portfolio.cash_account}</p>
                        </div>
                        <button> Edit Portfolio </button>
                    </div>
                ))}
            </div>
        </div>
    );
}