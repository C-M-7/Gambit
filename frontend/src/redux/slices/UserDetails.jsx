import {createSlice} from '@reduxjs/toolkit';

export const userDetailsSlice = createSlice({
    name : 'UserDetails',
    initialState : {},
    reducers:{
        setUserDetails:(state, action)=>{
            state = action.payload;
            return state;
        }
    }
})

export const {setUserDetails} = userDetailsSlice.actions;
export default userDetailsSlice.reducer;