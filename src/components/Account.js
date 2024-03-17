import { Link, useNavigate } from 'react-router-dom'
import '../CSS/account.style.css'
import { useDispatch, useSelector, useStore } from 'react-redux'
import { useEffect, useRef, useState } from 'react';
import useGetUser from '../hooks/useGetUser';
import { userInfo } from '../features/userSlice';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    useDisclosure,
    Button,
    Box,
    Image,
    SkeletonText,
    FormControl,
    FormLabel,
    Input,
} from '@chakra-ui/react'
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from '@chakra-ui/react'

export default function Account() {
    const userData = useGetUser();
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    dispatch(userInfo(userData));
    const user = useSelector(state => state.user.user);
    const [postData, setPostData] = useState({});
    const [loading, setLoading] = useState(true);
    const [myFollowings, setMyFollowings] = useState([]);
    const [myFollowers, setMyFollowers] = useState([]);
    const navigate = useNavigate();
    const [followingLoading, setFollowingLoading] = useState(true);
    const [checkFollowing, setCheckFollowing] = useState(true);

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    );

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [overlay, setOverlay] = useState(<OverlayOne />);

    function getPost(postId) {
        setLoading(true);
        fetch(`http://localhost:3030/user/post/getpost/${postId}`, {
            method: "GET",
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        })
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error("Can not get your post!!");
            })
            .then((res) => {
                setPostData(res);
                setLoading(false);
            }).catch((error) => {
                console.log("Can not get!! ==>> ", error);
            })
    }

    function handleDeletePost(postId) {
        fetch(`http://localhost:3030/user/post/deletepost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then(() => {
            getAllPost();
            navigate('/profile');
            onClose();
        })
    }

    function getAllPost() {
        fetch('http://localhost:3030/user/post/getallpost', {
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
                    throw new Error('Can not get post!!');
                }
            })
            .then((res) => {
                setPosts(res);
                console.log("From account res ", res);
            })
            .catch((error) => {
                console.log('Can not get posts!!', error);
            })
    }

    useEffect(() => {
        getAllPost();
    }, []);

    function handleFollowings() {
        setFollowingLoading(true);
        fetch('http://localhost:3030/user/getAllmyUsers', {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            else {
                throw new Error("Can not get followings!!");
            }
        }).then((res) => {
            setMyFollowings(res.following);
            setMyFollowers(res.followers);
            setFollowingLoading(false);
        }).catch((error) => {
            console.log("can not get followings ==>> ", error);
        })
    }

    function showDropdown() {
        document.getElementById("myDropdown").classList.toggle("show");
    }

    async function unfollowUser(id) {
        await fetch('http://localhost:3030/user/unfollow/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
    }

    async function followUser(id) {
        await fetch('http://localhost:3030/user/follow/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'application/json'
            }
        })
    }

    const handleOffcanvasClick = event => {
        event.stopPropagation();
    };

    async function removeFollower(id) {
        await fetch('http://localhost:3030/user/removefollower/' + id, {
            method: 'PUT',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        })
    }

    function handleBtn(id) {
        let element = document.getElementById(`followBtn${id}`);
        let followingBtn = document.getElementById(`${id}`);
        element.classList.toggle('follow');
        if (element.classList.contains('follow')) {
            followingBtn.style.display = "none"
            element.style.display = "block";
            console.log('containss!');
        }
        else {
            followingBtn.style.display = "block"
            element.style.display = "none";
            console.log("not contains!!");
        }
    }

    const formattedPosts = posts.map((post) => {
        return (
            <div id='user-post' className='col-4' onClick={() => {
                getPost(post._id);
                setOverlay(<OverlayOne />)
                onOpen()
            }}>
                <img src={post.postURL} alt='Post image' />
                <Modal isCentered isOpen={isOpen} onClose={onClose} className='post-box'>
                    {overlay}
                    <ModalContent>
                        <div className='my-post-box-header'>
                            <ModalHeader>{userData.userName}</ModalHeader>
                            <i id='eclips' class="fa-solid fa-ellipsis-vertical " onClick={showDropdown}></i>
                        </div>
                        <ModalBody>
                            <Box style={{ height: "380px" }}>
                                {loading ? <SkeletonText mt='4' noOfLines={5} spacing='4' skeletonHeight='100%' /> : <Image src={postData.postURL} className='post-img' style={{ height: "100%", width: "100%" }} alt="Post Image" />}
                            </Box>
                            <Text>{postData.postCaption}</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme='red' me={2} onClick={() => {onClose();handleDeletePost(post._id)}}>Delete</Button>

                            <Button colorScheme='green'>Edit</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            </div>

        )
    })

    const formattedFollowings = myFollowings?.map((user) => {
        return (
            <div id='following-box'>
                <div className='following-user-details'>
                    <div id='following-user-img'>
                        <img src={user.userImg} alt='following-user-img' />
                    </div>
                    <text>{user.userName}</text>
                </div>
                <div><button className='btn btn-light' id={user._id} onClick={(e) => { handleBtn(user._id); unfollowUser(user._id) }}>Following</button></div>
                <button className='btn btn-primary followBtn' id={"followBtn" + user._id} onClick={(e) => { handleBtn(user._id); followUser(user._id) }}>Follow</button>
            </div>
        )
    })

    const formattedFollowers = myFollowers?.map((user) => {
        return (
            <div id='following-box'>
                <div className='following-user-details'>
                    <div id='following-user-img'>
                        <img src={user.userImg} alt='following-user-img' />
                    </div>
                    <text>{user.userName}</text>
                </div>
                <div><button className='btn btn-danger' id={user._id} onClick={(e) => { removeFollower(user._id) }}>Remove</button></div>
                {/* <button className='btn btn-primary followBtn' id={"followBtn" + user._id} onClick={(e) => { handleBtn(user._id); followUser(user._id) }}>Follow</button> */}
            </div>
        )
    })

    return (
        <>
            <div id="accountdetails">
                <div id='user-profile'>
                    <div id="user-img">
                        <img src={user.userImg} alt='profile-picture' />
                    </div>
                    <div>
                        <div className="userdetail">
                            <text>{user.userName}</text>
                            <Link to={'/editprofile'}><button id='edit-profile'>Edit Profile</button></Link>
                        </div>
                        <div id='userProfileDetail'>
                            <div className='userprofile'>
                                <div className='count'>25</div>
                                <label>Posts</label>
                            </div>

                            <div className='userprofile' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample1" aria-controls="offcanvasExample1" onClick={() => { setCheckFollowing(true); handleFollowings() }}>
                                <div className='count'>{user.followingCount}</div>
                                <label>Followings</label>
                            </div>

                            <div class="offcanvas offcanvas-start bg-dark text-light" tabindex="-1" id="offcanvasExample1" aria-labelledby="offcanvasExampleLabel">
                                <div class="offcanvas-header">
                                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Followings</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    {
                                        followingLoading ?
                                            < SkeletonText mt={4} noOfLines={myFollowings.length} spacing='4' skeletonHeight='10' />
                                            : formattedFollowings
                                    }
                                </div>
                            </div>

                            <div className='userprofile' type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExampleFollowers" aria-controls="offcanvasExampleFollowers" onClick={() => { setCheckFollowing(false); handleFollowings() }}>
                                <div className='count'>{user.followerCount}</div>
                                <label>Followers</label>
                            </div>

                            <div class="offcanvas offcanvas-start bg-dark text-light" tabindex="-1" id="offcanvasExampleFollowers" aria-labelledby="offcanvasExampleLabel">
                                <div class="offcanvas-header">
                                    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Followers</h5>
                                    <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                </div>
                                <div class="offcanvas-body">
                                    {
                                        followingLoading ?
                                            < SkeletonText mt={4} noOfLines={myFollowings.length} spacing='4' skeletonHeight='10' />
                                            : formattedFollowers
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="userdetail">
                            <text>{user.bio}</text>
                        </div>
                    </div>
                </div>
                <div id='all-post'>
                    <div id='user-posts' className='row'>
                        {formattedPosts}
                    </div>
                </div>
            </div >

        </>
    )
}