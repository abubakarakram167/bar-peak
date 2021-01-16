import {Set_Vibe, Update_Vibe} from '../types'; 
import { graphql } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const submitVibe = (vibeInput) => async (dispatch, getState) => {
  
  const {
    fun,
    party,
    barOrNightClub,
    crowdLevel,
    ageDemographic,
    vibeCategory,
    selectedCategories
  } = vibeInput;
  const { token } = await getUserData();
 
  const body = {
      query:`
      mutation{
        setVibe(vibeInput: { 
          fun: "${fun}",
          party: "${party}",
          barOrNightClub: "${barOrNightClub}",
          crowdLevel: "${crowdLevel}",
          ageDemographic: "${ageDemographic}",
          vibeCategory: "${vibeCategory}",
          selectedCategories: "${selectedCategories}"
        })
          {
            vibeCategory
            barOrNightClub
            selectedCategories
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
    console.log("hte errorsss, submit vibe", err.response)
  }
};

export const updateVibe = (vibeInput) => async (dispatch, getState) => {
  const { token } = await getUserData();
  const {
    fun,
    party,
    barOrNightClub,
    crowdLevel,
    ageDemographic,
    vibeCategory,
    selectedCategories
  } = vibeInput;
  const body = {
    query:`
    mutation{
      updateVibe(vibeInput: { 
        fun: "${fun}",
        party: "${party}",
        barOrNightClub: "${barOrNightClub}",
        crowdLevel: "${crowdLevel}",
        ageDemographic: "${ageDemographic}",
        vibeCategory: "${vibeCategory}",
        selectedCategories: "${selectedCategories}"
      })
        {
          vibeCategory
          barOrNightClub
          selectedCategories
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
    console.log("hte errorsss, updateVibe", err)
  }
}

export const getVibe = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
      query:`
      query{
        getVibe{
          vibeCategory
          barOrNightClub
          selectedCategories
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
    console.log("hte errorsss getVibe", err)
  }

}





