import { Link, Navigate, useNavigate } from 'react-router-dom'
import '../CSS/userModel.style.css'
import { useState } from 'react';

export default function UserModelProvider(props) {
    const [user, setUser] = useState({});
    const navigate = useNavigate();

    function login() {
        fetch('http://localhost:3030/user/login', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                console.log("Invalid user");
                // const msg = document.getElementById('wrong-input-msg');
                // msg.style.display = "block"
            })
            .then((res) => {
                localStorage.setItem('auth-token', res.token);
                setUser(res);
                navigate('/home')
            })
            .catch((error) => {
                console.log("Can not login :: ", error);
            });
    }

    function signup() {
        fetch('http://localhost:3030/user/signup', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                // document.getElementById('wrong-input-signup-msg').style.display = "block";
            })
            .then((res) => {
                localStorage.setItem('auth-token', res.token);
                setUser(res);
                navigate('/login')
            })
            .catch((error) => {
                console.log("Can not signup :: ", error);
            });
    }
    return (
        <>
            {
                props.isLogin ?
                    <>
                        <div class="wrapper">
                            <div class="title">
                                Login
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                login();
                            }}>
                                {/* <text id='wrong-input-signup-msg'>try another email or username</text> */}
                                <div class="field">
                                    <input type="text" required onChange={(e) => {
                                        setUser({ ...user, email: e.target.value });
                                        // document.getElementById('wrong-input-signup-msg').style.display = "none";
                                    }} />
                                    <label>Email</label>
                                </div>
                                <div class="field">
                                    <input type="password" required onChange={(e) => {
                                        setUser({ ...user, password: e.target.value });
                                        // document.getElementById('wrong-input-signup-msg').style.display = "none";
                                    }} />
                                    <label>Password</label>
                                </div>
                                <div class="content">
                                    <div class="pass-link">
                                        <a href="#">Forgot password?</a>
                                    </div>
                                </div>
                                <div class="field">
                                    <input type="submit" value="Login" />
                                </div>
                                <div class="signup-link">
                                    Don't have an account? <Link to={'/signup'}>Signup</Link>
                                </div>
                            </form>
                        </div>
                    </>
                    :
                    <>
                        <div class="wrapper">
                            <div class="title">
                                Signup
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                signup();
                            }}>
                                <text id='wrong-input-msg'>Invalid email or password</text>
                                <div class="field">
                                    <input type="text" required onChange={(e)=>{
                                        setUser({...user,userName:e.target.value})
                                    }}/>
                                    <label>User Name</label>
                                </div>
                                <div class="field">
                                    <input type="text" required onChange={(e)=>{
                                        setUser({...user,email:e.target.value})
                                    }}/>
                                    <label>Email</label>
                                </div>
                                <div class="field">
                                    <input type="password" required onChange={(e)=>{
                                        setUser({...user,password:e.target.value})
                                    }}/>
                                    <label>Password</label>
                                </div>
                                <div class="field">
                                    <input type="submit" value="Signup" />
                                </div>
                                <div class="signup-link">
                                    Already have an account? <Link to={'/login'}>Login</Link>
                                </div>
                            </form>
                        </div>
                    </>
            }
        </>
    )
}