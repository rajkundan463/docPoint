import {configureStore} from '@reduxjs/toolkit';
import {alertSlices} from './alertSlices';
import { combineReducers } from 'redux';
import { userSlice } from './userSlices';

const rootReducer = combineReducers({
  alerts: alertSlices.reducer, // use 'alerts' to match useSelector
   user : userSlice.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
});

export default store;