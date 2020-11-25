import { Fetch_Category } from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const getAllCategories = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  const body = {
    query:`
    query{
      getCategories{
        title
        type
        imageUrl
      }
    }
    ` 
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    console.log("the res", res)
    dispatch({
      type: Fetch_Category,
      payload: res.data.data.getCategories,
    })
    return Promise.resolve('ok');
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
}