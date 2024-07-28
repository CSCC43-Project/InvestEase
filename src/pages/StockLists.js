import Header from "../components/Header";
import './StockList.css';
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";

export default function StockLists(){
    let uid = localStorage.getItem('userid');
    const navigate = useNavigate();
    const [stockLists, setStockLists] = useState([]);

    function handleClick(listId) {
        navigate(`/stocklists/${listId}`)
    }

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/stocklists/${uid}`);
                const jsonData = await response.json();
                setStockLists(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })();
    }, []);

    return (
        <div>
            <Header profile={true}/>
            <h1 className="title">Stock Lists</h1>
            <div className="container">
                {stockLists.map((stocklist) => (
                    <div className="stockList">
                        <h2>{stocklist.stocklistid}</h2>
                        <button className="editButton" onClick={() => handleClick(stocklist.stocklistid)}>Edit list</button>
                    </div>
                ))}
            </div>
        </div>
    );
}