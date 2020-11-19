import { combineReducers } from 'redux';
import { Update_Radius, Fetch_User } from '../types'; 

const INITIAL_STATE = {
  user:{}
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Update_Radius:
      return{
        ...state,
        user: action.payload
      }
    case Fetch_User:
      return{
        ...state,
        user: action.payload
      }  
    default:
      return state
  }
};

export default combineReducers({
  user: userReducer
});