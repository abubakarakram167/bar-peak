import {Fetch_All_Business, FILTERED_BUSINESS} from '../types'; 
import { graphql } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const getAllBusiness = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  console.log("the token", token)
  const body = {
      query:`
      query{
        allBusinesses{
            placeId
        }
       }
      `
    }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    
    console.log("the action data", res.data.data.allBusinesses)
    dispatch({
      type: Fetch_All_Business,
      payload: res.data.data.allBusinesses,
    })
    return Promise.resolve(res.data.data.allBusinesses);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};

export const getfilteredBusiness = (data) => async (dispatch, getState) => {
  try{  
    const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?fields=photos,formatted_address,name,rating,types,price_level&location=-33.8670522,151.1957362&radius=15000&type=restaurant&keyword=cruise&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`);
    
    let specificPlaces = data.map(business => business.placeId);
    const filteredBusiness = res.data.results.filter((business)=>{
      return(specificPlaces.includes(business.place_id))
    })
    dispatch({
      type: FILTERED_BUSINESS,
      payload: filteredBusiness,
    })
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};
