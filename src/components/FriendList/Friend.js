import "./Friend.css";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Friend({ id, type, status }) {
    const uid = localStorage.getItem('userid');
    const [friend, setFriend] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/${id}`);
                const jsonData = await response.json();
                setFriend(jsonData);
            } catch (err) {
                console.log('Error occured when fetching books');
            }
        })
        ();
    }, []);

    const acceptIncoming = async () => {
        console.log('accept button clicked');
        try {
            const response = await fetch(`http://localhost:5000/friendrequest/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendID: id, ownerID: uid }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occurred when accepting friend request');
        }
    };
    const declineIncoming = async () => {
        console.log('decline button clicked');
        try {
            const response = await fetch(`http://localhost:5000/friendrequest/decline`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendID: id, ownerID: uid }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occurred when declining friend request');
        }
    }
    const deleteOutgoing = async () => {
        console.log('delete button clicked');
        try {
            const response = await fetch(`http://localhost:5000/friendrequest/cancel`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ senderID: uid, receiverID: id }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occurred when deleting friend request');
        }
    }
    const deleteMutual = async () => {
        console.log('delete button clicked');
        try {
            const response = await fetch(`http://localhost:5000/friendslist/delete`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ friendID: id, ownerID: uid }),
            });
            window.location.reload();
        } catch (err) {
            console.log('Error occurred when deleting friend');
        }
    }
    
    const handleFriend = (id) => {
        navigate(`/profile/${id}`);
    };

    return (
        <div className="singlefriend">
            { status === 'mutual' &&
                <div className="friend-info">
                    <div className="info" onClick={() => handleFriend(friend.userid)}>
                        <img className="profilepic" src={friend.profilepic_url}></img>
                        <h1 style={{ marginRight: "1rem" }}>{ friend.username }</h1>
                    </div>
                    <div className="acc-buttons">
                        <button className="decline" onClick={deleteMutual}>❌</button>
                    </div>
                </div>
            }
            { type === 'incoming' && status === 'ipr' &&
                <div className="friend-info">
                    <div className="info" onClick={() => handleFriend(friend.userid)}>
                        <img className="profilepic" src={friend.profilepic_url}></img>
                        <h1 style={{ marginRight: "1rem" }}>{ friend.username }</h1>
                    </div>
                    <div className="acc-buttons">
                        <button className="accept" onClick={acceptIncoming}>✅</button>
                        <button className="decline" onClick={declineIncoming}>❌</button>
                    </div>
                </div>}
            { type === 'outgoing' &&
                <div className="friend-info">
                    <div className="info" onClick={() => handleFriend(friend.userid)}>
                        <img className="profilepic" src={friend.profilepic_url}></img>
                        <h1 style={{ marginRight: "1rem" }}>{ friend.username }</h1>
                    </div>
                    <div className="acc-buttons">
                        <button className="decline" onClick={deleteOutgoing}>❌</button>
                    </div>
                </div>
            }
        </div>
    );
}
export default Friend;