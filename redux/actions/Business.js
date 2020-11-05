import {Fetch_All_Business} from '../types'; 
import axios from 'axios';
export const getAllBusiness = () => async dispatch => {
  
  const res = await axios.get(`http://jsonplaceholder.typicode.com/users`)
  // console.log("the response", res);
  dispatch({
    type: Fetch_All_Business,
    payload: res,
  })
};
