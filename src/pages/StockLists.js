import Header from "../components/Header";
import './StockList.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";

export default function StockLists(){
    let uid = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [stockLists, setStockLists] = useState([]);
    const [filter, setFilter] = useState('all');

    function handleClick(listId) {
        navigate(`/mystocklists/${listId}`)
    }

    useEffect(() => {
        if (filter === 'all') {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocklists/${uid}`);
                const jsonData = await response.json();
                setStockLists(jsonData);
                console.log("set all");
            } catch (err) {
                console.error(err.message);
            }
        })();
    } else if (filter === 'public') {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/publicstocklists/${uid}`);
                const jsonData = await response.json();
                setStockLists(jsonData);
                console.log("set public");
            } catch (err) {
                console.error(err.message);
            }
        })();
    } else if (filter === 'shared') {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/ownersharedstocklists/${uid}`);
                const jsonData = await response.json();
                setStockLists(jsonData);
                console.log("set shared");
            } catch (err) {
                console.error(err.message);
            }
        })();
    } else {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/privatestocklists/${uid}`);
                const jsonData = await response.json();
                setStockLists(jsonData);
                console.log("set private");
            } catch (err) {
                console.error(err.message);
            }
        })();
    }
    }, [filter]);

    async function addStockList() {
        try {
            const res = await fetch(`http://localhost:5000/stocklistcount/${uid}`);
            const json = await res.json();
            const response = await fetch(`http://localhost:5000/stocklists/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stocklistid: Number(json.count) + 1 })
            });
            const jsonData = await response.json();
            window.location.reload();
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <div>
            <Header profile={true}/>
            <div className="portfolio-info"> 
                <h1 className="stock-list-title">Stock Lists</h1>
                <button className='portfolio-add-button' onClick={() => addStockList()}>Add Stock List</button>
            </div>
            <div className='filter'>
                <h3>Filter Stock Lists: </h3>
                <button className='filter-button' onClick={() => setFilter('all')}>All</button>
                <button className='filter-button' onClick={() => setFilter('public')}>Public</button>
                <button className='filter-button' onClick={() => setFilter('shared')}>Shared</button>
                <button className='filter-button' onClick={() => setFilter('private')}>Private</button>
            </div>
            <div className="container">
                {stockLists.map((stocklist) => (
                    <div className="stockList">
                        <h2>Stock List: {stocklist.stocklistid}</h2>
                        <button className="editButton" onClick={() => handleClick(stocklist.stocklistid)}>Edit list</button>
                    </div>
                ))}
            </div>
        </div>
    );
}