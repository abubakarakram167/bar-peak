import { combineReducers } from 'redux';
import {Fetch_All_Business} from '../types'; 

const INITIAL_STATE = {
  businesses: [{ name: "abubakar" }],
  some:1
};

const businessReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case Fetch_All_Business:
      return{
        ...state,
        business: action.payload
      }

    default:
      return state
  }
};

export default combineReducers({
  business: businessReducer
});