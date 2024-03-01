import { useSelector } from "react-redux"
import useGetUser from "../hooks/useGetUser";
import '../CSS/home.style.css';
import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    height: '70%',
    overflowY: 'scroll'
};

const formStyle = {
    position:"sticky",
    bottom:"0",
};

export default function Home() {
    const userData = useGetUser();

    const [posts, setPosts] = useState([]);
    const [open, setOpen] = useState(false);
    const [commentData, setCommentData] = useState("");
    const [postComments, setPostComments] = useState([]);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    function handleAllPosts() {
        fetch('http://localhost:3030/user/post/getposts', {
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
                console.log(res);
                setPosts(res);
                console.log("post comments is ", postComments);
                console.log("your all posts ", posts);
            })
            .catch((error) => {
                console.log('Can not get posts!!', error);
            })
    }

    useEffect(() => {
        handleAllPosts();
    }, []);

    function handleLikes(data) {
        fetch(`http://localhost:3030/user/post/addlikesorcomments/${data.postId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        })
            .then(() => {
                handleAllPosts();
            })
            .catch((error) => {
                console.log("Can not increase likes ", error);
            })
    }

    const formattedComments = posts.map((post) => {
        return (
            post.postComments.map((comment) => {
                return (
                    <div className="comment-data">
                        <div id="post-user-img">
                            <img src={comment.commentedUser.userImg} alt="user-profile-picture" />
                        </div>
                        <div id="post-userdata">
                            <text id="username">{comment.commentedUser.userName}</text>
                            <text id="comment">{comment.commentData}</text>
                        </div>
                    </div>
                )
            })
        )
    })

    const formattedPost = posts.map((post) => {
        return (
            <div id="post">
                <div className="user-header">
                    <div className="user-img">
                        <img src={post.userId.userImg} alt="post-image" />
                    </div>
                    <div id="username">
                        <text>{post.userId.userName}</text>
                    </div>
                </div>
                <div className="post-data">
                    <img src={post.postURL} alt="post-image" />
                </div>
                <div className="post-footer">
                    <div className="icons">
                        <i className="icon-img" class="fa-regular fa-heart" onClick={() => {
                            let data = {
                                postId: post._id,
                                userId: userData._id
                            }
                            handleLikes(data);
                        }}></i>

                        <i className="icon-img" class="fa-regular fa-comment" onClick={handleOpen}></i>

                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style}>
                                <Typography id="modal-modal-title" variant="h6" component="h2">
                                    Comments
                                </Typography>
                                <Typography id="modal-modal-description" sx={{ mt: 2 }} >
                                    <div id="show-comment-box">
                                        {formattedComments}
                                    </div>
                                </Typography>
                                <Box sx={formStyle}>
                                    <form class="msger-inputarea" id="comment-box">
                                        <input type="text" class="msger-input" value={commentData} placeholder="Comment..." onChange={(e) => {
                                            setCommentData(e.target.value);
                                        }} />
                                        <button type="submit" class="msger-send-btn" style={{ backgroundColor: "#022B57" }} onClick={(e) => {
                                            e.preventDefault();
                                            let data = {
                                                userId: userData._id,
                                                commentData: commentData
                                            }
                                            fetch(`http://localhost:3030/user/post/addlikesorcomments/${post._id}`, {
                                                method: 'PUT',
                                                body: JSON.stringify(data),
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                    'Authorization': `bearer ${localStorage.getItem('auth-token')}`
                                                }
                                            }).then(() => handleAllPosts());
                                            setCommentData("");
                                        }}>Send</button>
                                    </form>
                                </Box>
                            </Box>
                        </Modal>

                        <i className="icon-img" class="fa-solid fa-share"></i>
                    </div>
                    <div id="like-count">
                        <text>{post.postLikes.likeCount} likes</text>
                    </div>
                    {post.postCaption ? <div id="post-caption">
                        <text style={{ fontWeight: "bold" }}>{post.userId.userName} </text>
                        <text>{post.postCaption}</text>
                    </div> : ''}
                    <div id="like-count">
                        <text>{post.postComments.length} comments</text>
                    </div>
                </div>
            </div>
        )
    });

    return (
        <>
            <div className="post-box">
                {formattedPost}
            </div>
        </>
    )
}