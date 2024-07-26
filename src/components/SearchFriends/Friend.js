import '../FriendList/Friend.css'
function Friend() {
    return (
        <div className='singlefriend'>
            <img className="profilepic" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"></img>
            <div className='friend-info'>
                <h1>Username</h1>
                <div className='extra-info'>
                    <p># followers</p>
                </div>
            </div>
            <button>Add Friend</button>
        </div>
    );
}

export default Friend;