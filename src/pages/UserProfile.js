import Header from '../components/Header';
import FriendList from '../components/FriendList/FriendList';
import '../components/User.css';
import { useNavigate } from "react-router-dom";
import SearchFriends from '../components/SearchFriends/SearchFriends';
import { useState, useEffect } from 'react';

export default function UserProfile() {
    const uid = localStorage.getItem('userid');
    const [userInfo, setUserInfo] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    const [openSearch, setOpenSearch] = useState(false);
    const navigate = useNavigate();
    
    function handlePortfolio(){
        navigate('/portfolio');
    }

    function handleStockLists(){
        navigate('/mystocklists');
    }
    
    const getUserInfo = async () => {
        try {
            const response = await fetch(`http://localhost:5000/users/${uid}`);
            const jsonData = await response.json();
            setUserInfo(jsonData);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getFriendCount = async () => {
        try {
            const response = await fetch(`http://localhost:5000/friendcount/${uid}`);
            const jsonData = await response.json();
            setFriendCount(jsonData.count);
        } catch (err) {
            console.error(err.message);
        }
    };
    
    useEffect(() => {
        getUserInfo();
    }, []);
    useEffect(() => {
        getFriendCount();
    }, [friendCount]);
    
    if (openSearch) {
        return (
            <div>
                <Header />
                <SearchFriends search={setOpenSearch}/>
            </div>
        );
    }
    return (
        <div>
            <Header logout={true}/>
            <div className='user'>
                <img className="profilepic" src={userInfo.profilepic_url}></img>
                <div className='user-info'>
                    <h1>{userInfo.username}</h1>
                    <div className='extra-info'>
                        <p>{friendCount} Friend(s)</p>
                    </div>
                </div>
            </div>
            <div className='sick-stuff'>
                <FriendList />
                <div className='doing-stuff'>
                    <button onClick={handlePortfolio}>Access Portfolios</button>
                    <button onClick={handleStockLists}>Manage Stock List</button>
                    <button>Analyze Performance</button>
                    <button onClick={() => setOpenSearch(true)}>Add Friends</button>
                </div>
            </div>
        </div>
    );
}