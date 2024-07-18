import { useNavigate } from 'react-router-dom';
import './Header.css';
import { useLocation } from 'react-router-dom';

function Header({profile, settings}) {
    const navigate = useNavigate();
    const location = useLocation();

    function handleProfile(){
        navigate('/profile');
    }

    function handleHome(){
        navigate('/home');
    }
    
    function handleSettings(){
        //navigate('settings');
    }

    return (
        <header className="header">
            <h1 onClick={handleHome}>InvestEase</h1>
            <nav>
                {profile === true && (
                    <button className="header-button" onClick={handleProfile}>Profile</button>
                )}
                {settings === true && (
                    <button className="header-button" onClick={handleSettings}>Settings</button>
                )}
            </nav>
        </header>
    );
}
export default Header;