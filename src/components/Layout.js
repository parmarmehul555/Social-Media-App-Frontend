import { Link, Navigate, Outlet, useNavigate } from "react-router-dom";
import '../CSS/layout.style.css';
import UserModelProvider from "./UserModelProvider";
import { useDispatch, useSelector } from "react-redux";
import useGetMyChats from "../hooks/useGetMyChats";
import { setChatUser } from '../features/chatUserSlice';
import { myChatProfiles } from '../features/chatProfileSlice';
import useGetUser from "../hooks/useGetUser";
import { useRef, useState } from "react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Text,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Box,
    Image
} from '@chakra-ui/react'
import axios from "axios";

export default function Layout() {
    const navigate = useNavigate();
    const [myChats] = useGetMyChats();
    const dispatch = useDispatch();
    dispatch(myChatProfiles(myChats));
    const allChats = useSelector((state) => state.myChats.chatProfiles);
    const userData = useGetUser();
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChatUser, setGroupChatUser] = useState([]);
    const [newPostData,setNewPostData] = useState({});
    const [postImg,setPostImg] = useState(null); 

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    const finalRef = useRef(null)

    function handlePostImg(e){
        setPostImg(URL.createObjectURL(e.target.files[0]));
    }

    function handleNewPost(e){
        e.preventDefault();

        const formData = new FormData();
        formData.append('my-post',newPostData.img);
        formData.append('postCaption',newPostData.caption);

        axios.post('http://localhost:3030/user/post/createpost',formData,{
            headers:{
                'Content-Type':'multipart/form-data',
                'Authorization':`bearer ${localStorage.getItem('auth-token')}`
            }
        }).then(()=>{
            onClose();
        })
    }

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
            <div class="layout-box">
                <div class="row">
                    <div class="col-2 part">
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-solid fa-house"></i></div>
                            <div className="icon-name"><Link className="decoration" to={'/home'}><text>Home</text></Link></div>
                        </div>
                        <div className="sidebar-data" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" data-bs-theme="dark">
                            <div className="icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                            <div className="icon-name"><text>Search</text></div>

                            <div class="offcanvas offcanvas-start" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                                <div class="offcanvas-header">
                                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Search</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    <div>
                                        <input id="input-box" type="text" placeholder="search" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-brands fa-facebook-messenger"></i></div>

                            <div className="icon-name" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions" data-bs-theme="dark">Chats</div>

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
                        <div className="sidebar-data" onClick={onOpen}>
                            <div className="icon"><i class="fa-solid fa-plus"></i></div>
                            <div className="icon-name"><Link className="decoration" to={''}>Create</Link></div>

                            <Modal
                                initialFocusRef={initialRef}
                                finalFocusRef={finalRef}
                                isOpen={isOpen}
                                onClose={onClose}
                            >
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Add Post</ModalHeader>
                                    <ModalCloseButton />
                                    <ModalBody pb={6}>
                                        <Box boxSize={150}>
                                            <Image src={postImg == null ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKBH5DbCnCmwQCpcjv__106JSjG3U2oVNZRw&usqp=CAU" : postImg} alt='New post img'/>
                                        </Box>
                                        <form encType="multipart/form-data">
                                        <FormControl>
                                            <Button mb={5} mt={5} colorScheme='blue'><FormLabel>Add file</FormLabel></Button>
                                            <Input type="file" onChange={(e)=>{
                                                e.preventDefault();
                                                handlePostImg(e);
                                                setNewPostData({...newPostData,img:e.target.files[0]});
                                            }}/>
                                            <FormLabel>Caption</FormLabel>
                                            <Input ref={initialRef} placeholder='Caption....' onChange={(e)=>{
                                                e.preventDefault();
                                                setNewPostData({...newPostData,caption:e.target.value});
                                            }}/>
                                        </FormControl>
                                        </form>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={(e)=>handleNewPost(e)}>
                                            Post
                                        </Button>
                                        <Button onClick={onClose}>Cancel</Button>
                                    </ModalFooter>
                                </ModalContent>
                            </Modal>
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