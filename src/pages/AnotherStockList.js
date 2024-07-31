import Header from '../components/Header';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import SingleStock from '../components/FullStockInfo/SingleStock';

export default function AnotherStockList(){
    const uid = localStorage.getItem('userid');
    const listId = useParams().listid;
    const ownerid = useParams().ownerid;

    const [stockListItems, setStockListItems] = useState([]);
    const [ownerUsername, setOwnerUsername] = useState('');
    const [reviewsList, setReviewsList] = useState([]);
    const [hasUid, setHasUid] = useState(false);

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState('');
    const [addText, setAddText] = useState('');
    const ref = useRef(null);
    const [maxHeight, setMaxHeight] = useState(0);

    const [isPublic, setIsPublic] = useState(false);

    const [openAnalytics, setOpenAnalytics] = useState(false);
    const [mySymbol, setStockSymbol] = useState('');

    const inputChangeEdit = (value) => {
       setEditText(value); 
    }

    const inputChangeAdd = (value) => {
        setAddText(value); 
     }

     function handleAnalytics(symbol){
        setOpenAnalytics(true);
        setStockSymbol(symbol);
    }


    function handleEdit(review){
        setIsEditing(true);
        setEditText(review.review_text);
        if(ref.current){
            setMaxHeight(ref.current.offsetHeight);
        }
    }
    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/listvisibility/${ownerid}/${listId}`);
                const data = await res.json();
                setIsPublic(data.is_public);
            } catch (error) {
                console.error(error.message);
            }
        })();
    })

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
    }, [ownerid, listId]);

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
    }, [ownerid]);

    useEffect(() => {
        ( async () => {
            if(isPublic){
                try {
                    const res = await fetch(`http://localhost:5000/reviews/${ownerid}/${listId}`);
                    const data = await res.json();
                    setReviewsList(data);
                    setHasUid(!data.some(rev => rev.reviewerid.toString() === uid.toString()))
                } catch (error) {
                    console.error(error.message);
                }
            } else {
                try {
                    const res = await fetch(`http://localhost:5000/myreview/${ownerid}/${listId}/${uid}`);
                    const data = await res.json();
                    setReviewsList(data);
                    setHasUid(!data.some(rev => rev.reviewerid.toString() === uid.toString()))
                } catch (error) {
                    console.error(error.message);
                }
            }
        })();
    }, [ownerid, listId, uid, isPublic]);

    const deleteReview = (ownerid) => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${ownerid}/${listId}/${uid}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                setReviewsList(reviewsList.filter((review) => review.reviewid !== ownerid));
                setHasUid(true);
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };


    const addReview = (ownerid, text) => {
        (async () => {
            try {
                const addReview = await fetch('http://localhost:5000/addReview', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({reviewerid: uid, stocklistid: listId, ownerid: ownerid, review_text: text}),
                });
                setIsEditing(false);
                setHasUid(false);
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    const updateReview = (ownerid, text) => {
        (async () => {
            try {
                const updateReview = await fetch('http://localhost:5000/updateReview', {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({reviewerid: uid, stocklistid: listId, ownerid: ownerid, review_text: text}),
                });
                const data = await updateReview.json();
                setIsEditing(false);
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    if (openAnalytics) {
        return (
            <div>
                <Header profile={true}></Header>
                <SingleStock closeStockInfo={setOpenAnalytics} stockSymbol={mySymbol} />
            </div>
        );
    }
    return (
        <div>
            <Header profile={true}/>
            <h1 className='stock-list-title'> {ownerUsername}'s stock list: {listId}</h1>
            <table className='stock-list-table'>
                <thead>
                    <tr>
                    <th scope='col' className='col-analytics'>Analytics</th>
                        <th scope="col">Stock Symbol</th>
                        <th scope="col">Amount Owned</th>
                    </tr>
                </thead>
                <tbody className='stock-list-item'>
                    {stockListItems.map((item) => (
                        <tr key={item.symbol}>
                            <td  className='col-analytics'><button className='analytics-button' onClick={() => handleAnalytics(item.symbol)}>View</button></td>
                            <td>{item.symbol}</td>
                            <td>{item.num_shares}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className='empty-text-container'>
                { stockListItems.length === 0 && (
                    <h1 className='empty-text'>There are no stocks in this list.</h1>
                )}
            </div>

            <div className='reviews'>
                <h2 className='review-title'>Reviews</h2>
                <div className='empty-text-container'>
                    { reviewsList.length === 0 && (
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
                                        { isEditing ? (
                                            <button className='edit-review' onClick={() => updateReview(review.ownerid, editText)}>Save</button>
                                        ) : (
                                            <button className='edit-review' onClick={() => handleEdit(review)}>Edit</button>
                                        )}
                                        <button className='delete-review' onClick={() => deleteReview(ownerid)}>Delete</button>
                                    </div>
                                )}
                            </div>
                        </div>
                        { isEditing && review.reviewerid == uid ? (
                            <textarea style={{height: maxHeight}} className='review-input' type='text' value={editText} onChange={(e) => inputChangeEdit(e.target.value)}/>
                        ) : (
                            <h4 ref={ref} className='review-text'>{review.review_text}</h4>
                        )}
                    </div>
                ))}
                { hasUid && (
                    <div className='add-review-container'>
                        <h2 className='add-review-title'>Add a review</h2>
                        <textarea className='add-review-input' type='text' onChange={(e) => inputChangeAdd(e.target.value)}/>
                        <button className='add-review-button' onClick={() => addReview(ownerid, addText)}>Add Review</button>
                    </div>
                )}
            </div>
        </div>
    );
}