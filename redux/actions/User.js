import { Update_Radius } from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const updateRadius = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
      query:`
      query{
        allBusinesses{
            placeId,
            category,
            profile{
              expensive,
              crowded
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
      type: Fetch_All_Business,
      payload: res.data.data.allBusinesses,
    })
    return Promise.resolve(res.data.data.allBusinesses);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}