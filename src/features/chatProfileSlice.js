import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    chatProfiles: []
}

const chatProfileSlice = createSlice({
    name: "Chat Profile Slice",
    initialState,
    reducers: {
        myChatProfiles: (state, action) => {
            state.chatProfiles = action.payload
        }
    }
});

export const { myChatProfiles } = chatProfileSlice.actions

export default chatProfileSlice.reducer