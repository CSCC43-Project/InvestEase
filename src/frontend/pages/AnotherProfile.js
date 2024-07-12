import Header from '../components/Header';
import '../components/User.css';
import StockList from '../components/StockList/StockList';

export default function AnotherProfile() {
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
                        <p># followers</p>
                    </div>
                </div>
            </div>
            <div>
                <h1>Stock Lists</h1>
                <StockList />
            </div>
            <button style={{ textDecoration: 'underline', fontSize: 'larger' }}
                    className='portfolio-stat'>
                    View Portfolio Statistics
            </button>
        </div>
    );
}