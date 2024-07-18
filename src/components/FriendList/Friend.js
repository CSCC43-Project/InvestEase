import "./Friend.css";
import { useState } from "react";
function Friend() {
    const [friend, setFriend] = useState({
        name: "John Doe",
        username: "johndoe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    });
    return (
        <div className="singlefriend">
            <img className="profilepic" src={friend.avatar}></img>
            <h1 style={{ marginRight: "1rem" }}>{friend.username}</h1>
        </div>
    );
}
export default Friend;