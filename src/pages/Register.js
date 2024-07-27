import { useNavigate, Link } from "react-router-dom";
import "../components/LoginRegister.css"
import { useState } from "react";

export default function Login() {
    const navigate = useNavigate();
    const [input, setInput] = useState({
        email: '',
        username: '',
        profilePic: '',
        password: '',
        password2: ''
    });

    function inputChange(input, value){
        setInput(prev => ({
            ...prev,
            [input]: value
        }))
    }

    const handlesubmit = async (e) =>  {
        e.preventDefault();
        if(input.password === input.password2){
            try {
                const login = await fetch('http://localhost:5000/registerUser', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({email: input.email, profilePic: input.profilePic ,username: input.username, password: input.password}),
                });
    
                const data = await login.json();
                
                if(login.ok){
                    localStorage.setItem('userid', data.userid);
                    navigate('/home'); 
                } else {
                    alert(data.response);
                }
            } catch (error) {
                console.error(error.message);
            }
        } else {
            alert('inconsistent password, retry.');
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
                            id="profilePic"
                            type="url"
                            name="url"
                            placeholder="Enter a profile picture url"
                            value={input.profilePic}
                            onChange={(event) => inputChange('profilePic', event.target.value)}>
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