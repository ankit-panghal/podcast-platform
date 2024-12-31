import { configureStore } from "@reduxjs/toolkit";
import userReducer from './Slices/userSlice'
import podcastReducer from "./Slices/podcastSlice";
import userPodcastsReducer from "./Slices/userPodcastsSlice";
import currentPodcastReducer from './Slices/currentPodcastSlice'
const store = configureStore({
    reducer : {
        user : userReducer,
        podcasts : podcastReducer,
        userPodcasts : userPodcastsReducer,
        currentPodcast :currentPodcastReducer
    }
})
export default store;
