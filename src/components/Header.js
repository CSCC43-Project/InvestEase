import { useNavigate } from 'react-router-dom';
import './Header.css';

function Header({profile, settings}) {
    const navigate = useNavigate();

    function handleProfile(){
        navigate('/profile');
    }

    function handleHome(){
        navigate('/home');
    }

    return (
        <header className="header">
            <h1 onClick={handleHome}>InvestEase</h1>
            <nav>
                {profile === true && (
                    <button className="header-button" onClick={handleProfile}>Profile</button>
                )}
            </nav>
        </header>
    );
}
export default Header;