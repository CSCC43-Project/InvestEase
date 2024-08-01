import { useState, useEffect } from 'react';
import Stock from './Stock';
import { useParams } from 'react-router-dom';

export default function StockList({filter}) {
    const uid = localStorage.getItem('userid');
    let ownerid = useParams().id;
    const [stocklists, setStocklists] = useState([]);
    
    useEffect(() => {
        if (filter === 'both') {
            (async () => {
                try {
                    const response = await fetch(`http://localhost:5000/stocklists/${uid}/${ownerid}`);
                    const jsonData = await response.json();
                    setStocklists(jsonData);
                    console.log("set both");
                } catch (err) {
                    console.error(err.message);
                }
            })();
        } else if (filter === 'public') {
            (async () => {
                try {
                    const response = await fetch(`http://localhost:5000/publicstocklists/${ownerid}`);
                    const jsonData = await response.json();
                    setStocklists(jsonData);
                    console.log("set public");
                } catch (err) {
                    console.error(err.message);
                }
            })();
        } else {
            (async () => {
                try {
                    const response = await fetch(`http://localhost:5000/sharedstocklists/${uid}/${ownerid}`);
                    const jsonData = await response.json();
                    setStocklists(jsonData);
                    console.log("set shared");
                } catch (err) {
                    console.error(err.message);
                }
            })();
        }
    }, [filter]);
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
