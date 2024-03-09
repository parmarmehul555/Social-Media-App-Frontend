import { Link, useNavigate } from 'react-router-dom'
import '../CSS/account.style.css'
import { useDispatch, useSelector } from 'react-redux'
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

export default function Account() {
    const userData = useGetUser();
    const dispatch = useDispatch();
    const [posts, setPosts] = useState([]);
    dispatch(userInfo(userData));
    const user = useSelector(state => state.user.user);
    const [postData, setPostData] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const OverlayOne = () => (
        <ModalOverlay
            bg='blackAlpha.300'
            backdropFilter='blur(10px) hue-rotate(90deg)'
        />
    )

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
    }, [])

    function showDropdown() {
        document.getElementById("myDropdown").classList.toggle("show");
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
                            <Button onClick={onClose} colorScheme='red' me={2} onClick={() => handleDeletePost(post._id)}>Delete</Button>

                            <Button colorScheme='green'>Edit</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
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
                            <div className='userprofile'>
                                <div className='count'>{user.followingCount}</div>
                                <label>Followings</label>
                            </div>
                            <div className='userprofile'>
                                <div className='count'>{user.followerCount}</div>
                                <label>Followers</label>
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
            </div>

        </>
    )
}