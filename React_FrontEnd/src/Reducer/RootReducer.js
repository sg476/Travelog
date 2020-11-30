import { combineReducers } from 'redux';
import sidebarReducer from '../Reducer/SidebarReducer';
import bookingReducer from '../Reducer/BookingReducer';

let rootReducer = combineReducers({ sidebarReducer: sidebarReducer, bookingReducer: bookingReducer });

export default rootReducer;