import { Button, Image, Text, useEditable } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { Card, CardHeader, CardBody, CardFooter } from '@chakra-ui/react'
import '../CSS/adminUserProfile.css'

export default function AdminUserProfile() {
    const { userId } = useParams();
    const [data, setData] = useState({})
    const [postData,setPostData] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:3030/admin/getuser/${userId}`, {
            headers: {
                'Authorization': `bearer ${localStorage.getItem('admin-token')}`
            }
        }).then((res) => {
            if (res.ok) {
                return res.json();
            }
            else {
                throw new Error("Can not get all users!! ");
            }
        }).then((res) => {
            setData(res);
            setPostData(res.postData);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    function handleDeletePost(id) {
        fetch('http://localhost:3030/admin/deletepost/' + id, {
            method: 'DELETE',
            headers: {
                'Authorization': `bearer ${localStorage.getItem('admin-token')}`
            }
        }).then((res) => {
            if (res.ok) {
                setPostData(postData.filter((post) => post._id !== id ? post : ''));
            }
            else {
                console.log("Can not delete post!!");
            }
        });
    }

    const formattedUserPosts = postData?.map((post) => {
        return (
            <div className="col-4">
                <div class="card">
                    <img src={post.postURL} class="card-img-top" alt="..." />
                    <div class="card-body">
                        {post.postCaption && <p class="card-text">{post.postCaption}</p>}
                        {!post.postCaption && <p class="card-text" style={{ color: "red", fontWeight: "bold" }}>No caption</p>}
                        <div id="post-details">
                            <p class="card-text"><i class="fa-regular fa-heart"></i> {post.postLikes.likeCount}</p>
                            <p class="card-text"><i class="fa-regular fa-comment"></i> {post.postComments.length}</p>
                            <div class="btn btn-danger" onClick={()=>handleDeletePost(post._id)}><i class="fa-solid fa-trash"></i> Delete</div>
                        </div>
                    </div>
                </div>
            </div >
        )
    })

    return (
        <>
            <div className="postBox">
                <div id='user-profile' className="admin-user-profile">
                    <div id="user-img">
                        <img src={data?.data?.userImg} alt='profile-picture' />
                    </div>
                    <div>
                        <div className="userdetail">
                            <text>{data?.data?.userName}</text>
                        </div>
                        <div id='userProfileDetail'>
                            <div className='userprofile'>
                                <div className='count'>25</div>
                                <label>Posts</label>
                            </div>

                            <div className='userprofile'>
                                <div className='count'>{data?.data?.followingCount}</div>
                                <label>Followings</label>
                            </div>

                            <div className='userprofile'>
                                <div className='count'>{data?.data?.followerCount}</div>
                                <label>Followers</label>
                            </div>
                        </div>

                        <div className="userdetail">
                            <text>{data?.data?.bio}</text>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row postCard">
                {formattedUserPosts}
            </div>
        </>
    )
}