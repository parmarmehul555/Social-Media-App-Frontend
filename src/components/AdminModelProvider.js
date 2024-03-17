import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function AdminModelProvider(props) {
    const [admin, setAdmin] = useState({});
    const navigate = useNavigate();

    function login() {
        fetch('http://localhost:3030/admin/login', {
            method: 'POST',
            body: JSON.stringify(admin),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                console.log("Invalid admin");
            })
            .then((res) => {
                localStorage.setItem('admin-token', res.token);
                navigate('/admin/dashboard')
            })
            .catch((error) => {
                console.log("Can not login :: ", error);
            });
    }

    function signup() {
        fetch('http://localhost:3030/admin/signup', {
            method: 'POST',
            body: JSON.stringify(admin),
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
            })
            .then((res) => {
                localStorage.setItem('auth-token', res.token);
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
                                Admin Login
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                console.log(admin);
                                login();
                            }}>
                                <div class="field">
                                    <input type="text" required onChange={(e) => {
                                        setAdmin({ ...admin, adminEmail: e.target.value });
                                    }} />
                                    <label>Email</label>
                                </div>
                                <div class="field">
                                    <input type="password" required onChange={(e) => {
                                        setAdmin({ ...admin, adminPassword: e.target.value });
                                    }} />
                                    <label>Password</label>
                                </div>
                                <div class="content">
                                    <div class="pass-link">
                                        <Link to={'forgotpassword'}>Forgot password?</Link>
                                    </div>
                                </div>
                                <div class="field">
                                    <input type="submit" value="Login" />
                                </div>
                                <div class="signup-link">
                                    Don't have an account? <Link to={'/admin/signup'}>Signup</Link>
                                </div>
                            </form>
                        </div>
                    </>
                    :
                    <>
                        <div class="wrapper">
                            <div class="title">
                                Admin Signup
                            </div>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                signup();
                            }}>
                                <text id='wrong-input-msg'>Invalid email or password</text>
                                <div class="field">
                                    <input type="text" required onChange={(e) => {
                                        setAdmin({ ...admin, adminName: e.target.value })
                                    }} />
                                    <label>Admin Name</label>
                                </div>
                                <div class="field">
                                    <input type="text" required onChange={(e) => {
                                        setAdmin({ ...admin, adminEmail: e.target.value })
                                    }} />
                                    <label>Email</label>
                                </div>
                                <div class="field">
                                    <input type="password" required onChange={(e) => {
                                        setAdmin({ ...admin, adminPassword: e.target.value })
                                    }} />
                                    <label>Password</label>
                                </div>
                                <div class="field">
                                    <input type="submit" value="Signup" />
                                </div>
                                <div class="signup-link">
                                    Already have an account? <Link to={'/admin/login'}>Login</Link>
                                </div>
                            </form>
                        </div>
                    </>
            }
        </>
    )
}