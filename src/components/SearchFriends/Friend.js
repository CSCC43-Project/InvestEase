import '../FriendList/Friend.css'
import { useState, useEffect } from 'react';

function Friend({id}) {
    const uid = localStorage.getItem('userid');
    const [friend, setFriend] = useState([]);
    const [friendCount, setFriendCount] = useState(0);
    useEffect(() => {
        (async () => {
            try {
                const response = await fetch('http://localhost:5000/users/' + id);
                const jsonData = await response.json();
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
                const response = await fetch('http://localhost:5000/friendcount/' + id);
                const jsonData = await response.json();
                setFriendCount(jsonData.count);
            } catch (err) {
                console.log('Error occured when fetching user info');
            }
        })
        ();
    }, [setFriend]);
    async function addFriend() {
        try {
            const response = await fetch('http://localhost:5000/friendrequest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderID: uid, receiverID: id }),
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
            <button onClick={addFriend}>Add Friend</button>
        </div>
    );
}

export default Friend;