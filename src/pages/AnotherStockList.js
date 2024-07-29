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
                const res = await fetch(`http://localhost:5000/reviews/${ownerid}/${listId}`);
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

            <div className='empty-text-container'>
                { stockListItems == 0 && (
                    <h1 className='empty-text'>There are no stocks in this list.</h1>
                )}
            </div>

            <div className='reviews'>
                <h2 className='review-title'>Reviews</h2>
                <div className='empty-text-container'>
                    { reviewsList == 0 && (
                        <h1 className='empty-text'>There are no reviews for this list.</h1>
                    )}
                </div>
                {reviewsList.map((review) => (
                    <div className='review-item'>
                        <div className='review-bar'>
                            <div className='reviewer-info'>
                                <img className='profile-pic' src={review.profilepic_url}></img>
                                <h3 className='reviewer-name'>{review.username}</h3>
                            </div>
                            <div>
                                {review.reviewerid == uid && (
                                    <div>
                                        <button className='edit-review'>Edit</button>
                                        <button className='delete-review'>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <h4 className='review-text'>{review.review_text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}