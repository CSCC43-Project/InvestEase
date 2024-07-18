import "./FriendList.css";
import Friend from "./Friend";
import { useState } from "react";

function FriendList() {
    const [friend, setFriend] = useState(true);
    const [incoming, setIncoming] = useState(false);
    const [outgoing, setOutgoing] = useState(false);
    return (
        <div className="profile">
            <div className="friendslist">
                <div className="friendslist-header">
                    <button className="friendbutton" onClick={() => { setFriend(true); setIncoming(false); setOutgoing(false); }}>Friends</button>
                    <button className="friendbutton" onClick={() => { setFriend(false); setIncoming(true); setOutgoing(false); }}>Incoming</button>
                    <button className="friendbutton" onClick={() => { setFriend(false); setIncoming(false); setOutgoing(true); }}>Outgoing</button>
                </div>
                <div className="friends">
                    {friend && 
                    <div>
                        <Friend />
                    </div>}
                    {incoming &&
                    <div>
                        <Friend />
                        <Friend />
                    </div>}
                    {outgoing && 
                    <div>
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                    </div>}
                </div>
            </div>
        </div>
    );
}
export default FriendList;