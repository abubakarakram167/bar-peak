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
  console.log("the actual vibe", actualVibe)
  //For Testing coordiantes
  const latitude = 32.7970465;
  const longitude = -117.2545220;
  let selectedCategory = '' 

  let whatPlace = '';
  if(actualVibe.nightLife){
    whatPlace = "night_club";
    selectedCategory = "nightLife"
  }
  else{
    selectedCategory = actualVibe.barType;
    whatPlace = "bar"
  }
  console.log(`the selectedCategory ${selectedCategory} and whatplace is ${whatPlace}`);
      
  // if(category !== null)
  //   selectedCategory = category;
  // else
  //   selectedCategory = actualVibe.barOrRestaurant
    // console.log("the selected category", selectedCategory);
  // For Production
  // const { latitude, longitude } = location;
  // console.log("the actual vibe", actualVibe);
  
  try{ 
    const res = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${actualUser.radius}&type=${whatPlace}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`);
      // console.log(" the results from google is", res.data.results);
    let specificPlaces = data.map(business => business.placeId);
    
    // console.log("specific places::", specificPlaces)

    const filteredBusiness = res.data.results.filter((business)=>{
      return(specificPlaces.includes(business.place_id));
    })
    
    let filterCategoryBusinessVibe = {
      goodSpots: [],
      averageSpots: [],
      badSpots: []
    };
    
    // console.log("the filter businesses", filteredBusiness);
    
    filteredBusiness.map((googleBusiness)=>{
      data.map(business => {
        // console.log("the business", business)
        if(googleBusiness.place_id === business.placeId && business.ageInterval === actualVibe.ageInterval && selectedCategory === business.category.title){
          if(actualVibe.crowdedPlace){
            if(business.rating.crowd > 7.1 && business.rating.crowd < 10){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(business.rating.crowd >= 5.1 && business.rating.crowd <= 7){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 1 && business.rating.crowd <= 5){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }
          else{
            if(business.rating.crowd > 1 && business.rating.crowd < 5){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(business.rating.crowd >= 5.1 && business.rating.crowd <= 7){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 7.1 && business.rating.crowd <= 10){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }   
        }
      })
    })

    // console.log("the division business", filterCategoryBusinessVibe)
  
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
