import {
  Near_Location_Business, 
  FILTERED_BUSINESS, 
  Empty_Business, 
  ADD_Rating, 
  Search_Results, 
  getFavouritesBusiness, 
  selectSpecifcCategoryEstablishments, 
  Update_Rating, 
  GET_ADMIN_SETTINGS,
} from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 
import Category from '../reducers/Category';
import haversine from 'haversine-distance'
import { getAllCaseData , getSelectedCategories, getSearchData } from "../helperFunction";

let getMiles = (i) => {
  return i*0.000621371192;
}


let sortSpotsByDistanceAway = (markerList) => {
  return markerList.sort(function(a, b) {
    return parseFloat(a.distanceAway) - parseFloat(b.distanceAway);
  });
}



export const addToFavourite = (id) => async (dispatch, getState) => {
  const { business } = getState();
  const { token } = await getUserData();
  const {  favouriteBusiness } = business.business;
  let addOrRemove = "";
  if(favouriteBusiness.map((business)=> business._id ).includes(id) )
    addOrRemove = "remove";
  else
    addOrRemove = "add";

  const body = {
    query:
    ` mutation{
        addToFavourites(id: "${id}", addOrRemove: "${addOrRemove}") {  
          _id
          category{
              title
              _id
              type
          }    
          name
          rating{
            fun,
            crowd,
            ratioInput,
            difficultyGettingIn,
            difficultyGettingDrink
          }
          name
          totalUserCountRating
          ageInterval
          customBusiness
          customData{
            address
            phoneNo
            rating
            opening_hours{
              periods{
                close{
                  day,
                  time
                },
                open{
                  day,
                  time
                }
              }
            }
          }
          location{
            type
            coordinates
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
            types,
            opening_hours{
              periods{
                close{
                  day,
                  time
                },
                open{
                  day,
                  time
                }
              }
            }
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
      type: getFavouritesBusiness,
      payload: res.data.data.addToFavourites
    })
    return Promise.resolve(addOrRemove);
  }catch(err){
    console.log("the err", err.response.data)
  }

}

export const selectSpecifcCategoryEstablishmentsAction  = (categoryId) => async(dispatch, getState) => {
  dispatch({
    type: selectSpecifcCategoryEstablishments,
    payload: categoryId
  })
  setTimeout(()=>{
    return Promise.resolve('ok');
  }, 500)
}

export const getFavouritesBusinessAction = () => async (dispatch, getState) => { 
  const { token } = await getUserData();
  const body = {
    query:
    ` 
      query{
        getFavouriteEstablishments 
          {  _id
            category{
              title
              _id
              type
            }    
            name
            rating{
              fun,
              crowd,
              ratioInput,
              difficultyGettingIn,
              difficultyGettingDrink
            }
            name
            totalUserCountRating
            ageInterval
            customBusiness
            customData{
              address
              phoneNo
              rating
              opening_hours{
                periods{
                  close{
                    day,
                    time
                  },
                  open{
                    day,
                    time
                  }
                }
              }
            }
            allRating{
              creationAt
              fun
              crowd
              ratioInput
              difficultyGettingIn
              difficultyGettingDrink
            }
            location{
              type
              coordinates
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
              opening_hours{
                periods{
                  close{
                    day,
                    time
                  },
                  open{
                    day,
                    time
                  }
                }
              }
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
      type: getFavouritesBusiness,
      payload: res.data.data.getFavouriteEstablishments
    })
  }catch(err){
    console.log("the err in fvrites", err.response)
  }


}

export const getSearchBusinesses = (searchValue) => async (dispatch, getState) => { 
    const body = {
      query:
      `query{
        searchByUser(searchValue: "${searchValue}")
         {   _id
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
            customData{
              address
              phoneNo
              rating
              opening_hours{
                periods{
                  close{
                    day,
                    time
                  },
                  open{
                    day,
                    time
                  }
                }
              }
            }
            allRating{
              creationAt
              fun
              crowd
              ratioInput
              difficultyGettingIn
              difficultyGettingDrink
            }
            uploadedPhotos{
              secure_url
            }
            location{
              type
              coordinates
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
              opening_hours{
                periods{
                  close{
                    day,
                    time
                  },
                  open{
                    day,
                    time
                  }
                }
              }
            }        
         }
         }

      `
    }
    try{  
      const res = await axios.post(`graphql?`,body);
      dispatch({
        type: Search_Results,
        payload: res.data.data.searchByUser,
      })
      return Promise.resolve(res.data.data.searchByUser);
    }catch(err){
      console.log("the err", err.response.data)
    }
}

export const getNearLocationBusiness = ({ latitude, longitude }, updatedRadius) => async (dispatch, getState) => {
  const { user } = getState();
  let { radius } = user.user.user;
  let finalRadius = updatedRadius ? updatedRadius : radius
  const { token } = await getUserData();
  
  // latitude = 32.7970465;
  // longitude = -117.254522;
  // finalRadius = 100000;
  
  const body = {
      query:`
      query{
        getNearByLocationBusiness(locationInput: { latitude: ${latitude.toFixed(5)}, longitude: ${longitude.toFixed(5)}, radius: ${finalRadius} }){
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
          difficultyGettingDrink,
          creationAt
        }
        totalUserCountRating
        ageInterval
        customData{
          address
          phoneNo
          rating
          opening_hours{
            periods{
              close{
                day,
                time
              },
              open{
                day,
                time
              }
            }
          }
        }
        allRating{
          creationAt
          fun
          crowd
          ratioInput
          difficultyGettingIn
          difficultyGettingDrink
        }
        uploadedPhotos{
          secure_url
        }
        location{
          type
          coordinates
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
          opening_hours{
            periods{
              close{
                day,
                time
              },
              open{
                day,
                time
              }
            }
          }
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
    console.log("fetch...", err.response)
  }
};

export const getAdminSettings = () => async (dispatch, getState) => {
  const getAdminData = await axios.get('/getdefaultSettings');
  dispatch({
    type: GET_ADMIN_SETTINGS,
    payload: getAdminData.data.settings,
  })
}

export const getfilteredBusiness = ( selectedMainCategory, search, favourite) => async (dispatch, getState) => {

  const { vibe, business, category, user } = getState();
  const data = business.business.businesses;
  const searchData = business.business.searchResults;
  const favouriteEstablishments = business.business.favouriteBusiness;
  const actualVibe = vibe.vibe.vibe;
  const allCategories = category.category.category;
  const favouriteEstablishmentCategory = business.business.selectedEstablishmentCategory
  
  let selectedCategory = []
  if(!search){  
    if(selectedMainCategory !== null)
      selectedCategory = allCategories.filter((category)=> selectedMainCategory.includes(category._id)).map((specificCategory)=> specificCategory._id)
    else{
      selectedCategory = allCategories.filter((category)=> actualVibe.selectedCategories.includes(category._id)).map((specificCategory)=> specificCategory._id)
    }
  }
  try{ 
    let filterCategoryBusinessVibe; 
    if(search)
      filterCategoryBusinessVibe = getSearchData(actualVibe, searchData, business.business.adminSettings)
    else if(favourite){
      let favouriteBusiness = favouriteEstablishments.filter((business)=> {
        return business.category.map(category=> category._id).includes(favouriteEstablishmentCategory)
      })
      filterCategoryBusinessVibe = getSearchData(actualVibe , favouriteBusiness, business.business.adminSettings)
    }
    else
      filterCategoryBusinessVibe = getAllCaseData(actualVibe , data, selectedCategory, business.business.adminSettings)
    const { allSpots } = filterCategoryBusinessVibe;
    let { latitude, longitude } = user.user.location;
    
    // For User Testing
    // latitude = 32.7970465;
    // longitude = -117.254522;
    
    var userLocation = { lat: latitude , lng: longitude }
    var destinationLocation = {};
    const markerList = allSpots.map((marker)=>{
      destinationLocation = { lat: marker.latitude , lng: marker.longitude }
      return {...marker, distanceAway:  getMiles(haversine(userLocation, destinationLocation)).toFixed(2)}
    })
  
    filterCategoryBusinessVibe.allSpots = sortSpotsByDistanceAway(markerList)
    filterCategoryBusinessVibe.isFavorite = favourite ? true : false
    dispatch({
      type: FILTERED_BUSINESS,
      payload: filterCategoryBusinessVibe,
    })
  
  }catch(err){
    console.log("in filtered", err)
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

export const updateSpecificBusinessRating = (data) => async (dispatch, getState) => {
  dispatch({
    type: Update_Rating,
    payload: data,
  })
}
