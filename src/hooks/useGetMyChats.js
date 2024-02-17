import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

function useGetMyChats() {
    const dispatch = useDispatch();
    const [myChats, setMyChats] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3030/user/chat/fetchchats', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `bearer ${localStorage.getItem("auth-token")}`
            }
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                else {
                    throw new Error("Can not fetch you chats!!")
                }
            }).then((res) => {
                setMyChats(res);
            }).catch((error) => {
                console.log(error);
            })
    }, [])
    return [myChats, setMyChats];
}

export default useGetMyChats;