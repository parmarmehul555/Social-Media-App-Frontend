import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { userInfo } from "../features/userSlice";

function useGetUser() {
    const dispatch = useDispatch();
    const [userData,setUserData] = useState({});
    useEffect(() => {
        fetch('http://localhost:3030/user/userdetails', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then((res) => {
            if (res.ok) return res.json();
        }).then((res) => {
            setUserData(res.isUser);
        }).catch((error) => {
            console.log("ERROR from redux while fetching data ", error);
        })
    }, []);
    return [userData,setUserData];
}

export default useGetUser;