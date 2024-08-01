import { useNavigate } from 'react-router-dom';
import './Stock.css';
import { useEffect, useState } from 'react';

export default function Stock({ ownerid, stocklist }) {
    const uid = localStorage.getItem("name");
    const navigate = useNavigate();
    const [isPublic, setIsPublic] = useState(false);

    function handleClick(ownerid, listId){
        navigate(`/userstocklist/${ownerid}/${listId}`);
    }

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/listvisibility/${ownerid}/${stocklist.stocklistid}`);
                const jsonData = await res.json();
                setIsPublic(jsonData.is_public);
            } catch (error) {
                console.error(error.message);
            }
        })()
    })
    
    return(
        <div className="stock-info">
            <h3 className='name'>Stock List: {stocklist.stocklistid}</h3>
            <div className='list-side-container'>
                { isPublic ? (
                    <h2 className='category-public'>Public</h2>
                ): (
                    <h2 className='category-shared'>Shared</h2>
                )}
                <button className="editButton" onClick={() => handleClick(ownerid, stocklist.stocklistid)}>View list</button>
            </div>
        </div>
    );
}