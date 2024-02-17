import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatUser : {}
}

const chatUserSlice = createSlice({
    name : "chat user",
    initialState,
    reducers:{
        setChatUser : (state,action)=>{
            state.chatUser = action.payload;
        }
    }
});

export const {setChatUser} = chatUserSlice.actions;

export default chatUserSlice.reducer;