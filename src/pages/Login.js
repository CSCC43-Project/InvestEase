import { useNavigate, Link} from "react-router-dom";
import "../components/LoginRegister.css"
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: '',
        password: ''
    });

    function inputChange(input, value){
        setInput(prev => ({
            ...prev,
            [input]: value
        }))
    }

    function handlesubmit() {
        const correctEmail = 'email@utoronto.ca'
        const correctPassword = 'password'
        
        if (input.email === correctEmail &&  input.password === correctPassword){
            navigate('/home');
        }
    }

    return (
        <div className="rectangle-container">
            <div className="rectangle">
                <form onSubmit={handlesubmit}>
                    <label id="title" className="form-title">InvestEase</label>
                    <div>
                        <input
                            className="form-input"
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={input.email}
                            onChange={(event) => inputChange('email', event.target.value)}>
                        </input>
                    </div>
                    <div>
                        <input
                            className="form-input"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={input.password}
                            onChange={(event) => inputChange('password', event.target.value)}>
                        </input>
                    </div>
                    <p>
                        Don't have an account? <Link to='/register'>Sign up</Link>
                    </p>
                    <p>
                        <button type="submit" className="form-submit">Sign In</button>
                    </p>
                </form>
            </div>
        </div>
    );
}