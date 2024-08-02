import React, { useState, useEffect } from 'react';
import { json } from 'react-router-dom';
export default function SingleStatistics({ setOpenStatistics, stock_symbol }) {
    const [variation, setVariation] = useState(0);
    const [beta, setBeta] = useState(0);

    useEffect (() => {
        const getStats = async () => {
            const cachedData = sessionStorage.getItem(`stats-${stock_symbol}`);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                setVariation(data.coefficient_of_variation);
            } else {
                try {
                    const response = await fetch(`http://localhost:5000/statistics/${stock_symbol}`);
                    const jsonData = await response.json();
                    sessionStorage.setItem(`stats-${stock_symbol}`, JSON.stringify(jsonData));
                    setVariation(jsonData.coefficient_of_variation);
                } catch (err) {
                    console.error(err.message);
                }
            }
        };
        getStats();
    }, [stock_symbol]);

    useEffect (() => {
        const getBeta = async () => {
            const cachedData = sessionStorage.getItem(`beta-${stock_symbol}`);
            if (cachedData) {
                const data = JSON.parse(cachedData);
                setBeta(data);
                console.log(data);
            } else {
                try {
                    const response = await fetch(`http://localhost:5000/beta/${stock_symbol}`);
                    const jsonData = await response.json();
                    sessionStorage.setItem(`beta-${stock_symbol}`, JSON.stringify(jsonData));
                    setBeta(jsonData);
                } catch (err) {
                    console.error(err.message);
                }
            }
        };
        getBeta();
    }, []);

    return (
        <tr key={stock_symbol}>
            <td>
                {stock_symbol}: 
                { beta > 1 ? (
                    "Volatile"
                ) : (
                    "Not Volatile"
                )}
            </td>
            <td>{variation}</td>
            <td>{beta}</td>
        </tr>
    );
}