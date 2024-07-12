import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './frontend/pages/Home';
import Login from './frontend/pages/Login';
import Register from './frontend/pages/Register';
import Profile from './frontend/pages/UserProfile';
import AnotherProfile from './frontend/pages/AnotherProfile';


export default function App() {
    // const [stocks, setStocks] = useState(false);

    // function getStocks() {
    //     fetch('http://localhost:3001')
    //     .then(response => {
    //         return response.text();
    //     })
    //     .then(data => {
    //         setStocks(data);
    //     });
    // }
    // useEffect(() => {
    //     getStocks();
    // }, []);
    return (
        <BrowserRouter>
            <Routes>
                <Route index element = {<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                // page for user profile
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<AnotherProfile />} />
            </Routes>
        </BrowserRouter>
    );
}