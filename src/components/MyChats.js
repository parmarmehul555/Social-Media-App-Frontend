import { useDispatch, useSelector } from 'react-redux';
import '../CSS/mychats.style.css'
import useGetMyChats from '../hooks/useGetMyChats'
import { myChatProfiles } from '../features/chatProfileSlice';
import { useNavigate } from 'react-router-dom';
import { setChatUser } from '../features/chatUserSlice';
import { io } from 'socket.io-client';
import useGetUser from '../hooks/useGetUser';
import { useEffect, useState } from 'react';

const socket = io('http://localhost:3030');

function MyChats() {
    const [myChats, setMyChats] = useGetMyChats();
    const dispatch = useDispatch();
    dispatch(myChatProfiles(myChats));
    const allChats = useSelector((state) => state.myChats.chatProfiles);
    const navigate = useNavigate();

    const formattedProfile = allChats.map((item) => {
        return (
            <>
                <div id='user-profiles' onClick={() => {
                    dispatch(setChatUser(item.receivers[0]));
                    navigate(`/chat/${item._id}`);
                }}>
                    <div id='profile-picture'>
                        <img src={item.receivers[0].userImg} alt='profile-picture' />
                    </div>
                    <text>{item.receivers[0].userName}</text>
                </div>
            </>
        )
    })

    return (
        <>
            <div id="my-chats">
                <h5 id='chat-heading'>Chats</h5>
                {formattedProfile}
            </div>
        </>
    )
}

export { socket, MyChats };