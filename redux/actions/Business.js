import {Near_Location_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating} from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 

export const getNearLocationBusiness = ({ latitude, longitude }) => async (dispatch, getState) => {
  const { user } = getState();
  let { radius } = user.user.user;
  const { token } = await getUserData();

  latitude = 32.7970465;
  longitude = -117.254522;
  radius = 20000;

  const body = {
      query:`
      query{
        getNearByLocationBusiness(locationInput: { latitude: ${latitude}, longitude: ${longitude}, radius: ${radius} }){
        _id
        placeId
        category{
            title
            _id
        }    
        name
        rating{
          fun,
          crowd,
          ratioInput,
          difficultyGettingIn,
          difficultyGettingDrink
        }
        totalUserCountRating
        ageInterval
        ratioType
        customData{
          address
          phoneNo
          rating
        }
        uploadedPhotos{
          secure_url
        }
        googleBusiness{
          formatted_address
          formatted_phone_number
          name
          place_id
          user_ratings_total
          rating
          url
          types
        }
        }}
      `
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    dispatch({
      type: Near_Location_Business,
      payload: res.data.data.getNearByLocationBusiness,
    })
    return Promise.resolve(res.data.data.getNearByLocationBusiness);
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
};

export const getfilteredBusiness = ( category) => async (dispatch, getState) => {

  const { vibe, business } = getState();
  const data = business.business.businesses;
  const actualVibe = vibe.vibe.vibe;

  console.log("the data", data)
  let selectedCategory = '' 
  let whatPlace = '';
  if(actualVibe.nightLife){
    whatPlace = "nightLife";
    selectedCategory = "Night Clubs"
  }
  else{
    selectedCategory = actualVibe.barType;
    whatPlace = "Bar"
  } 
  if(category !== null){
    if(category === "Night Clubs"){
      selectedCategory = category
      whatPlace = category
    }
    else{
      selectedCategory = actualVibe.barType;
      whatPlace = "Bar"
    }
  }
    
  try{ 
    
    let filterCategoryBusinessVibe = {
      goodSpots: [],
      averageSpots: [],
      badSpots: []
    };
    
    
      data.map(business => {
        if(googleBusiness.place_id === business.placeId && business.ageInterval === actualVibe.ageInterval && selectedCategory === business.category.title){
          if(actualVibe.crowdedPlace){
            if(business.rating.crowd > 7.1 && business.rating.crowd < 10){
              filterCategoryBusinessVibe.goodSpots.push(googleBusiness)
            }
            else if(business.rating.crowd >= 5.1 && business.rating.crowd <= 7){
              filterCategoryBusinessVibe.averageSpots.push(googleBusiness)
            }
            else if(business.rating.crowd >= 1 && business.rating.crowd <= 5){
              filterCategoryBusinessVibe.badSpots.push(googleBusiness)
            }
          }
          else{
            if(business.rating.crowd > 1 && business.rating.crowd < 5){
              filterCategoryBusinessVibe.goodSpots.push(googleBusiness)
            }
            else if(business.rating.crowd >= 5.1 && business.rating.crowd <= 7){
              filterCategoryBusinessVibe.averageSpots.push(googleBusiness)
            }
            else if(business.rating.crowd >= 7.1 && business.rating.crowd <= 10){
              filterCategoryBusinessVibe.badSpots.push(googleBusiness)
            }
          }   
        }
      })
   
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

export const addRating = (data) => async (dispatch, getState) => {
  dispatch({
    type: ADD_Rating,
    payload: data,
  })
}
