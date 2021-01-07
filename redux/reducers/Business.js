import { combineReducers } from 'redux';
import {Near_Location_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating, Search_Results, getFavouritesBusiness, selectSpecifcCategoryEstablishments } from '../types'; 

const INITIAL_STATE = {
  businesses: [],
  filterBusinesses: {},
  rating: {},
  searchResults: [],
  favouriteBusiness: [],
  selectedEstablishmentCategory: ''
};

const businessReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case Near_Location_Business:
      return{
        ...state,
        businesses: action.payload
      }
    case selectSpecifcCategoryEstablishments:
      return{
        ...state,
        selectedEstablishmentCategory: action.payload
      }
    case getFavouritesBusiness:
      return{
        ...state,
        favouriteBusiness: action.payload
      }
    case Search_Results: 
      return {
       ...state,
        searchResults: action.payload
      }  
    case FILTERED_BUSINESS:
      console.log("in reducer filter", action.payload)
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