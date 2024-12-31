import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name : 'user',
    initialState : {
        user : null
    },
    reducers : {
        setUser(state,action){
            state.user = action.payload;
        },
        setName(state,action){
state.user = {...state.user,name : action.payload}
        },
        setEmail(state,action){
            state.user = {...state.user,email : action.payload}
                    },
        removeUser(state,action){
            state.user = null;
        }
    }

})

export const {setUser,removeUser,setName,setEmail} = userSlice.actions;
export default userSlice.reducer;