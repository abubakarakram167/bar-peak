import { combineReducers } from 'redux';
import {Near_Location_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating, Search_Results, getFavouritesBusiness, selectSpecifcCategoryEstablishments, add_Favourite, Update_Rating } from '../types'; 

const INITIAL_STATE = {
  businesses: [],
  filterBusinesses: {},
  rating: {},
  searchResults: [],
  favouriteBusiness: [],
  selectedEstablishmentCategory: '',
  addToFavourite: '',
  showFavorites: false,
};

const businessReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {

    case Near_Location_Business:
      return{
        ...state,
        businesses: action.payload
      }
    case add_Favourite:
      return {
        ...state,
        favoutiteBusiness: state.favouriteBusiness.concat(action.payload)
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
      return{
        ...state,
        filterBusinesses: action.payload,
        showFavorites:action.payload.isFavorite
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
    case Update_Rating:
      console.log("the action.payload", action.payload.markerId)
      console.log("the business", state.businesses[0])
      const index = state.businesses.findIndex(todo => todo._id === action.payload.markerId)
      const newArray = [...state.businesses]
      newArray[index].rating = action.payload.rating
      
      
      console.log("......///////////////////.////////////////")
      console.log("after updating", newArray[index])
      return {
        ...state,
        businesses:  newArray
      }    
    default:
      return state
  }
};

export default combineReducers({
  business: businessReducer
});