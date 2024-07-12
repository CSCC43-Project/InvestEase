import Header from '../components/Header';
import FriendList from '../components/FriendList/FriendList';
import '../components/User.css';

export default function Home() {
    return (
        <div>
            <Header />
            <div className='user'>
                <img className="profilepic" src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/1200px-Default_pfp.svg.png"></img>
                <div className='user-info'>
                    <h1>Username</h1>
                    <div className='extra-info'>
                        <p>City, Province</p>
                        <p>Job/Profession</p>
                    </div>
                </div>
            </div>
            <div className='sick-stuff'>
                <FriendList />
                <div className='doing-stuff'>
                    <button>Access Portfolios</button>
                    <button>Manage Stock List</button>
                    <button>Analyze Performance</button>
                </div>
            </div>
        </div>
    );
}