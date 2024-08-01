
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import "./SingleStockList.css"
import ShareSearch from '../components/SearchFriends/ShareSearch';
import { useNavigate } from 'react-router-dom';
import SingleStock from '../components/FullStockInfo/SingleStock';
import List from '../components/StocksStockHolding/List';
import Statistics from '../components/Stats/Statistics';

export default function SingleStockList(){
    const uid = localStorage.getItem('userid');
    const listId = useParams().id;
    const [isVisible, setIsVisible] = useState(false);
    const [stockListItems, setStockListItems] = useState([]);
    const [reviewsList, setReviewsList] = useState([]);
    const [openSearch, setOpenSearch] = useState(false);
    const [openAnalytics, setOpenAnalytics] = useState(false);
    const [mySymbol, setStockSymbol] = useState('');
    const [openStocks, setOpenStocks] = useState(false);
    const [view, setView] = useState('analytics');
    const navigate = useNavigate();
    const [openStats, setOpenStats] = useState(false);

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/mystocklistinfo/${uid}/${listId}`);
                const data = await res.json();
                setIsVisible(data.is_public);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    const toggleVisibility = () => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/stocklists/updatevisibility/${uid}/${listId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ is_public: !isVisible })
                });
                const data = await res.json();
                setIsVisible(!isVisible);
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    useEffect(() => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/stocklistitems/${uid}/${listId}`);
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
                const res = await fetch(`http://localhost:5000/reviews/${uid}/${listId}`);
                const data = await res.json();
                setReviewsList(data);
            } catch (error) {
                console.error(error.message);
            }
        })();
    }, []);

    const deleteReview = (reviewId) => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/reviews/${uid}/${listId}/${reviewId}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                setReviewsList(reviewsList.filter((review) => review.reviewid !== reviewId));
                window.location.reload();
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    const deleteStockList = () => {
        (async () => {
            try {
                const res = await fetch(`http://localhost:5000/allreviews/${uid}/${listId}`, {
                    method: 'DELETE'
                });
                const response = await fetch(`http://localhost:5000/stocklists/${uid}/${listId}`, {
                    method: 'DELETE'
                });
                const data = await response.json();
                navigate('/mystocklists');
            } catch (error) {
                console.error(error.message);
            }
        })();
    };

    const deleteStock = (symbol) => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/deletestock/${uid}/${listId}/${symbol}`, {
                    method: 'DELETE'
                });
                const data = await res.json();
                setStockListItems(stockListItems.filter((stock) => stock.symbol !== symbol));
            } catch (error) {
                console.error(error.message);
            }
        })();
    }

    const addStock = (symbol) => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/addshare/${uid}/${listId}/${symbol}`, {
                    method: 'PUT'
                });
                const data = await res.json();
                setStockListItems(data);
            } catch (error) {
                console.error(error.message);
            }
        })()
    }

    const subStock = (symbol) => {
        ( async () => {
            try {
                const res = await fetch(`http://localhost:5000/subshare/${uid}/${listId}/${symbol}`, {
                    method: 'PUT'
                });
                const data = await res.json();
                if(res.ok){
                    setStockListItems(data)
                }
            } catch (error) {
                console.error(error.message);
            }
        })()
    }

    function handleAnalytics(symbol){
        setOpenAnalytics(true);
        setStockSymbol(symbol);
    }

    function handleAddStock() {
        setOpenStocks(true);
    }

    function handleEditStock() {
        if(view === 'analytics'){
            setView('edit');
        } else if(view === 'edit'){
            setView('analytics');
        }
        
    }

    if (openAnalytics) {
        return (
            <div>
                <Header profile={true}></Header>
                <SingleStock closeStockInfo={setOpenAnalytics} stockSymbol={mySymbol} />
            </div>
        );
    }

    if (openSearch) {
        return (
            <div>
                <Header profile={true}></Header>
                <ShareSearch search={setOpenSearch}></ShareSearch>
            </div>
        );
    }
    if (openStocks) {
        return (
            <div>
                <Header profile={true}/>
                <List stocklist={setOpenStocks} listBool={true} holdingBool={false} id={listId}/>
            </div>
        );
    }

    if (openStats) {
        return (
            <div>
                <Header profile={true} />
                <Statistics setOpenStatistics={setOpenStats} isPortfolio={false} id={listId} uid = {uid}/>
            </div>
        );
    }

    return (
        <div>
            <Header profile={true}></Header>
            <div className="stock-list">
                <h1 className='stock-list-title'>Stock List: {listId}</h1>
                <button onClick={() => setOpenStats(true)}>View Statistics</button>
                <button style={{background: "#8b4a4a"}} onClick={() => deleteStockList()}>Delete Stock List</button>
                <div className="toggleContainer">
                    {isVisible === false && (
                        <button className="share-button" onClick={() => setOpenSearch(true)}>Share</button>
                    )}
                    <h1>
                        {isVisible === true && (
                            <h1 className={`stock-list-title ${isVisible ? 'visible' : 'hidden'}`}>Public</h1>
                        )}
                        {isVisible === false && (
                            <h1 className={`stock-list-title ${isVisible ? 'visible' : 'hidden'}`}>Not Public</h1>
                        )}
                    </h1>
                    <div className={`toggle-container ${isVisible ? 'visible' : 'hidden'}`} onClick={toggleVisibility}>
                        <div className={`toggle-button ${isVisible ? 'visible' : 'hidden'}`}></div>
                    </div>
                </div>
            </div>
            <table className='stock-list-table'>
                <thead>
                    <tr>
                        { view === 'analytics' && (
                            <th scope='col' className='col-analytics'>Analytics</th>
                        )}
                        { view === 'edit' && (
                            <th scope='col' className='col-analytics'>Edit Shares</th>
                        )}
                        <th scope="col">Stock Symbol</th>
                        <th scope="col">Amount Owned</th>
                        { view === 'edit' && (
                            <th scope='col' className='col-analytics'></th>
                        )}
                    </tr>
                </thead>
                <tbody className='stock-list-item'>
                    {stockListItems.map((item) => (
                        <tr>
                            { view === 'analytics' && (
                                <td className='col-analytics'><button className='analytics-button' onClick={() => handleAnalytics(item.symbol)}>View</button></td>
                            )}
                            { view === 'edit' && (
                                <div>
                                    <td className='col-edit'>
                                        <button className='edit-add-button' onClick={() => addStock(item.symbol)}>+</button>
                                        <button className='edit-sub-button' onClick={() => subStock(item.symbol)}>-</button>
                                    </td>
                                </div>  
                            )}
                            <td>{item.symbol}</td>
                            <td>{item.num_shares}</td>
                            { view === 'edit' && (
                                <td className='col-analytics'><button className='col-remove' onClick={() => deleteStock(item.symbol)}>Delete</button></td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='empty-text-container'>
                { stockListItems == 0 && (
                    <h1 className='empty-text'>There are no stocks in this list.</h1>
                )}
            </div>
            <div className="add-button-container">
                { view === 'analytics' && (
                    <button className='add-button' onClick={handleEditStock}>Edit Stock List</button>
                )}
                { view === 'edit' && (
                    <div>
                        <button className='add-button' onClick={() => setView('analytics')}>Save</button>
                        <button className='add-button' onClick={handleAddStock}>Add stocks to list</button>  
                    </div>
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
                            <button className='delete-review' onClick={() => deleteReview(review.reviewerid)}>Delete</button>
                        </div>
                        <h4 className='review-text'>{review.review_text}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}