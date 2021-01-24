
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


export const getAllCaseData = (userVibeData, data, selectedCategory) => {
  let filterVibeCategoryData = {
    goodSpots: [],
    averageSpots: [],
    badSpots: []
  };
  let { vibeCategory } = userVibeData; 
  if(vibeCategory === "Professional Party Time"){
    data.map(business => {
     
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id) ) ){
        const { rating } = business;
        const {difficultyGettingIn, fun, crowd } = rating;
        console.log(` ${difficultyGettingIn} , ${fun} , ${crowd} `)
        if(crowd >= 4 && crowd <= 5 && difficultyGettingIn>=4 && fun>=3 ){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if( crowd >= 2 && crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<4 && fun>=2 && fun <3 ){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if( crowd >= 1 && crowd <= 2.0 && difficultyGettingIn<=2 && fun <= 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);

  }
  else if(vibeCategory === "Moderate Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){  
        const { rating} = business;
        const {difficultyGettingIn, fun } = rating
        
        if(rating.crowd >= 4 && rating.crowd <= 5 && difficultyGettingIn>=3 && fun>=3){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2.1 && rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3 && fun>=2 && fun <3){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >= 1 && rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 && fun < 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Social Drinking"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating} = business;
        const {difficultyGettingIn, fun } = rating
        if(rating.crowd >= 3 && rating.crowd <= 4 && difficultyGettingIn>=1 && difficultyGettingIn <= 2 && fun>=3 ){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2.1 && rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3 && fun>=2 && fun <3 ){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >= 1 && rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 && fun < 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Baby Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const {difficultyGettingIn} = rating
        if(rating.crowd <2 && difficultyGettingIn<2){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2 && rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >= 1 && rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 ){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else{
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        if(rating.crowd <=1){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >1 && rating.crowd<=2 ){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >=2.1 ){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }

}

export const getSearchData = (userVibeData, data, selectedBusinessIds) => {
  let filterVibeCategoryData = {
    goodSpots: [],
    averageSpots: [],
    badSpots: []
  };
  let { vibeCategory } = userVibeData; 

  if(vibeCategory === "Professional Party Time" ){
    data.map(business => {
      if( business.category.length !== 0 && selectedBusinessIds.includes(business._id)){
        const { rating } = business;
        const {difficultyGettingIn, fun } = rating
        if(rating.crowd >= 4 && rating.crowd <= 5 && difficultyGettingIn>=4 && fun>=3){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2.1 && business.rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<4 && fun>=2 && fun <3){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0 && difficultyGettingIn>=1 && difficultyGettingIn<2 && fun < 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Moderate Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const {difficultyGettingIn, fun } = rating
        if(rating.crowd >= 4 && rating.crowd <= 5 && difficultyGettingIn>=3 && fun>=3){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2.1 && business.rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3 && fun>=2 && fun <3){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(business.rating.crowd >= 1 && business.rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 && fun < 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Social Drinking"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const {difficultyGettingIn, fun } = rating
        if(rating.crowd >= 3 && rating.crowd <= 4 && difficultyGettingIn>=1 && difficultyGettingIn <= 2 && fun>=3 ){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2.1 && rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3 && fun>=2 && fun <3 ){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >= 1 && rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 && fun < 2){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else if(vibeCategory === "Baby Party Time"){
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        const {difficultyGettingIn } = rating
        if(rating.crowd <2 && difficultyGettingIn<2){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >= 2 && rating.crowd <= 3.9 && difficultyGettingIn>=2 &&  difficultyGettingIn<3){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >= 1 && rating.crowd <= 2.0 && difficultyGettingIn>=1 &&  difficultyGettingIn<2 ){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
  else{
    data.map(business => {
      if(business.category.length !== 0 && business.category.some(category =>  selectedCategory.includes(category._id)  ) ){
        const { rating } = business;
        if(rating.crowd <=1){
          filterVibeCategoryData.goodSpots.push(business)
        }
        else if(rating.crowd >1 && rating.crowd<=2 ){
          filterVibeCategoryData.averageSpots.push(business)
        }
        else if(rating.crowd >=2.1 ){
          filterVibeCategoryData.badSpots.push(business)
        }
      }
    })
    return getMapData(filterVibeCategoryData);
  }
}

const getMapData = (filterCategoryBusinessVibe)=> {

  const { goodSpots, badSpots, averageSpots } = filterCategoryBusinessVibe;

    const goodSpotMarkers = getSpotMapData(goodSpots);
    const badSpotMarkers = getSpotMapData(badSpots);
    const averageSpotMarkers = getSpotMapData(averageSpots);
    
    const filterBusinessData =  {
      goodSpots: goodSpotMarkers,
      badSpots: badSpotMarkers,
      averageSpots: averageSpotMarkers,
      allSpots: goodSpotMarkers.concat(averageSpotMarkers, badSpotMarkers)
    }
    
    return filterBusinessData;

}

const getSpotMapData = (spotsData) => {

  return spotsData.map((marker)=>{
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
      totalUserCountRating: marker.totalUserCountRating,
      businessGoogleRating: data.rating,
      address: data.address,
      phoneNo: data.phoneNo
    }
  });

}