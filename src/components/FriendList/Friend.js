import "./Friend.css";
import { useState, useEffect } from "react";
function Friend({ id }) {
    const [friend, setFriend] = useState([]);

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
    
    return (
        <div className="singlefriend">
            <img className="profilepic" src={friend.profilepic_url}></img>
            <h1 style={{ marginRight: "1rem" }}>{ friend.username }</h1>
        </div>
    );
}
export default Friend;