import { useParams } from 'react-router-dom'
import '../CSS/chat.style.css'
import { MyChats, socket } from './MyChats'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useGetUser from '../hooks/useGetUser';
import { io } from 'socket.io-client';
import { userInfo } from '../features/userSlice';

export default function Chat() {
    const { chatId } = useParams();
    const [oldChats, setOldChats] = useState([]);
    const userData = useGetUser();
    const chatUser = useSelector(state => state.chatUser.chatUser);
    const [loading, setLoading] = useState(true);
    const [chatContent, setChatContent] = useState({});
    const [recievedMessage, setRecievedMessage] = useState({});
    const [typing, setTyping] = useState(false);
    const wsURL = 'http://localhost:3030';
    const [chatUsers, setChatUsers] = useState([]);

    useEffect(() => {
        if (!chatUser.isGroupChat) {
            chatUser.receivers.map((user) => {
                if (user._id != userData._id) {
                    setChatUsers([user]);
                }
            })
        }
        else {
            let users = [];
            for (let i = 0; i < chatUser.receivers.length; i++) {
                if (chatUser.receivers[i]._id != userData._id) {
                    users.push(chatUser.receivers[i]);
                }
            }
            setChatUsers(users);
        }
    },[chatUser])

    useEffect(() => {
        var socket = io(wsURL);

        socket.on('connection', () => {
            console.log("Socket connected!!");
        })
    }, []);

    useEffect(() => {
        socket.on('new message', (message) => {
            setRecievedMessage(message);
        })
    });

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3030/user/oldchat/chat/${chatId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Can not fetch your old chats!!");
                }
            })
            .then((res) => {
                setOldChats(res);
                setLoading(false);
                socket.emit('join chat', chatId);
            }).catch((error) => {
                console.log("Can not fetch your old chats!!==>> ", error);
            })
    }, [chatId]);

    useEffect(() => {
        setOldChats((prevChats) => [...prevChats, recievedMessage]);
        const chatContainer = document.getElementById('messages');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [recievedMessage]);

    useEffect(() => {
        const chatContainer = document.getElementById('messages');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, [oldChats, typing]);

    function handleChat(id) {
        fetch(`http://localhost:3030/user/oldchat/sendmessage/${id}`, {
            method: 'POST',
            body: JSON.stringify(chatContent),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("auth-token")}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Can not send message!!");
                }
            })
            .then((res) => {
                setChatContent(res);
                let socketData = {
                    sender: userData._id,
                    chatId,
                    content: chatContent.content
                }
                socket.emit('send message', socketData);
            })
            .catch((error) => {
                console.log("error while sending message!! ", error);
            })
    }

    function handleGroupChatUser(senderId) {
        for (let i of chatUsers) {
            if (i._id == senderId) {
                return i.userName;
            }
        }
    }

    function handleChatTyping(id){
        socket.on('typing',id);
        setTyping(true);
    }

    function handleStopTyping(id){
        socket.emit('stop typing',id);
        setTimeout(()=>setTyping(false),5000);
    }

    const formattedChats = oldChats.map((chat) => {
        return (
            <>
                <div className={chat.sender == userData._id ? 'msg right-msg' : 'msg left-msg'}>
                    <img
                        class="msg-img"
                        src={chat.sender == userData._id ? userData.userImg : chatUsers[0].userImg} alt='profile-picture' />

                    <div class="msg-bubble">
                        <div class="msg-info">
                            <div class="msg-info-name">{chat.sender == userData._id ? userData.userName : chatUsers.length == 1 ? chatUsers[0].userName : handleGroupChatUser(chat.sender)}</div>
                            <div class="msg-info-time">{chat.sender == userData._id ?
                                userData.createdAt?.split('T')[1].split(':')[0] + ":" + userData.createdAt?.split('T')[1].split(':')[1] :
                                chatUser.createdAt?.split('T')[1].split(':')[0] + ":" + userData.createdAt?.split('T')[1].split(':')[1]}</div>
                        </div>

                        <div class="msg-text">
                            <text>{chat.content}</text>
                        </div>
                    </div>
                </div>
            </>
        )
    });

    return (
        <>
            <div id='chats'>
                <section class="msger">
                    <header class="msger-header">
                        <div class="msger-header-title">
                            <div id='userImg'>
                                <img src={!chatUser.isGroupChat ? chatUsers[0]?.userImg : chatUser.groupImage} alt='chat-user-img' />
                            </div>
                            <text style={{ fontWeight: "bold" }}>{!chatUser.isGroupChat ? chatUsers[0]?.userName : chatUser.groupName}</text>
                        </div>
                    </header>
                    <main class="msger-chat" id='messages'>
                        <div >
                            {loading ?
                                <span className="loader"></span> : formattedChats}
                            {typing ? <div className="typing">
                                <div className="typing__dot"></div>
                                <div className="typing__dot"></div>
                                <div className="typing__dot"></div>
                            </div>
                                : ""}
                        </div>
                    </main>

                    <form class="msger-inputarea">
                        <input type="text" class="msger-input" value={chatContent.content} placeholder="Enter your message..." onChange={(e) => {
                            setChatContent({ content: e.target.value });
                            handleChatTyping(chatId);
                        }} onKeyUp={()=>{
                            handleStopTyping(chatId);
                        }} />
                        <button type="submit" class="msger-send-btn" onClick={(e) => {
                            e.preventDefault();
                            handleChat(chatId);
                            setChatContent({ content: "" });
                        }}>Send</button>
                    </form>
                </section>
            </div>
        </>
    )
}