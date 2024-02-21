import { Link } from 'react-router-dom'
import '../CSS/account.style.css'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react';
import useGetUser from '../hooks/useGetUser';
import { userInfo } from '../features/userSlice';

export default function Account() {
    const userData = useGetUser();
    const dispatch = useDispatch();

    dispatch(userInfo(userData));
    const user = useSelector(state => state.user.user);
    return (
        <>
            <div id="accountdetails">
                <div id="user-img">
                    <img src={user.userImg} alt='profile-picture' />
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
                    <text>{user.userName}</text>
                </div>
                <div className="userdetail">
                    <text>{user.bio}</text>
                </div>
                <Link to={'/editprofile'}><button id='edit-profile'>Edit Profile</button></Link>
            </div>
        </>
    )
}