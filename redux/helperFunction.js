import moment from 'moment';

const weekDays = {
  0: "sunday",
  1: "monday",
  2: "tuesday",
  3: "wednesday",
  4: "thursday",
  5: "friday",
  6: "saturday",
}

export const  getSelectedCategories = (barOrNightClub) => {
  const { category } = this.props.category.category;
  let selectedCategory;

  if(barOrNightClub === "nightClub"){
    selectedCategory = category.filter(category => category.title === 'Night Clubs')
  }
  else{
    const barCategories = this.state.question3;
    selectedCategory = category.filter((category)=>  barCategories.includes(category._id) )
  }
  return selectedCategory.map(category => category._id)
}

export const getAllCaseData = (userVibeData, data, selectedCategory, settings) => {
  let filterVibeCategoryData = {
    goodSpots: [],
    averageSpots: [],
    badSpots: [],
    settings: {}
  };
  filterVibeCategoryData.settings = settings;
  let { vibeCategory } = userVibeData; 
  if(vibeCategory === "Professional Party Time"){
    data.map(business => {    
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id) ) ){
        const { rating } = business;
        const {difficultyGettingIn, fun, crowd } = rating;
       
        if( crowd >= 4 && crowd <= 5 && difficultyGettingIn>=4 && fun>=3)
          filterVibeCategoryData.goodSpots.push(business)
      
        else if( crowd <= 2 &&  difficultyGettingIn<=2 && fun <= 2)
          filterVibeCategoryData.badSpots.push(business)
        
        else 
          filterVibeCategoryData.averageSpots.push(business)  
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Moderate Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){  
        const { rating} = business;
        const {difficultyGettingIn, fun, crowd } = rating
        
        if(crowd >= 4 && crowd <= 5 && difficultyGettingIn>=3 && fun>=3)
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd <= 2 && difficultyGettingIn<=2 && fun <= 2)
          filterVibeCategoryData.badSpots.push(business)
        else
          filterVibeCategoryData.averageSpots.push(business)
        
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Social Drinking"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating} = business;
        const {difficultyGettingIn, fun, crowd } = rating
        
        if(crowd >= 3 && crowd <= 4 && difficultyGettingIn <= 2 && fun>=3 )
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd <= 2 && difficultyGettingIn>=4 && fun <3)
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Baby Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const {difficultyGettingIn, crowd} = rating
        if(crowd <=2 && difficultyGettingIn<=2)
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd >= 3 && difficultyGettingIn>=3 )
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else{
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const { crowd, difficultyGettingIn } = rating;

        if(crowd <=1 && difficultyGettingIn <= 1 )
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd >=3 && difficultyGettingIn >= 4 )
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }

}

