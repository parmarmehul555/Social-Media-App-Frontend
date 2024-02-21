import { useEffect, useState } from "react";

function useGetUser() {
    const [userData, setUserData] = useState({});
    useEffect(() => {
        fetch('http://localhost:3030/user/userdetails', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem('auth-token')}`
            }
        }).then((res) => {
            if (res.ok) return res.json();
            else {
                throw new Error("Can not get user!!")
            }
        }).then((res) => {
            setUserData(res.isUser);
        }).catch((error) => {
            console.log("ERROR from redux while fetching data ", error);
        })
    }, []);
    return userData;
}

export default useGetUser;