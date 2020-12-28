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

  const { vibe, user, business } = getState();
  const data = business.business.businesses;
  const { radius } = user.user.user;
  const actualVibe = vibe.vibe.vibe;
  let { latitude, longitude } = user.user.location;
  // console.log(" the radius ", radius);
  console.log(`the latitude ${latitude} and longitude ${longitude}`)
  // console.log("the vibe", actualVibe);
   //For Testing
    //  latitude = 32.7970465;
    //  longitude = -117.2545220;
  // const latitude =   31.4737;
  // const longitude =  74.3834;
  let selectedCategory = '' 
  let whatPlace = '';
  if(actualVibe.nightLife){
    whatPlace = "nightLife";
    selectedCategory = "nightLife"
  }
  else{
    selectedCategory = actualVibe.barType;
    whatPlace = "bar"
  } 
  if(category !== null){
    if(category === "nightLife"){
      selectedCategory = category
      whatPlace = category
    }
    else{
      selectedCategory = actualVibe.barType;
      whatPlace = "bar"
    }
  }
    
  try{ 
    const res = await axios.get(`getGoogleMapsResults?business_type=${whatPlace}&lat=${latitude.toFixed(4)}&lon=${longitude.toFixed(4)}&radius=${radius}`); 
    let specificPlaces = data.map(business => business.placeId);
    
    const filteredBusiness = res.data.filter((business)=>{
      return(specificPlaces.includes(business.place_id));
    })
    
    let filterCategoryBusinessVibe = {
      goodSpots: [],
      averageSpots: [],
      badSpots: []
    };
    
    filteredBusiness.map((googleBusiness)=>{
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
    })
    // console.log("the filtered", filterCategoryBusinessVibe);
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
