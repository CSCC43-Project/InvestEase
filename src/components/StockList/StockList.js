import { useState, useEffect } from 'react';
import Stock from './Stock';
import { useParams } from 'react-router-dom';

export default function StockList() {
    const uid = localStorage.getItem('userid');
    let ownerid = useParams().id;
    const [stocklists, setStocklists] = useState([]);
    
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocklists/${uid}/${ownerid}`);
                const jsonData = await response.json();
                setStocklists(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    });
    return (
        <div>
            {stocklists.map((stocklist) => (
                <div>
                    <Stock key={stocklist.stocklist_id} ownerid={ownerid} stocklist={stocklist} />
                </div>
                ))}
        </div>
    );
}
