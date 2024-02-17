import { useSelector } from "react-redux"
import useGetUser from "../hooks/useGetUser";

export default function Home(){
    useGetUser();
    const user = useSelector(state => state.user.user);
    console.log(user);
    return (
        <>
            <h1>Hello how are you?</h1>
            <h1></h1>
        </>
    )
}