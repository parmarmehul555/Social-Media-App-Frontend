import { useEffect, useState } from 'react';
import '../CSS/editProfile.style.css';
import UserModelProvider from './UserModelProvider';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useGetUser from '../hooks/useGetUser';

export default function EditProfile() {
    const userData = useGetUser();
    const [user, setUser] = useState({});
    const userOldData = useSelector((state) => state.user.user);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(userOldData);
    }, [])

    function handleNewData() {
        const formData = new FormData();
        formData.append('bio', user.bio);
        formData.append('user-profile-img', user.img);

        axios.put("http://localhost:3030/user/edituserprofile", formData, {
            headers: {
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`,
                'Content-Type': 'multipart/form-data'
            }
        }).then(() => {
            navigate('/profile')
        })
    }

    return (
        <>
            <div className='editprofile-card'>
                <h2>Edit Profile</h2>
                <form encType='multipart/form-data' id='editprofile' onSubmit={(e) => {
                    e.preventDefault();
                    handleNewData();
                }}>
                    <div id='user-img'>
                        <img src={user.userImg} alt='profile-picture' />
                    </div>
                    <div id='editprofile-card-data'>
                        <input id='user-profile-picture' type='file' name='user-profile-img' onChange={(e) => {
                            setUser({ ...user, img: e.target.files[0] });
                        }} />
                        <label htmlFor='user-profile-picture'>Change Profile Picture</label>
                    </div>
                    <div id='editprofile-card-data'>
                        <input className='input-data' type="text" value={user.userName} placeholder='user name' disabled />
                    </div>
                    <div id='editprofile-card-data'>
                        <input className='input-data' type="text" value={user.bio} placeholder='Bio' onChange={(e) => {
                            console.log(e.target.value);
                            setUser({ ...user, bio: e.target.value });
                        }} />
                    </div>
                    <input type='submit' id='save-btn' value={'Save changes'} />
                </form>
            </div>
        </>
    )
}