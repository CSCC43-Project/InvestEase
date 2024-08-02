import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SingleStatistics from './SingleStatistics';
import './Statistics.css'

export default function Statistics({ setOpenStatistics, isPortfolio, id, uid }) {
    // const uid = localStorage.getItem('userid');
    // const { id } = useParams().id;
    const [stocks, setStocks] = useState([]);
    const [length, setLength] = useState(0);
    const [covMatrix, setCovMatrix] = useState([]);
    const [corrMatrix, setCorrMatrix] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const endpoint = isPortfolio ? `stockholdings/${id}/${uid}` : `stocklistitems/${uid}/${id}`;
                const response = await fetch(`http://localhost:5000/${endpoint}`);
                const jsonData = await response.json();
                setStocks(jsonData);
                setLength(jsonData.length);
            } catch (err) {
                console.error(err.message);
            }
        };

        fetchData();
    }, [id, uid, isPortfolio]);

    async function getCovariance(symbol1, symbol2) {
        const cachedData = sessionStorage.getItem(`cov-${symbol1}-${symbol2}`);
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            try {
                const response = await fetch(`http://localhost:5000/cov/${symbol1}/${symbol2}`);
                const jsonData = await response.json();
                sessionStorage.setItem(`cov-${symbol1}-${symbol2}`, JSON.stringify(jsonData));
                return jsonData;
            } catch (err) {
                console.error(err.message);
                return null;
            }
        }
    }

    async function getCorrelation(symbol1, symbol2) {
        const cachedData = sessionStorage.getItem(`corr-${symbol1}-${symbol2}`);
        if (cachedData) {
            return JSON.parse(cachedData);
        } else {
            try {
                const response = await fetch(`http://localhost:5000/corr/${symbol1}/${symbol2}`);
                const jsonData = await response.json();
                sessionStorage.setItem(`corr-${symbol1}-${symbol2}`, JSON.stringify(jsonData));
                return jsonData;
            } catch (err) {
                console.error(err.message);
                return null;
            }
        }
    }

    useEffect(() => {
        const calculateCovarianceMatrix = async () => {
            const matrixSize = length;
            const matrix = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));

            const promises = [];
            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    const symbol1 = isPortfolio ? stocks[i].stock_symbol : stocks[i].symbol;
                    const symbol2 = isPortfolio ? stocks[j].stock_symbol : stocks[j].symbol;
                    const promise = getCovariance(symbol1, symbol2)
                        .then(cov => {
                            if (cov !== null) {
                                matrix[i][j] = cov;
                            }
                        });
                    promises.push(promise);
                }
            }

            await Promise.all(promises);
            setCovMatrix(matrix);
            sessionStorage.setItem(`covMatrix-${isPortfolio}-${uid}-${id}`, JSON.stringify(matrix));
        };

        const cachedCovMatrix = sessionStorage.getItem(`covMatrix-${isPortfolio}-${uid}-${id}`);
        if (cachedCovMatrix) {
            setCovMatrix(JSON.parse(cachedCovMatrix));
        } else if (stocks.length > 0) {
            calculateCovarianceMatrix();
        }
    }, [stocks, length]);

    useEffect(() => {
        const calculateCorrelationMatrix = async () => {
            const matrixSize = length;
            const matrix = Array(matrixSize).fill().map(() => Array(matrixSize).fill(0));

            const promises = [];
            for (let i = 0; i < matrixSize; i++) {
                for (let j = 0; j < matrixSize; j++) {
                    const symbol1 = isPortfolio ? stocks[i].stock_symbol : stocks[i].symbol;
                    const symbol2 = isPortfolio ? stocks[j].stock_symbol : stocks[j].symbol;
                    if (i === j) {
                        matrix[i][j] = 1;
                    } else { 
                        const promise = getCorrelation(symbol1, symbol2)
                        .then(corr => {
                            if (corr !== null) {
                                matrix[i][j] = corr;
                            }
                        });
                    promises.push(promise);
                    }
                }
            }

            await Promise.all(promises);
            setCorrMatrix(matrix);
            sessionStorage.setItem(`corrMatrix-${isPortfolio}-${uid}-${id}`, JSON.stringify(matrix));
        };

        const cachedCorrMatrix = sessionStorage.getItem(`corrMatrix-${isPortfolio}-${uid}-${id}`);
        if (cachedCorrMatrix) {
            setCorrMatrix(JSON.parse(cachedCorrMatrix));
        } else if (stocks.length > 0) {
            calculateCorrelationMatrix();
        }
    }, [stocks, length]);

    return (
        <div>
            <div className='stats-title-container'>
                <h1 className='stats-title'>Portfolio Statistics</h1>
                <button className='stats-title-button' onClick={() => setOpenStatistics(false)}>Back</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th scope="col">Stock Symbol</th>
                        <th scope="col">Coefficient of Variation</th>
                        <th scope="col">Beta Coefficient</th>
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <SingleStatistics key={index} stock_symbol={isPortfolio ? stock.stock_symbol : stock.symbol} />
                    ))}
                </tbody>
            </table>
            <h2 className='stats-subtitle'>Covariance Matrix</h2>
            <table className='stats-matrix'>
                <thead>
                    <tr>
                        <th scope="col">Stock Symbol</th>
                        {stocks.map((stock, index) => (
                            <th key={index} scope="col">{isPortfolio ? stock.stock_symbol : stock.symbol}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={index}>
                            <td>{isPortfolio ? stock.stock_symbol : stock.symbol}</td>
                            {covMatrix[index]?.map((cov, i) => (
                                <td key={i}>{cov}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2 className='stats-subtitle'>Correlation Matrix</h2>
            <table className='stats-matrix'>
                <thead>
                    <tr>
                        <th scope="col">Stock Symbol</th>
                        {stocks.map((stock, index) => (
                            <th key={index} scope="col">{isPortfolio ? stock.stock_symbol : stock.symbol}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {stocks.map((stock, index) => (
                        <tr key={index}>
                            <td>{isPortfolio ? stock.stock_symbol : stock.symbol}</td>
                            {corrMatrix[index]?.map((cov, i) => (
                                <td key={i}>{cov}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}