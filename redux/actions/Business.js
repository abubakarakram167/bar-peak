import {Fetch_All_Business, FILTERED_BUSINESS, Empty_Business} from '../types'; 
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
            },
            shortDescription,
            longDescription
        }
       }
      `
    }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    // console.log("the data", res.data.data.allBusinesses)
    dispatch({
      type: Fetch_All_Business,
      payload: res.data.data.allBusinesses,
    })
    return Promise.resolve(res.data.data.allBusinesses);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};

export const getfilteredBusiness = (data, location, category) => async (dispatch, getState) => {

  // console.log("the vibe in call");
  const { vibe, user } = getState();
  const actualUser = user.user.user;
  console.log("the actual user", actualUser);
  const actualVibe = vibe.vibe.vibe
  //For Testing coordiantes
  const latitude = 32.7174;
  const longitude = -117.1628;

  let selectedCategory = '';

  if(category !== null)
    selectedCategory = category;
  else
    selectedCategory = actualVibe.barOrRestaurant
    console.log("the selected category", selectedCategory);
  // For Production
  // const { latitude, longitude } = location;
  // console.log("the actual vibe", actualVibe);
  
  try{ 
    const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${actualUser.radius}&type=${selectedCategory}&keyword=cruise&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`);
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

export const emptyBusiness = () => async (dispatch, getState) => {
  dispatch({
    type: Empty_Business,
    payload: null,
  })
  setTimeout(()=>{
    return Promise.resolve('ok');
  }, 2000) 
}
