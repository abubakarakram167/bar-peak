import { combineReducers } from 'redux';
import { Show_Rating_modal, Show_Rating_button, Set_CountDown_timer } from '../types'; 

const INITIAL_STATE = {
  showRatingModal: false,
  showRatingButton: true,
  untilNextRateInSeconds: 30
};

const componentReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case Show_Rating_modal:
      return{
        ...state,
        showRatingModal: action.payload
      }
    case Show_Rating_button:
      return{
        ...state,
        showRatingButton: action.payload
      }
    case Set_CountDown_timer:
      return{
        ...state,
        untilNextRateInSeconds: action.payload
      }  
    default:
      return state
  }
};

export default combineReducers({
  component: componentReducer
});