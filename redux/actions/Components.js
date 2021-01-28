import { Show_Rating_modal, Show_Rating_button, Set_CountDown_timer } from '../types'; 
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 
import moment from 'moment';

export const showRatingModal = (show) => async (dispatch, getState) => { 
  dispatch({
    type: Show_Rating_modal,
    payload: show
  })
  return Promise.resolve(res.data.data.updateRadius.radius);
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
      console.log("the data", responseShowRate)
    const dataMoment = responseShowRate.data.data.showRateItButtonUntilNextHours
    
    console.log("the .................................................................................", dataMoment.ratingSaveTime);
    console.log("heresss", moment(parseInt(dataMoment.ratingSaveTime)).local().format('YYYY-MM-DD HH:mm:ss') )
    dispatch({
      type: Show_Rating_button,
      payload: {...dataMoment, ratingSaveTime: moment(parseInt(dataMoment.ratingSaveTime)).local()}
    })
    return Promise.resolve('ok');
  }catch(error){
    console.log("the error", error.response.data)
  }
}

