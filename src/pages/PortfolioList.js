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
            <h1>Portfolio List</h1>
            <div className='portfolios'>
                {portfolioList.map((portfolio) => (
                    <div className = "single-portfolio" onClick = {() => handleClick(portfolio.portfolioid)} key={portfolio.portfolioid}>
                        <h2>{portfolio.portfolioid}</h2>
                        <p>{portfolio.cash_account}</p>
                    </div>
                ))}
            </div>
            <button>Add Portfolio List</button>
        </div>
    );
}