import {Fetch_All_Business, FILTERED_BUSINESS} from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const getAllBusiness = () => async (dispatch, getState) => {
  const { token } = await getUserData();
  console.log("the token", token)
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
};

export const getfilteredBusiness = (data) => async (dispatch, getState) => {
  try{ 
    const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=32.7174,-117.1628&radius=15000&type=restaurant&keyword=cruise&fields=photos,formatted_address,name,rating,types,price_level&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`);
    let specificPlaces = data.map(business => business.placeId);
    const filteredBusiness = res.data.results.filter((business)=>{
      return(specificPlaces.includes(business.place_id))
    })
    
    let filterCategoryBusinessVibe = {
      crowded: [],
      unCrowded: []
    };
    
    filteredBusiness.map((googleBusiness)=>{
      data.map(business => {
        if(googleBusiness.place_id === business.placeId){
          if(business.profile.crowded)
            filterCategoryBusinessVibe.crowded.push(googleBusiness)
          else
            filterCategoryBusinessVibe.unCrowded.push(googleBusiness)
        }
      })
    })
  
    dispatch({
      type: FILTERED_BUSINESS,
      payload: filterCategoryBusinessVibe,
    })
  
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};
