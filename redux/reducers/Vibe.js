import { combineReducers } from 'redux';
import {Set_Vibe} from '../types'; 

const INITIAL_STATE = {
  vibe:{}
};

const vibeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case Set_Vibe:
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