import { combineReducers } from 'redux';
import { Update_Radius } from '../types'; 

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
    default:
      return state
  }
};

export default combineReducers({
  user: userReducer
});