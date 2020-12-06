import {Fetch_All_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating} from '../types'; 
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
               category{
                   title
                   type
                   imageUrl
               },
               shortDescription,
               longDescription,
               title,
               ageInterval,
               rating{
                   fun,
                   crowd,
                   girlToGuyRatio,
                   difficultyGettingIn,
                   difficultyGettingDrink
               },
               totalUserCountRating
           }
      }
      `
  }
  try{  
    const res = await axios.post(`graphql?`,body,{ headers: {
      'Authorization': `Bearer ${token}`
    } });
    //  console.log("the data in our database", res.data.data.allBusinesses)
    dispatch({
      type: Fetch_All_Business,
      payload: res.data.data.allBusinesses,
    })
    return Promise.resolve(res.data.data.allBusinesses);
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
  
  // For Testing
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
