import React, { useState, useEffect } from 'react';
export default function SingleStatistics({ setOpenStatistics, stock_symbol }) {
    const [variation, setVariation] = useState(0);
    const [beta, setBeta] = useState(0);

    useEffect (() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/statistics/${stock_symbol}`);
                const jsonData = await response.json();
                setVariation(jsonData.coefficient_of_variation);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);
    useEffect (() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/beta/${stock_symbol}`);
                const jsonData = await response.json();
                setBeta(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
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