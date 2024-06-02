import {configureStore} from '@reduxjs/toolkit';
import userDetailsSlice from '../redux/slices/UserDetails';

const store = configureStore({
    reducer:{
        UserDetails : userDetailsSlice,
    },
})

export default store;