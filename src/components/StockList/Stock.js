import { useNavigate } from 'react-router-dom';
import './Stock.css';

export default function Stock({ ownerid, stocklist }) {
    const navigate = useNavigate();

    function handleClick(ownerid, listId){
        navigate(`/userstocklist/${ownerid}/${listId}`);
    }

    return(
        <div className="stock-info">
            <h3 className='name'>Stock List: {stocklist.stocklistid}</h3>
            <button className="editButton" onClick={() => handleClick(ownerid, stocklist.stocklistid)}>View list</button>
        </div>
    );
}