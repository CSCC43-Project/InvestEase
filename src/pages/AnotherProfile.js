import Header from '../components/Header';
import '../components/User.css';
import StockList from '../components/StockList/StockList';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function AnotherProfile() {
    const [userInfo, setUserInfo] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    const [filter, setFilter] = useState('both');
    let id = useParams().id;
    // get user info from id
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${id}`);
                const jsonData = await response.json();
                setUserInfo(jsonData);
            } catch (err) {
                console.error(err.message);
            }
        })
        ();
    }, []);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/friendcount/${id}`);
                const jsonData = await response.json();
                setFriendCount(jsonData.count);
            } catch (err) {
                console.error(err.message);
            }
        })
        ();
    }, []);

    return (
        <div>
            <Header profile={true}/>
            <div className='user'>
                <img className="profilepic" src={userInfo.profilepic_url}></img>
                <div className='user-info'>
                    <h1>{userInfo.username}</h1>
                    <div className='extra-info'>
                        <p>{friendCount} followers</p>
                    </div>
                </div>
            </div>
            <div>
                <div className="another-user-container">
                    <h1 className='another-user-left-title'>Stock Lists</h1>
                    <div className='filter'>
                        <h3>Filter Lists</h3>
                        <button onClick={() => setFilter('both')}>All</button>
                        <button onClick={() => setFilter('public')}>Public</button>
                        <button onClick={() => setFilter('shared')}>Shared</button>
                    </div>
                </div>
                <StockList filter={filter}/>
            </div>
            
        </div>
    );
}