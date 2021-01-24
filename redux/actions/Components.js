import { Show_Rating_modal } from '../types'; 


export const showRatingModal = (show) => async (dispatch, getState) => { 
  dispatch({
    type: Show_Rating_modal,
    payload: show
  })
  return Promise.resolve(res.data.data.updateRadius.radius);

}