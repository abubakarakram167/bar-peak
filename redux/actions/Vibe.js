import {Set_Vibe, Update_Vibe} from '../types'; 
import { graphql } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const submitVibe = ({ crowdedPlace, nightLife, ageInterval, barType }) => async (dispatch, getState) => {
  
  
  const { token } = await getUserData();
  const body = {
      query:`
      mutation{
        setVibe(vibeInput: {
          crowdedPlace: ${crowdedPlace},
          nightLife: ${nightLife},
          ageInterval: "${ageInterval}",
          barType: "${barType}"
        })
          {
            crowdedPlace,
            nightLife,
            ageInterval
            user{
              email,
              password,
              firstName
            }
          }
      }
      `
    }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    
    dispatch({
      type: Set_Vibe,
      payload: res.data.data.setVibe,
    })
    return Promise.resolve(res.data.data.setVibe);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};

export const updateVibe = ({ crowdedPlace, nightLife, ageInterval, barType }) => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
    query:`
    mutation{
      updateVibe(vibeInput: {
        crowdedPlace: ${crowdedPlace},
        nightLife: ${nightLife},
        ageInterval: "${ageInterval}",
        barType: "${barType}"
      })
        {
          crowdedPlace,
          nightLife,
          ageInterval
          barType
        }
    }
    `
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    
    dispatch({
      type: Update_Vibe,
      payload: res.data.data.updateVibe,
    })
    return Promise.resolve(res.data.data.updateVibe);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}

export const getVibe = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
      query:`
      query{
        getVibe{
          crowdedPlace,
          nightLife,
          ageInterval
          barType     
        }
      } 
      `
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
  
    dispatch({
      type: Set_Vibe,
      payload: res.data.data.getVibe,
    })
    return Promise.resolve(res.data.data.getVibe);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }

}





