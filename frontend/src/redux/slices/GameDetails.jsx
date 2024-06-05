import {createSlice} from '@reduxjs/toolkit';

export const gameDetailsSlice = createSlice({
    name : 'GameDetails',
    initialState : {},
    reducers:{
        setGameDetails:(state, action)=>{
            state = action.payload;
            return state;
        }
    }
})

export const {setGameDetails} = gameDetailsSlice.actions;
export default gameDetailsSlice.reducer;