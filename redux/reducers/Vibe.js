import { combineReducers } from 'redux';
import {Set_Vibe, Update_Vibe, Empty_Vibe, showVibeModal} from '../types'; 

const INITIAL_STATE = {
  vibe:{},
  showVibeModal: false
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
    case Empty_Vibe:
      if (action.payload === null)
        action.payload = {};
      return {
        ...state,
        vibe: {}
      }  
    case  Update_Vibe:
      return{
        ...state,
        vibe: action.payload
      }
    case showVibeModal: 
      return{
        ...state,
        showVibeModal: action.payload
      }
    default:
      return state
  }
};

export default combineReducers({
  vibe: vibeReducer
});