import { combineReducers } from 'redux';
import { Show_Rating_modal } from '../types'; 

const INITIAL_STATE = {
  showRatingModal: false
};

const componentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Show_Rating_modal:
      return{
        ...state,
        showRatingModal: action.payload
      }
    default:
      return state
  }
};

export default combineReducers({
  component: componentReducer
});