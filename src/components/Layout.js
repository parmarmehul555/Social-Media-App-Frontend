import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import '../CSS/layout.style.css';
import UserModelProvider from "./UserModelProvider";
import { useDispatch, useSelector } from "react-redux";
import useGetMyChats from "../hooks/useGetMyChats";
import { setChatUser } from '../features/chatUserSlice';
import { myChatProfiles } from '../features/chatProfileSlice';
import useGetUser from "../hooks/useGetUser";
import { useState } from "react";

export default function Layout() {
    const navigate = useNavigate();
    const [myChats] = useGetMyChats();
    const dispatch = useDispatch();
    dispatch(myChatProfiles(myChats));
    const allChats = useSelector((state) => state.myChats.chatProfiles);
    const [userData] = useGetUser();
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChatUser, setGroupChatUser] = useState([]);

    const formattedProfile = allChats.map((item, index) => {
        return (
            <>
                <div key={index} id='user-profiles' onClick={() => {
                    if (!item.isGroupChat) {
                        setChatUsers(item.receivers);
                        // dispatch(setChatUser(chatUsers));
                        dispatch(setChatUser(item));
                        navigate(`/chat/${item._id}`);
                    }
                    else {
                        setGroupChatUser(item.receivers);
                        // dispatch(setChatUser(groupChatUser));
                        dispatch(setChatUser(item));
                        navigate(`/chat/${item._id}`);
                    }
                }}>
                    {
                        userData._id != item.receivers[1]._id && !item.isGroupChat ?
                            <><div id='profile-picture'>
                                <img src={item.receivers[1].userImg} alt='profile-picture' />
                            </div>
                                <text>{item.receivers[1].userName}</text>
                            </> :
                            <>
                                {!item.isGroupChat ? <><div id='profile-picture'>
                                    <img src={item.receivers[0].userImg} alt='profile-picture' />
                                </div>
                                    <text>{item.receivers[0].userName}</text>
                                </> : <><div id='profile-picture'>
                                    <img src={item.groupImage} alt='profile-picture' />
                                </div><text>{item.groupName}</text>
                                </>}
                            </>
                    }
                </div>
            </>
        )
    });

    return (
        <>
            <div class="container">
                <div class="row">
                    <div class="col-2 part">
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-solid fa-house"></i></div>
                            <div className="icon-name"><Link className="decoration" to={'/home'}><text>Home</text></Link></div>
                        </div>
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-brands fa-facebook-messenger"></i></div>

                            <div className="icon-name" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Chats</div>

                            <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">

                                <div class="offcanvas-header">
                                    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Chats</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    <div id="my-chats">
                                        {formattedProfile}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-solid fa-user"></i></div>
                            <div className="icon-name"><Link className="decoration" to={'/profile'}>Account</Link></div>
                        </div>
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-solid fa-bars"></i></div>
                            <div className="icon-name"><text>Setting</text></div>
                        </div>
                        <div className="sidebar-data" onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}>
                            <h4 style={{ color: "red" }}>Logout</h4>
                        </div>
                    </div>
                    <div class="col" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}