import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: {}
};

const userSlice = createSlice({
    name: "User Info",
    initialState,
    reducers: {
        userInfo: (state, action) => {
            state.user = action.payload
        }
    }
})


export const { userInfo } = userSlice.actions;

export default userSlice.reducer;