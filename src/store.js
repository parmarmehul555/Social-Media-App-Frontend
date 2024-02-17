import { configureStore } from "@reduxjs/toolkit";
import userReducer from './features/userSlice';
import chatReducer from "./features/chatProfileSlice";
import chatUserReducer from "./features/chatUserSlice";

const store = configureStore({
    reducer: {
        user: userReducer,
        myChats: chatReducer,
        chatUser : chatUserReducer
    }
})

export default store;