export const getSearchData = (userVibeData, searchData, settings) => {
  let filterVibeCategoryData = {
    goodSpots: [],
    averageSpots: [],
    badSpots: [],
    settings: {}
  };
  let { vibeCategory } = userVibeData; 
  filterVibeCategoryData.settings = settings;
  if( vibeCategory === "Professional Party Time" ){
    searchData.map(business => {
      if( business.category.length !== 0 ){
        const { rating } = business;
        const {difficultyGettingIn, fun, crowd } = rating
        if( crowd >= 4 && crowd <= 5 && difficultyGettingIn>=4 && fun>=3)
          filterVibeCategoryData.goodSpots.push(business)
        else if( crowd <= 2 &&  difficultyGettingIn<=2 && fun <= 2)
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)    
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Moderate Party Time"){
    searchData.map(business => {
      if(business.category.length !== 0 ){
        const { rating } = business;
        const {difficultyGettingIn, fun, crowd } = rating
        if(crowd >= 4 && crowd <= 5 && difficultyGettingIn>=3 && fun>=3)
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd <= 2 && difficultyGettingIn<=2 && fun <= 2)
          filterVibeCategoryData.badSpots.push(business)
        else
          filterVibeCategoryData.averageSpots.push(business)
        
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Social Drinking"){
    searchData.map(business => {
      if(business.category.length !== 0 ){
        const { rating } = business;
        const {difficultyGettingIn, fun, crowd } = rating
        if(crowd >= 3 && crowd <= 4 && difficultyGettingIn <= 2 && fun>=3 )
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd <= 2 && difficultyGettingIn>=4 && fun <3)
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Baby Party Time"){
    searchData.map(business => {
      if(business.category.length !== 0 ){
        const { rating } = business;
        const { difficultyGettingIn, crowd } = rating
        if(crowd <=2 && difficultyGettingIn<=2)
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd >= 3 && difficultyGettingIn>=3 )
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else{
    searchData.map(business => {
      if(business.category.length !== 0 ){
        const { rating } = business;
        const { crowd, difficultyGettingIn } = rating;
        if(crowd <=1 && difficultyGettingIn <= 1 )
          filterVibeCategoryData.goodSpots.push(business)
        else if(crowd >=3 && difficultyGettingIn >= 4 )
          filterVibeCategoryData.badSpots.push(business)
        else 
          filterVibeCategoryData.averageSpots.push(business)
      }
    })
    return getMapData(filterVibeCategoryData);
  }
}

const getMapData = (filterCategoryBusinessVibe)=> {

  const { goodSpots, badSpots, averageSpots, settings } = filterCategoryBusinessVibe;

    const goodSpotMarkers = getSpotMapData(goodSpots, settings);
    const badSpotMarkers = getSpotMapData(badSpots, settings);
    const averageSpotMarkers = getSpotMapData(averageSpots, settings);
    
    const filterBusinessData =  {
      goodSpots: goodSpotMarkers,
      badSpots: badSpotMarkers,
      averageSpots: averageSpotMarkers,
      allSpots: goodSpotMarkers.concat(averageSpotMarkers, badSpotMarkers)
    }
    
    return filterBusinessData;

}
const getKeyByValue = (object, value) => {
  return Object.keys(object).find(key => object[key] === value);
}

const getEstablishmentOpeningHours = (marker) => {
  const openingHours  = marker.googleBusiness.opening_hours;
  var defaultTime = false;
  let restaurantOpen = true;
  const todayDate = moment().format('dddd YYYY-MM-DD HH:mm').split(' ');
  const todayDayName = todayDate[0].toLowerCase();
  let myCurrentTime = parseInt(todayDate[2].toString().replaceAll(':',''));
  
  const specifcDayTimings = openingHours ? openingHours.periods.filter(day => {
    if(day.open.day === getKeyByValue(weekDays, todayDayName))
      return true 
  }): null
  let originalTimeOrDefaultTime;
  if(specifcDayTimings && specifcDayTimings.length > 0)
    originalTimeOrDefaultTime = specifcDayTimings[0]
  else{
    defaultTime = true;
    originalTimeOrDefaultTime = {
      close: {
        day: parseInt(getKeyByValue(weekDays, todayDayName) + 1) .toString(),
        time:  "0200"
      },
      open: {
        day: getKeyByValue(weekDays, todayDayName).toString(),
        time:  "1100"
      }
    }
  }
  
  const openTime = parseInt(originalTimeOrDefaultTime.open.time);
  const closeTime = parseInt(originalTimeOrDefaultTime.close.time);
  const openDay = parseInt(originalTimeOrDefaultTime.open.day);
  const closeDay = parseInt(originalTimeOrDefaultTime.close.day);
  const myCurrentDay = parseInt(getKeyByValue(weekDays, todayDayName));
  //console.log(` name: ${marker.name} openTime: ${openTime} , closeTime: ${closeTime} , openDay: ${openDay}, closeDay: ${closeDay}, myCurrentDay: ${myCurrentDay}, my CureentTime: ${myCurrentTime} `)

  if(myCurrentDay === closeDay){
    if(myCurrentTime>openTime && myCurrentTime < closeTime)
      restaurantOpen = true
    else  
      restaurantOpen = false
  }
  else{
    if(myCurrentTime <= closeTime)
      restaurantOpen = true
    else  
      restaurantOpen = false
  }
  return { 
    restaurantOpen, 
    openingTime: restaurantOpen ? openTime : null 
  }
}

const changeToDefaultEstablishment = (marker, settings) => {
  const getOpeningHours = getEstablishmentOpeningHours(marker);
  const { allRating } = marker;

  // console.log("the marker.......", marker)
  // console.log("the rating", allRating)
  // console.log("the closedd", getOpeningHours.restaurantOpen)
  // console.log("the setting final", settings)

  if(allRating.length>0 ){
    if(!getOpeningHours.restaurantOpen)
      return false
    else{ 
      const openingTime = getOpeningHours.openingTime.toString()
      let completeOpeningTime;
      if(openingTime.length === 3){
        completeOpeningTime = openingTime.split('')
        completeOpeningTime.splice( 1, 0, ':' )
      }
      else{
        completeOpeningTime = openingTime.split('')
        completeOpeningTime.splice( 2, 0, ':' )
      }
      const restaurantOpenTime = moment().format("YYYY-MM-DD") + " " + completeOpeningTime.toString().split(',').join("")
      console.log("the all Rating", allRating)
      const establishmentRating = allRating.map(rating => {
        return {
          creationAt: rating.creationAt,
          
        }
      });
      const totalCounts = establishmentRating.filter(ratingTime => {
        console.log(`the rating time ${moment(ratingTime).format("YYYY-MM-DD HH:mm").toString()} and restaurantOpenTime ${restaurantOpenTime} `)
        if(moment(ratingTime).format("YYYY-MM-DD HH:mm").toString()  > restaurantOpenTime)
          return true
      }).length

      console.log("the total counts", totalCounts)
      const isDefault = totalCounts <= settings.noOfUsersUntilShowDefault ? true : false
      let accumulatedAverageRatingPerDay = {
        fun: 0,
        crowd: 0,
        genderBreakdown: 0,
        difficultyGettingIn: 0,
        difficultyGettingDrink: 0,
        totalRatings: 0
      }
      if(isDefault){
        const establishmentRating = allRating.map(rating => {
          return {
            ratingTime: rating.creationAt,
            fun: rating.fun,
            crowd: rating.crowd,
            genderBreakdown: rating.ratioInput,
            difficultyGettingIn: rating.difficultyGettingIn,
            difficultyGettingDrink: rating.difficultyGettingDrink,
          }
        });
        const totalEstablishments = establishmentRating.filter(rating => {
          console.log(`the rating time ${moment(rating.ratingTime).format("YYYY-MM-DD HH:mm").toString()} and restaurantOpenTime ${restaurantOpenTime} `)
          if(moment(rating.ratingTime).format("YYYY-MM-DD HH:mm").toString()  > restaurantOpenTime)
            return true
        })
        var totalEstablishmentsCount = totalEstablishments.length;
        for (let rating of establishmentRating){
          accumulatedAverageRatingPerDay.fun = rating.fun + accumulatedAverageRatingPerDay.fun
          accumulatedAverageRatingPerDay.difficultyGettingIn = rating.difficultyGettingIn + accumulatedAverageRatingPerDay.difficultyGettingIn
          accumulatedAverageRatingPerDay.difficultyGettingDrink = rating.difficultyGettingDrink + accumulatedAverageRatingPerDay.difficultyGettingDrink
          accumulatedAverageRatingPerDay.genderBreakdown = rating.genderBreakdown + accumulatedAverageRatingPerDay.genderBreakdown
          accumulatedAverageRatingPerDay.crowd = rating.crowd + accumulatedAverageRatingPerDay.crowd
        }
      }

      return {
        isDefault,
        accumulatedAverageRatingPerDay: {
          fun : accumulatedAverageRatingPerDay.fun/totalEstablishmentsCount,
          difficultyGettingIn : accumulatedAverageRatingPerDay.difficultyGettingIn/totalEstablishmentsCount,
          difficultyGettingDrink : accumulatedAverageRatingPerDay.difficultyGettingDrink/totalEstablishmentsCount,
          genderBreakdown : accumulatedAverageRatingPerDay.genderBreakdown/totalEstablishmentsCount,
          crowd : accumulatedAverageRatingPerDay.crowd/totalEstablishmentsCount
        }
      }
    }
  }
  else 
    return true
}

const getSpotMapData = (spotsData, settings) => {
  return spotsData.map((marker)=>{
    const {googleBusiness, customData} = marker
    const data = {
      address: googleBusiness ? googleBusiness.formatted_address : customData.address,
      phoneNo: googleBusiness ? googleBusiness.formatted_phone_number : customData.phoneNo,
      rating: googleBusiness ? googleBusiness.rating : customData.rating
    }

    const getDefaultSettings = changeToDefaultEstablishment(marker, settings); 

    return {
      markerId: marker._id,
      longitude: marker.location.coordinates[0],
      latitude: marker.location.coordinates[1],
      images:  marker.uploadedPhotos.length > 0 ? marker.uploadedPhotos: null,
      rating: marker.rating,
      types: marker.category.map((category)=> category.title ),
      name: marker.name,
      totalUserCountRating: marker.totalUserCountRating,
      businessGoogleRating: data.rating,
      address: data.address,
      phoneNo: data.phoneNo,
      location: marker.location.coordinates,
      mapUrl: googleBusiness ? googleBusiness.url : null,
      openingHours: marker.googleBusiness.opening_hours,
      isDefaultEstablishment: getDefaultSettings.isDefault   
    }
  });
}