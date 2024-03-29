import { Show_Rating_modal, Show_Rating_button, Set_CountDown_timer, Show_Vibe_Info_modal } from '../types'; 
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 
import moment from 'moment';

export const showRatingModal = (show) => async (dispatch, getState) => { 
  dispatch({
    type: Show_Rating_modal,
    payload: show
  })
  return Promise.resolve('ok');
}

export const showVibeInfoModal = (show) => async (dispatch, getState) => { 
  dispatch({
    type: Show_Vibe_Info_modal,
    payload: show
  })
  return Promise.resolve('ok');
}

export const setCountDowntimer = (seconds) => async (dispatch, getState) => {
  dispatch({
    type: Set_CountDown_timer,
    payload: seconds
  })
  return Promise.resolve("ok");
}

export const showRatingButton = (markerId) => async (dispatch, getState) => { 
  
  try{
    const { token } = await getUserData();
    const rateButtonBody = {
      query: `
      query{
        showRateItButtonUntilNextHours(businessId: "${markerId}"){
          showRateItButton
          ratingSaveTime
        } 
      }`
    }
    const responseShowRate = await axios.post(`graphql?`, rateButtonBody,{ 
      headers: {
        'Authorization': `Bearer ${token}`
      }});
      
    const dataMoment = responseShowRate.data.data.showRateItButtonUntilNextHours
    console.log("...............")
    console.log("the data moment", dataMoment);
    dispatch({
      type: Show_Rating_button,
      payload: {...dataMoment, ratingSaveTime: dataMoment.ratingSaveTime}
    })
    return Promise.resolve('ok');
  }catch(error){
    console.log("the error", error.response.data)
  }
}

