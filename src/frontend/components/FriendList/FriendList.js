import "./FriendList.css";
import Friend from "./Friend";
function FriendList() {
    return (
        <div className="profile">
            <div className="friendslist">
                <div className="friendslist-header">
                    <button className="friendbutton">Friends</button>
                    <button className="friendbutton">Incoming</button>
                    <button className="friendbutton">Outgoing</button>
                </div>
                <div className="friends">
                    <Friend />
                    <Friend />
                    <Friend />
                </div>
            </div>
        </div>
    );
}
export default FriendList;