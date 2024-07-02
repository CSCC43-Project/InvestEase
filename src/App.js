import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/UserProfile';
import AnotherProfile from './pages/AnotherProfile';


export default function App() {
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