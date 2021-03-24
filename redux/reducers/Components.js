import { combineReducers } from 'redux';
import { Show_Rating_modal, Show_Rating_button, Set_CountDown_timer, Show_Vibe_Info_modal } from '../types'; 

const INITIAL_STATE = {
  showRatingModal: false,
  showRatingButton: true,
  untilNextRateInSeconds: 30,
  ratingStartTime: '',
  showVibeInfoModalAfterVibe: false
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
        showRatingButton: action.payload.showRateItButton,
        ratingStartTime: action.payload.ratingSaveTime
      }
    case Set_CountDown_timer:
      return{
        ...state,
        untilNextRateInSeconds: action.payload
      }
    case Show_Vibe_Info_modal:
      console.log("hehehjwbkbndwjk", action.payload)
      return{
        ...state,
        showVibeInfoModalAfterVibe: action.payload
      }
    default:
      return state
  }
};

export default combineReducers({
  component: componentReducer
});