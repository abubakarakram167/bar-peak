import {Near_Location_Business, FILTERED_BUSINESS, Empty_Business, ADD_Rating, Search_Results, getFavouritesBusiness, selectSpecifcCategoryEstablishments , add_Favourite} from '../types'; 
import { graphql, stripIgnoredCharacters } from 'graphql';
import axios from '../../src/api/axios';
import { getUserData } from '../../src/components/localStorage'; 
import Category from '../reducers/Category';
import haversine from 'haversine-distance'

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
          ratioType
          customBusiness
          customData{
            address
            phoneNo
            rating
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
            ratioType
            customBusiness
            customData{
              address
              phoneNo
              rating
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
    console.log("the err", err)
  }


}

export const getSearchBusinesses = (searchValue) => async (dispatch, getState) => { 
    const body = {
      query:
    ` query{
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
            ratioType
            customData{
              address
              phoneNo
              rating
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
      console.log("the err", err)
    }
}

export const getNearLocationBusiness = ({ latitude, longitude }) => async (dispatch, getState) => {
  const { user } = getState();
  let { radius } = user.user.user;
  const { token } = await getUserData();

  latitude = 32.7970465;
  longitude = -117.254522;
  radius = 100000;

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
    if(selectedMainCategory !== null){
      selectedCategory = allCategories.filter((category)=> selectedMainCategory.includes(category._id)).map((specificCategory)=> specificCategory._id)
    }
    else{
      if(actualVibe.nightLife)
        selectedCategory = allCategories.filter((category)=> category.title === "Night Clubs" ).map((specificCategory)=> specificCategory._id)
      else
        selectedCategory = allCategories.filter((category)=> category.title === actualVibe.barType ).map((specificCategory)=> specificCategory._id)
    }
  }
  
  // console.log("the selected category", selectedCategory);
    
  try{ 
    
    let filterCategoryBusinessVibe = {
      goodSpots: [],
      averageSpots: [],
      badSpots: []
    };

    if(search){
      searchData.map(business => {
        if( business.ageInterval === actualVibe.ageInterval  ){
          const { rating } = business;
          if(actualVibe.crowdedPlace){
            if(rating.crowd >= 4 && rating.crowd <= 5){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }
          else{
            if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(business.rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 4 && business.rating.crowd <= 5){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }   
        }
      })
    }
    else if(favourite){
      favouriteEstablishments.filter((business)=> {
        return business.category.map(category=> category._id).includes(favouriteEstablishmentCategory)
      }).map(business => {
        if( business.ageInterval === actualVibe.ageInterval  ){
          const { rating } = business;
          if(actualVibe.crowdedPlace){
            if(rating.crowd >= 4 && rating.crowd <= 5){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }
          else{
            if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(business.rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 4 && business.rating.crowd <= 5){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }   
        }
      })
    }
    else{
      data.map(business => {
        if( business.ageInterval === actualVibe.ageInterval && business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
          const { rating } = business;
          if(actualVibe.crowdedPlace){
            if(rating.crowd >= 4 && rating.crowd <= 5){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }
          else{
            if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0){
              filterCategoryBusinessVibe.goodSpots.push(business)
            }
            else if(business.rating.crowd >= 2.1 && business.rating.crowd <= 3.9){
              filterCategoryBusinessVibe.averageSpots.push(business)
            }
            else if(business.rating.crowd >= 4 && business.rating.crowd <= 5){
              filterCategoryBusinessVibe.badSpots.push(business)
            }
          }   
        }
      })
    }

    const { goodSpots, badSpots, averageSpots } = filterCategoryBusinessVibe;

    const goodSpotMarkers = goodSpots.map((marker)=>{
      const {googleBusiness, customData} = marker
      const data = {
        address: googleBusiness ? googleBusiness.formatted_address : customData.address,
        phoneNo: googleBusiness ? googleBusiness.formatted_phone_number : customData.phoneNo,
        rating: googleBusiness ? googleBusiness.rating : customData.rating
      }
      return {
        markerId: marker._id,
        longitude: marker.location.coordinates[0],
        latitude: marker.location.coordinates[1],
        images:  marker.uploadedPhotos.length > 0 ? marker.uploadedPhotos: null,
        rating: marker.rating,
        types: marker.category.map((category)=> category.title ),
        name: marker.name,
        businessGoogleRating: data.rating,
        address: data.address,
        phoneNo: data.phoneNo
      }
    });

    

    const averageSpotMarkers = averageSpots.map((marker)=>{
      const {googleBusiness, customData} = marker
      const data = {
        address: googleBusiness ? googleBusiness.formatted_address : customData.address,
        phoneNo: googleBusiness ? googleBusiness.formatted_phone_number : customData.phoneNo,
        rating: googleBusiness ? googleBusiness.rating : customData.rating
      }
      return {
        markerId: marker._id,
        longitude: marker.location.coordinates[0],
        latitude: marker.location.coordinates[1],
        images:  marker.uploadedPhotos.length > 0 ? marker.uploadedPhotos: null,
        rating: marker.rating,
        types: marker.category.map((category)=> category.title ),
        name: marker.name,
        businessGoogleRating: data.rating,
        address: data.address,
        phoneNo: data.phoneNo
      }
    });

    const badSpotMarkers = badSpots.map((marker)=>{
      const {googleBusiness, customData} = marker
      const data = {
        address: googleBusiness ? googleBusiness.formatted_address : customData.address,
        phoneNo: googleBusiness ? googleBusiness.formatted_phone_number : customData.phoneNo,
        rating: googleBusiness ? googleBusiness.rating : customData.rating
      }
      return {
        markerId: marker._id,
        longitude: marker.location.coordinates[0],
        latitude: marker.location.coordinates[1],
        images:  marker.uploadedPhotos.length > 0 ? marker.uploadedPhotos: null,
        rating: marker.rating,
        types: marker.category.map((category)=> category.title ),
        name: marker.name,
        businessGoogleRating: data.rating,
        address: data.address,
        phoneNo: data.phoneNo
      }
    });
    
    const filterBusinessData =  {
      goodSpots: goodSpotMarkers,
      badSpots: badSpotMarkers,
      averageSpots: averageSpotMarkers,
      allSpots: goodSpotMarkers.concat(averageSpotMarkers, badSpotMarkers)
    }
    
    const { allSpots } = filterBusinessData;
    // let { latitude, longitude } = user.user.user;
    var latitude = 32.7970465;
    var longitude = -117.254522;
    var userLocation = { lat: latitude.toFixed(5) , lng: longitude.toFixed(5) }
    var destinationLocation = {};
    const markerList = allSpots.map((marker)=>{
      destinationLocation = { lat: marker.latitude.toFixed(5) , lng: marker.longitude.toFixed(5) }
      return {...marker, distanceAway:  getMiles(haversine(userLocation, destinationLocation)).toFixed(2)}
    })
  
    filterBusinessData.allSpots = sortSpotsByDistanceAway(markerList)

    dispatch({
      type: FILTERED_BUSINESS,
      payload: filterBusinessData,
    })
  
  }catch(err){
    console.log("hte errorsss", err)
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
