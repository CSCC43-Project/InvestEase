import './SearchFriends.css';
import Friend from './Friend';
function SearchFriends({ search }) {
    return (
        <div className="background">
            <div className="container">
                <div className="header">
                    <h1>Find your friends</h1>
                    <button 
                        className="closeInfo"
                        onClick={() => search(false)}>Back
                    </button>
                </div>
                <div className="search">
                    <input className="searchBar" type="text" placeholder="Search for friends"></input>
                    <button className='searchButton'>Search</button>
                </div>
                <div className='res'>
                    <h2>Results</h2>
                    <div className='allresults'>
                        <Friend />
                        <Friend />
                        <Friend />
                        <Friend />
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchFriends;