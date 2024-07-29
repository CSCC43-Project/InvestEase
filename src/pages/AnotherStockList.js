import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function AnotherStockList(){
    const uid = localStorage.getItem('userid');
    const listId = useParams().listid;
    const ownerid = useParams().ownerid;

    const [stockListItems, setStockListItems] = useState([]);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [reviewsList, setReviewsList] = useState([]);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/stocklistitems/${ownerid}/${listId}`);
                const data = await res.json();
                setStockListItems(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/username/${ownerid}`);
                const data = await res.json();
                setOwnerUsername(data.username);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/ownerreviews/${ownerid}/${listId}`);
                const data = await res.json();
                setReviewsList(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    return (
        <div>
            <Header profile={true}/>
            <h1 className='stock-list-title'> {ownerUsername}'s stock list: {listId}</h1>
            <table className='stock-list-table'>
                <thead>
                    <tr>
                        <th scope="col">Stock Symbol</th>
                        <th scope="col">Amount Owned</th>
                    </tr>
                </thead>
                <tbody className='stock-list-item'>
                    {stockListItems.map((item) => (
                        <tr>
                            <td>{item.symbol}</td>
                            <td>{item.num_shares}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='reviews'>
                <h2 className='review-title'>Reviews</h2>
                {reviewsList.map((review) => (
                    <div className='review-item'>
                        <h3>Username: {review.username}</h3>
                        <h4 className='review-text'>{review.review_text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}