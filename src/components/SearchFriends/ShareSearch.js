import './SearchFriends.css';
import ShareFriend from './ShareFriend';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function ShareSearch({ search }) {
    const uid = localStorage.getItem('userid');
    const stocklistid = useParams().id;
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        (async () => {
            try {
                const response = await fetch(`http://localhost:5000/sharedstocklist/${stocklistid}/${uid}`);
                const jsonData = await response.json();
                setSearchResults(jsonData);
                console.log(jsonData);
            } catch (err) {
                console.log('Error occured when fetching users');
            }
        })();
    }, []);

    useEffect(() => {
        const searchBar = document.querySelector('.searchBar');
        const searchButton = document.querySelector('.searchButton');
        searchButton.addEventListener('click', async () => {
            try {
                const response = await fetch(`http://localhost:5000/searchShare/${searchBar.value}/${uid}`);
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
                    <h1>Share your Stock List with your Friends</h1>
                    <button 
                        className="closeInfo"
                        onClick={() => search(false)}>Back
                    </button>
                </div>
                <div className="search">
                    <input className="searchBar" type="text" placeholder="Search for your friends"></input>
                    <button className='searchButton'>Search</button>
                </div>
                <div className='res'>
                    <h2>Results</h2>
                    <div className='allresults'>
                        {searchResults.map((search) => (
                            <ShareFriend key={search.userid} id={search.userid} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default ShareSearch;