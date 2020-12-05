import { Update_Radius, Fetch_User, SET_LOCATION } from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const updateRadius = (radius) => async (dispatch, getState) => {
  console.log("here the user radius", radius);
  const { token } = await getUserData();
  const body = {
      query:`
      mutation{
        updateRadius(radius: ${ parseInt(radius)}){
            firstName
            radius
            lastName
            email
            dob
        }
      }
      `
    }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    dispatch({
      type: Update_Radius,
      payload: res.data.data.updateRadius.radius,
    })
    return Promise.resolve('ok');
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}

export const getUser = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
    query:`
      query{
        getUser{
            _id
            firstName
            lastName
            email
            dob
            radius
        }
      }
    ` 
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    dispatch({
      type: Fetch_User,
      payload: res.data.data.getUser,
    })
    return Promise.resolve('ok');
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}

export const setUserLocation = (data) => async (dispatch, getState) => {
  dispatch({
    type: SET_LOCATION,
    payload: data,
  })
}
