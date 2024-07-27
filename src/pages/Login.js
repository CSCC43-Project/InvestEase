import { useNavigate, Link} from "react-router-dom";
import "../components/LoginRegister.css"
import { useState } from "react";
import { getID, setID } from "../constants/userid";

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

    const handlesubmit = async (e) =>  {
        e.preventDefault();
        try {
            const login = await fetch('http://localhost:5000/checkLogin', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({email: input.email, password: input.password}),
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
    }

    return (
        <div className="rectangle-container">
            <div className="rectangle">
                <form onSubmit={handlesubmit}>
                    <label id="title" className="form-title">InvestEase</label>
                    <div>
                        <input
                            className="form-input"
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
                    <button type="submit" className="form-submit">Sign In</button>
                </form>
            </div>
        </div>
    );
}