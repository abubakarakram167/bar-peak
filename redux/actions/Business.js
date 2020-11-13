import {Fetch_All_Business, FILTERED_BUSINESS} from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const getAllBusiness = () => async (dispatch, getState) => {
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
};

export const getfilteredBusiness = (data, location) => async (dispatch, getState) => {

  // console.log("the vibe in call");
  const { vibe } = getState();
  const actualVibe = vibe.vibe.vibe
  //For Testing coordiantes
  const latitude = 32.7174;
  const longitude = -117.1628;

  // For Production
  // const { latitude, longitude } = location;
  // console.log("the actual vibe", actualVibe);
  
  try{ 
    const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=15000&type=${actualVibe.barOrRestaurant}&keyword=cruise&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`);
    //  console.log(" the results from google is", res.data.results);
    let specificPlaces = data.map(business => business.placeId);
    const filteredBusiness = res.data.results.filter((business)=>{
      return(specificPlaces.includes(business.place_id))
    })
    // console.log("the business in our database", filteredBusiness);
    
    let filterCategoryBusinessVibe = {
      crowded: [],
      unCrowded: []
    };
    
    filteredBusiness.map((googleBusiness)=>{
      data.map(business => {
        if(googleBusiness.place_id === business.placeId){
          if(business.profile.crowded && business.profile.expensive )
            filterCategoryBusinessVibe.crowded.push(googleBusiness)
          else if (!business.profile.crowded && !business.profile.expensive)
            filterCategoryBusinessVibe.unCrowded.push(googleBusiness)
        }
      })
    })

    // console.log("the filteferf business", filterCategoryBusinessVibe)
  
    dispatch({
      type: FILTERED_BUSINESS,
      payload: filterCategoryBusinessVibe,
    })
  
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};
