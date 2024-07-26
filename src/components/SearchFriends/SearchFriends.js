import './SearchFriends.css';
import Friend from './Friend';
import { useState, useEffect } from 'react';
function SearchFriends({ search }) {
    const [searchResults, setSearchResults] = useState([]);
    const [friend, setFriend] = useState([]);
    const getAllUsers = async () => {
        try {
            const response = await fetch('http://localhost:5000/searchfriends/1');
            const jsonData = await response.json();
            setSearchResults(jsonData);
        } catch (err) {
            console.log('Error occured when fetching users');
        }
    }
    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        const searchBar = document.querySelector('.searchBar');
        const searchButton = document.querySelector('.searchButton');
        searchButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:5000/users/username/${searchBar.value}`);
                const jsonData = await response.json();
                setSearchResults(jsonData);
            } catch (err) {
                console.log('Error occured when fetching user');
            }
        });
    }, []);

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
                        {searchResults.map((search) => (
                            <Friend key={search.userid} id={search.userid} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SearchFriends;