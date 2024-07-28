import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/UserProfile';
import AnotherProfile from './pages/AnotherProfile';
import SinglePortfolio from './pages/SinglePortfolio';
import Stocks from './pages/FullStocks';
import PortfolioList from './pages/PortfolioList';
import StockLists from './pages/StockLists';
import SingleStockList from './pages/SingleStockList';
import StockTransaction from './pages/StockTransaction';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element = {<Login />} />
                <Route path="/" element={<Login />} />
                <Route path="/home" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/:id" element={<AnotherProfile />} />
                <Route path="/stocklists" element={<StockLists />} />
                <Route path="/stocklists/:id" element={<SingleStockList />} />
                <Route path="/portfolio" element={<PortfolioList />} />
                <Route path="/portfolio/:id" element={<SinglePortfolio />} />
                <Route path="/stocks" element={<Stocks/>} />
                <Route path="*" element={<h1>Not Found</h1>} />
            </Routes>
        </BrowserRouter>
    );
}