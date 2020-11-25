import { combineReducers } from 'redux';
import { Fetch_Category } from '../types'; 

const INITIAL_STATE = {
  category: []
};

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Fetch_Category:
      return{
        ...state,
        category: action.payload
      }  
    default:
      return state
  }
};

export default combineReducers({
  category: categoryReducer
});