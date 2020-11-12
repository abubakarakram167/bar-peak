import { combineReducers } from 'redux';
import {Set_Vibe, Update_Vibe} from '../types'; 

const INITIAL_STATE = {
  vibe:{}
};

const vibeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Set_Vibe:
      if (action.payload === null)
        action.payload = {};
      return{
        ...state,
        vibe: action.payload
      }
    case  Update_Vibe:
      return{
        ...state,
        vibe: action.payload
      }
    default:
      return state
  }
};

export default combineReducers({
  vibe: vibeReducer
});