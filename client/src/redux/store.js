import {configureStore} from '@reduxjs/toolkit';
import {alertSlices} from './alertSlices';
import { combineReducers } from 'redux';

const rootReducer = combineReducers({
  alerts: alertSlices.reducer, // use 'alerts' to match useSelector
    // Add other slices here as needed
});
export const store = configureStore({
  reducer: rootReducer,
});

export default store;