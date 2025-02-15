import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const userPodcastsSlice = createSlice({
    name : 'userPodcasts',
    initialState,
    reducers : {
        updatePodcasts(state,action){
         return state = action.payload
        }
    }
})

export const {updatePodcasts} = userPodcastsSlice.actions;
export default userPodcastsSlice.reducer;