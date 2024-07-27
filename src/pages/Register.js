import { useNavigate, Link } from "react-router-dom";
import "../components/LoginRegister.css"
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: '',
        username: '',
        password: '',
        password2: ''
    });

    function inputChange(input, value){
        setInput(prev => ({
            ...prev,
            [input]: value
        }))
    }

    function handlesubmit() {
        if (input.password === input.password2){
            navigate('/home');
        } else {
            alert('inconsistent password');
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
                            id="username"
                            type="username"
                            name="username"
                            placeholder="Username"
                            value={input.username}
                            onChange={(event) => inputChange('username', event.target.value)}>
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
                    <div>
                        <input
                            className="form-input"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Re-enter Password"
                            value={input.password2}
                            onChange={(event) => inputChange('password2', event.target.value)}>
                        </input>
                    </div>
                    <p>
                        Already have an account? <Link to='/login'>Sign in</Link>
                    </p>
                    <p>
                        <button type="submit" className="form-submit">Sign up</button>
                    </p>
                </form>
            </div>
        </div>
    );
}