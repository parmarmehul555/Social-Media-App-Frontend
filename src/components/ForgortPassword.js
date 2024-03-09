import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
    const [data,setData] = useState({});
    const navigate = useNavigate();

    function handleForgotPassword(){
        fetch('http://localhost:3030/user/forgotpassword',{
            method:'PUT',
            body:JSON.stringify(data),
            headers:{
                'Authorization':`bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json'
            }
        }).then((res)=>{
            if(res.ok){
                navigate('/login');
            }
            else{
                throw new Error("Somthing wents wrong!!");
            }
        })
        .catch((error)=>{
            console.log("ERROR occured!! ",error);
        })
    }

    return (
        <>
            <div class="wrapper">
                <div class="title">
                    Forgot Password
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    handleForgotPassword();
                    console.log(data);
                    // login();
                }}>
                    {/* <text id='wrong-input-signup-msg'>try another email or username</text> */}
                    <div class="field">
                        <input type="text" required style={{color:"black"}} onChange={(e) => {
                            setData({...data,userName:e.target.value});
                            // document.getElementById('wrong-input-signup-msg').style.display = "none";
                        }} />
                        <label>User Name</label>
                    </div>
                    <div class="field">
                        <input type="text" required style={{color:"black"}}  onChange={(e) => {
                            setData({...data,email:e.target.value});
                            // document.getElementById('wrong-input-signup-msg').style.display = "none";
                        }} />
                        <label>Email</label>
                    </div>
                    <div class="field">
                        <input type="password" required style={{color:"black"}}  onChange={(e) => {
                            setData({...data,password:e.target.value});
                            // document.getElementById('wrong-input-signup-msg').style.display = "none";
                        }} />
                        <label>New Password</label>
                    </div>
                    <div class="field">
                        <input type="password" required style={{color:"black"}}  onChange={(e) => {
                            if(e.target.value === data.password){
                                setData({...data,newPassword:e.target.value});
                            }
                            // document.getElementById('wrong-input-signup-msg').style.display = "none";
                        }} />
                        <label>Confirm Password</label>
                    </div>
                    <div class="field">
                        <input type="submit" value="Save"/>
                    </div>
                    <div class="signup-link">
                        {/* Don't have an account? <Link to={'/signup'}>Signup</Link> */}
                    </div>
                </form>
            </div >
        </>
    )
}