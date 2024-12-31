import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const currentPodcastSlice = createSlice({
    name : 'currentPodcast',
    initialState,
    reducers : {
        setCurrPodcast(state,action){
          return state = action.payload
        }
    }
})

export const {setCurrPodcast} = currentPodcastSlice.actions;
export default currentPodcastSlice.reducer