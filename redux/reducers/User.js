import { combineReducers } from 'redux';
import { Update_Radius, Fetch_User, SET_LOCATION } from '../types'; 

const INITIAL_STATE = {
  user:{},
  location: {},
  radius: 0
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Update_Radius:
      return{
        ...state,
        radius: action.payload
      }
    case Fetch_User:
      return{
        ...state,
        user: action.payload,
        radius: action.payload.radius
      }
    case SET_LOCATION:
      return{
        ...state,
        location: action.payload
      }      
    default:
      return state
  }
};

export default combineReducers({
  user: userReducer
});