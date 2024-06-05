import {configureStore} from '@reduxjs/toolkit';
import userDetailsSlice from '../redux/slices/UserDetails';
import gameDetailsSlice  from './slices/GameDetails';
gameDetailsSlice
const store = configureStore({
    reducer:{
        UserDetails : userDetailsSlice,
        GameDetails : gameDetailsSlice,
    },
})

export default store;