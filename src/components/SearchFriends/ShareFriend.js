import { useParams } from 'react-router-dom';
import '../FriendList/Friend.css'
import { useState, useEffect } from 'react';

function ShareFriend({id}) {
    const uid = localStorage.getItem('userid');
    const listid = useParams().id;
    const [friend, setFriend] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${id}`);
                const jsonData = await response.json();
                console.log(jsonData);
                setFriend(jsonData);
            } catch (err) {
                console.log('Error occured when fetching user info');
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
                console.log('Error occured when fetching user info');
            }
        })
        ();
    }, [setFriend]);
    async function shareWithFriend() {
        try {
            const response = await fetch(`http://localhost:5000/sharedstocklist/${listid}/${uid}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ shared_userid: id }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occured when sending friend request');
        }
    }
    return (
        <div className='singlefriend'>
            <img className="profilepic" src={friend.profilepic_url}></img>
            <div className='friend-info'>
                <h1>{friend.username}</h1>
                <div className='extra-info'>
                    <p>{friendCount} Friends</p>
                </div>
            </div>
            <button onClick={shareWithFriend}>Share</button>
        </div>
    );
}

export default ShareFriend;