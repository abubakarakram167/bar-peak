import { combineReducers } from 'redux';
import {Fetch_All_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating} from '../types'; 

const INITIAL_STATE = {
  businesses: [],
  filterBusinesses: {},
  rating: {}
};

const businessReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case Fetch_All_Business:
      return{
        ...state,
        businesses: action.payload
      }
    case FILTERED_BUSINESS:
      return{
        ...state,
        filterBusinesses: action.payload
      }
    case Empty_Business:
      return{
        ...state,
        filterBusinesses: {}
      }
    case ADD_Rating:
      return {
        ...state,
        rating: action.payload
      }    
    default:
      return state
  }
};

export default combineReducers({
  business: businessReducer
});