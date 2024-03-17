import { useEffect, useState } from 'react'
import '../CSS/dashboard.style.css'
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3030/admin/getallusers', {
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
            setUsers(res);
            console.log("===========", users);
        }).catch((error) => {
            console.log(error);
        })
    }, []);

    function handleDelete(id) {
        fetch('http://localhost:3030/admin/deleteuser/' + id, {
            method: "DELETE",
            headers: {
                'Authorization': `bearer ${localStorage.getItem('admin-token')}`
            }
        }).then(() => {
            setUsers(users.filter((user) => user._id !== id ? user : ''));
        })
    }

    const formatedUsers = users.map((user, index) => {
        return (
            <li class="table-row" style={{ textAlign: "center" }}>
                <div class="col col-3" data-label="Job Id">{user?.userName}</div>
                <div class="col col-3" data-label="Customer Name">{user?.followingCount}</div>
                <div class="col col-4" data-label="Amount">{user?.followerCount}</div>
                <div class="col col-4" data-label="Payment Status">
                    <Link to={`/admin/user/${user._id}`}><i class="fa-solid fa-circle-info" style={{ fontSize: "18px", marginRight: "15px" }}></i></Link>
                    <i class="fa-solid fa-trash" id='delete-btn' style={{ fontSize: "18px" }} onClick={() => { handleDelete(user._id) }}></i>
                </div>
            </li >
        )
    })

    return (
        <>
            <div class="container">
                <div style={{display:'flex',justifyContent:'space-evenly',alignItems:'center'}}>
                    <h2>Users of App</h2>
                    <button className='btn btn-danger'onClick={()=>{
                        localStorage.removeItem('admin-token');
                        navigate( '/admin/login');
                    }}>Logout</button>
                </div>
                <ul class="responsive-table">
                    <li class="table-header" style={{ textAlign: "center" }}>
                        <div class="col col-3">User Name</div>
                        <div class="col col-3">Following</div>
                        <div class="col col-4">Followers</div>
                        <div class="col col-4">Options</div>
                    </li>
                    {formatedUsers}
                </ul>
            </div>
        </>
    )
}