import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import '../CSS/layout.style.css';
import UserModelProvider from "./UserModelProvider";
import { useDispatch, useSelector } from "react-redux";
import useGetMyChats from "../hooks/useGetMyChats";
import { setChatUser } from '../features/chatUserSlice';
import { myChatProfiles } from '../features/chatProfileSlice';
import useGetUser from "../hooks/useGetUser";
import { useEffect, useRef, useState } from "react";
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
    Image,
    Wrap,
    WrapItem
} from '@chakra-ui/react'
import axios from "axios";
import TextField from '@mui/material/TextField';

export default function Layout() {
    const navigate = useNavigate();
    const [myChats] = useGetMyChats();
    const dispatch = useDispatch();
    dispatch(myChatProfiles(myChats));
    const allChats = useSelector((state) => state.myChats.chatProfiles);
    const userData = useGetUser();
    const [chatUsers, setChatUsers] = useState([]);
    const [groupChatUser, setGroupChatUser] = useState([]);
    const [newPostData, setNewPostData] = useState({});
    const [postImg, setPostImg] = useState(null);
    const [creatingGroup, setCreatingGroup] = useState(false);
    const [myFollowings, setMyFollowings] = useState([]);
    const [newGroup, setNewGroup] = useState({});
    const [newGroupMembers, setNewGroupMembers] = useState([]);
    const [newGroupImg, setNewGroupImg] = useState(null);
    const [gropEditing, setGroupEditing] = useState(false);
    const [group, setGroup] = useState({});
    const [groupUpdate, setGroupUpdate] = useState({});
    const [myGroupMembers, setMyGroupMembers] = useState([]);
    const path = useLocation();

    window.addEventListener('load',()=>{
        if(localStorage.getItem('auth-token')){
            navigate('/home');
        }
        else{
            navigate('/login');
        }
    })

    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef(null)
    const finalRef = useRef(null)

    function handlePostImg(e) {
        setPostImg(URL.createObjectURL(e.target.files[0]));
    }

    function handleCurrentGroupImg(e) {
        setNewGroupImg(URL.createObjectURL(e.target.files[0]));
    }

    function handleNewPost(e) {
        e.preventDefault();

        const formData = new FormData();
        formData.append('my-post', newPostData.img);
        formData.append('postCaption', newPostData.caption);

        axios.post('http://localhost:3030/user/post/createpost', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then(() => {
            onClose();
            setPostImg(null);
        })
    }

    function handleMyFollowings() {
        fetch('http://localhost:3030/user/getAllmyUsers', {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then((res) => {
            if (res.ok) return res.json();
            throw new Error("Can not get your following!!");
        }).then((res) => {
            setMyFollowings(res.following);
        }).catch((error) => {
            console.log("Can not get your following!!", error);
        })
    }

    async function handleNewGroup(data) {
        try {
            const formData = new FormData();
            formData.append('groupName', data.name);
            formData.append('groupMembers', data.groupMembers);
            if (data.groupImage) {
                formData.append('group-img', data.groupImage);
            }

            await axios.post('http://localhost:3030/user/chat/creategroup',
                formData,
                {
                    headers: {
                        'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            ).then(() => {
                setCreatingGroup(false);
                setGroupEditing(false);
            }).catch((error) => {
                console.log(error);
            })
        } catch (error) {
            console.log("Can not create group ==>> ", error.message);
        }
    }

    async function handleGroupEditing(data) {
        const formData = new FormData();
        formData.append('groupNewName', data.name);
        if (data.groupImage) {
            formData.append('group-profile-picture', data.groupImg);
        }

        await axios.put(`http://localhost:3030/user/chat/updategroup/${groupUpdate._id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then(() => {
            setCreatingGroup(false);
            setGroupEditing(false);
        })
    }

    function handleSelction(id) {
        const element = document.getElementById(`${id}`);
        element.classList.toggle('green-active');
        if (element.classList.contains('green-active')) {
            element.style.color = "green";
        }
        else {
            element.style.color = "black";
        }
    }

    function handleMyGroupMembers(id) {
        fetch(`http://localhost:3030/user/chat/getallmembers/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
            }
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Can not get your members of group!!");
            })
            .then((res) => {
                setMyGroupMembers(res.receivers);
            })
            .catch((error) => {
                console.log("Can not get members :: ", error);
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
                                </> :
                                    <div id="group">
                                        <div id="group-detail"><div id='profile-picture'>
                                            <img src={item.groupImage} alt='profile-picture' />
                                        </div>
                                            <text>{item.name}</text>
                                        </div>
                                        <div onClick={() => {
                                            setGroupEditing(true);
                                            setGroupUpdate(item);
                                            localStorage.setItem('chatId',item._id);
                                            handleMyGroupMembers(item._id);
                                        }}>
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </div>
                                    </div>}
                            </>
                    }
                </div>
            </>
        )
    });

    const fotmmattedFollowing = myFollowings.map((item, index) => {
        return (
            <div id="your-following" onClick={() => {
                handleSelction(item._id);
                const element = document.getElementById(`${item._id}`);
                if (element.classList.contains('green-active')) {
                    setNewGroupMembers([...newGroupMembers, item._id]);
                }
                else {
                    let data = newGroupMembers.filter((member) => member != item._id ? member : '');
                    setNewGroupMembers([...data]);
                }
            }}>
                <div key={index} id='new-group-user-list'>
                    <div id='profile-picture'>
                        <img src={item.userImg} alt='profile-picture' />
                    </div>
                    <text>{item.userName}</text>
                </div>
                <div className="check-add-member" id={item._id}>
                    <i class="fa-solid fa-circle-check"></i>
                </div>

            </div>
        );
    });

    const formattedGroupMembers = myGroupMembers.map((member, index) => {
        return (
            <>
                <div id="your-following">
                    <div key={index} id='new-group-user-list'>
                        <div id='profile-picture'>
                            <img src={member.userImg} alt='profile-picture' />
                        </div>
                        <text>{member.userName}</text>
                    </div>
                    <div className="check-add-member" id={member._id} onClick={async ()=>{
                        await fetch(`http://localhost:3030/user/chat/removegroupmember/${member._id}-${localStorage.getItem('chatId')}`,{
                            method:'DELETE',
                            headers:{
                                'Authorization':`bearer ${localStorage.getItem('auth-token')}`,
                                'Content-Type':'application/json'
                            }
                        }).then(()=>{
                            setMyGroupMembers(myGroupMembers.filter((user)=>user._id !== member._id ? user : ''));
                        })
                    }}>
                        <i class="fa-solid fa-trash"></i>
                    </div>

                </div>
            </>
        );
    })

    return (
        <>
            <div class="layout-box">
                <div class="row">
                    {!localStorage.getItem('admin-token') && localStorage.getItem('auth-token') ? <div class="col-2 part">
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-solid fa-house"></i></div>
                            <div className="icon-name"><Link className="decoration" to={'/home'}><text>Home</text></Link></div>
                        </div>
                        <div className="sidebar-data">
                            <div className="icon"><i class="fa-brands fa-facebook-messenger"></i></div>

                            <div className="icon-name" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Chats</div>

                            <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel"  data-bs-theme="dark">

                                <div class="offcanvas-header">
                                    <h5 class="offcanvas-title" id="offcanvasWithBothOptionsLabel">Chats</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    {!creatingGroup ? <Wrap className="button-creat-grp">
                                        <WrapItem>
                                            <Button colorScheme='facebook' onClick={() => { setCreatingGroup(!creatingGroup); handleMyFollowings() }}>Create Group</Button>
                                        </WrapItem>
                                    </Wrap> : ''}
                                    {!creatingGroup && !gropEditing ? <div id="my-chats">
                                        {formattedProfile}
                                    </div> : <div>
                                        <div id="groupImg">
                                            <img src={gropEditing ? groupUpdate.groupImage : !newGroupImg ? "https://res.cloudinary.com/de0punalk/image/upload/v1707397450/paslibbfdsgtyxe5rqhu.png" : newGroupImg} />
                                        </div>
                                        <form encType="multipart/form-data">
                                            <input type="file" id="group-photo" name="" onChange={(e) => {
                                                handleCurrentGroupImg(e);
                                                setNewGroup({
                                                    ...newGroup, groupImage: e.target.files[0]
                                                });
                                                setGroupUpdate({ ...groupUpdate, groupImg: e.target.files[0] });
                                            }} /></form>
                                        <Input variant='outline' placeholder='Group Name' value={groupUpdate.name} onChange={(e) => {
                                            console.log(e.target.value);
                                            setNewGroup({ ...newGroup, groupName: e.target.value });
                                            setGroupUpdate({ ...groupUpdate, name: e.target.value });
                                        }} />
                                        {fotmmattedFollowing}
                                        <Wrap>
                                            <WrapItem>
                                                {creatingGroup ? <Button colorScheme='teal' onClick={async (e) => {
                                                    let data = JSON.stringify(newGroupMembers);
                                                    setNewGroup({ ...newGroup, groupMembers: data });
                                                    console.log(newGroup);
                                                    await handleNewGroup(newGroup);
                                                }}>Create</Button> :
                                                    <Button colorScheme="green" onClick={(e) => { handleGroupEditing(groupUpdate); }}>Save Changes</Button>}
                                                <Button colorScheme='red' ms={2} onClick={(e) => {
                                                    setCreatingGroup(false);
                                                    setGroupEditing(false);
                                                }}>Cancel</Button>
                                            </WrapItem>
                                        </Wrap>
                                        {gropEditing && formattedGroupMembers}
                                    </div>}
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
                                            <Image src={postImg == null ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKBH5DbCnCmwQCpcjv__106JSjG3U2oVNZRw&usqp=CAU" : postImg} alt='New post img' />
                                        </Box>
                                        <form encType="multipart/form-data">
                                            <FormControl>
                                                <Button mb={5} mt={5} colorScheme='blue'><FormLabel>Add file</FormLabel></Button>
                                                <Input type="file" onChange={(e) => {
                                                    e.preventDefault();
                                                    handlePostImg(e);
                                                    setNewPostData({ ...newPostData, img: e.target.files[0] });
                                                }} />
                                                <FormLabel>Caption</FormLabel>
                                                <Input ref={initialRef} placeholder='Caption....' onChange={(e) => {
                                                    e.preventDefault();
                                                    setNewPostData({ ...newPostData, caption: e.target.value });
                                                }} />
                                            </FormControl>
                                        </form>
                                    </ModalBody>

                                    <ModalFooter>
                                        <Button colorScheme='blue' mr={3} onClick={(e) => handleNewPost(e)}>
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
                            <div className="icon-name"><Link to={'setting'}><text>Setting</text></Link></div>
                        </div>
                        <div className="sidebar-data" onClick={() => {
                            localStorage.clear();
                            navigate('/login');
                        }}>
                            <h4 style={{ color: "red" }}>Logout</h4>
                        </div>
                    </div>:''}
                    <div class="col" style={{height: "100vh" }}>
                        <Outlet />
                    </div>
                </div>
            </div>
        </>
    )
}

// display: "flex", justifyContent: "center", alignItems: "center", 