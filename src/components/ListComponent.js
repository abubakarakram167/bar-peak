import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import Modal from './Modal';
import CategoryAddModal from './CategoryAddOrRemoveAlert';
import { addToFavourite, getfilteredBusiness } from '../../redux/actions/Business';
import { bindActionCreators } from 'redux';
import ShowVibeModal from "./showVibeModal";
import ToggleSwitch from '../components/ReUsable/Toggle';
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

class ListComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      renderList: [],
      currentPageNumber : 0,
      showProfileModal: false,
      showCategoryAddPopUp: false,
      message: '',
      totalCategoriesName: '',
      showVibeModal: false,
    }
  }

  componentDidMount(){

  }

  getKeyByValue = (object, value) => {
    return Object.keys(object).find(key => object[key] === value);
  }

  getColor = ({ markerId, types }) => {
    const { averageSpots, goodSpots, allSpots } = this.props.business;
    const { currentCategory } = this.props;
    let color = ''
    if( currentCategory === "food"  )
      color =  'black'
    else if(currentCategory === "food+drinks"  ){  
      if(types.includes("Restaurant") && ! (types.includes("Night Clubs") || types.includes("Bar") ) ) 
        color = "black"
      else{
        if(averageSpots.map(spot => spot.markerId).includes(markerId))
        color = '#f5ef56';
        else if(goodSpots.map(spot => spot.markerId).includes(markerId))
          color = '#0bb53e'
        else
          color = 'red' 
      }   
    }
    else{  
      if(types.includes("Restaurant") && ! (types.includes("Night Clubs") || types.includes("Bar") ) ) // For show black when on vibe.And not any option is selected.
        color = "black"
      else{   
        if(averageSpots.map(spot => spot.markerId).includes(markerId))
          color = '#f5ef56';
        else if(goodSpots.map(spot => spot.markerId).includes(markerId))
          color = '#0bb53e'
        else
          color = 'red'
      }   
    }
    return {
      backgroundColor: color
    }   
  }

  changePageNumber = (pageNumber) => {
    this.setState({ currentPageNumber: pageNumber })
  }

  selectSpecificBusiness = (marker) => {
    this.setState({showProfileModal: true, selectedBusiness: marker, selectedMarker: marker });
  }

  getMarkerCategoryName = (category) => {
    const types = category.types;
   
    if(types.includes("Restaurant") &&  (types.includes("Night Clubs") || types.includes("Bar") ) )
      return "food+drinks";
    else if(!types.includes("Restaurant") &&  (types.includes("Night Clubs") || types.includes("Bar") ) )
      return "only drinks";
    else
      return "only food";   

  }
  getCurrentCategorySelected = (categories, markerName) => {
    const { currentCategory } = this.state;

    if(currentCategory){
      if(currentCategory === "food"){
        if(categories.includes("Restaurant") ){
          if( (categories.includes("Night Clubs") || categories.includes("Bar") )  && !categories.includes("Restaurant") )
            return false
          return true 
        }
        return false;
      }
      else if(currentCategory === "drinks"){
        if(categories.includes("Night Clubs") || categories.includes("Bar") ){
          if( !(categories.includes("Night Clubs") || categories.includes("Bar") )  && categories.includes("Restaurant") )
            return false
          return true 
        }
        return false;  
      }    
      else{
        if((categories.includes("Night Clubs") || categories.includes("Bar") )  && categories.includes("Restaurant") )
          return true
        return false 
      } 
        
    }
    else 
      return true
  }

  addToFavourite = async() => {
    const { category } = this.props;
    const { allSpots } = this.props.business
    const selectedMarker = this.state.selectedMarker? this.state.selectedMarker: allSpots[0];
    const addOrRemove = await this.props.addToFavourite(selectedMarker.markerId);
    let TotalCategoriesName = category.filter(category => {
      return selectedMarker.types.includes(category.title) && category.type === "main_category"
    }).map(category => category.title)
    let totalMessage = addOrRemove.toUpperCase() + " to " + TotalCategoriesName.map(name => name + " ")
    this.setState({ showCategoryAddPopUp: true , totalCategoriesName: totalMessage }, ()=>{
      setTimeout(()=>{ 
        this.setState({ showCategoryAddPopUp: false })
      }, 5000)
    })
  }

  getOnlyCurrentCategoryList = (allSpots) => {
    const { currentCategory } = this.props;
    let specificSpots;

    if(currentCategory){
      if(currentCategory === "food"){
        specificSpots = allSpots && allSpots.filter((spot)=> {
          let { types } = spot;
          if(types.includes("Restaurant")) {
            if( (types.includes("Night Clubs") || types.includes("Bar") )  && !types.includes("Restaurant") )
              return false
            return true 
          }
          else 
           return false     
        }) 
      }   
      else if(currentCategory === "drinks"){
        specificSpots = allSpots && allSpots.filter((spot)=> {
          let { types } = spot;
          if(types.includes("Night Clubs") || types.includes("Bar") ){
            if( !(types.includes("Night Clubs") || types.includes("Bar") )  && types.includes("Restaurant") )
              return false
            return true 
          }
          return false;     
        }) 
      }           
      else{
        specificSpots = allSpots && allSpots.filter((spot)=> {
          let { types } = spot;
          if((types.includes("Night Clubs") || types.includes("Bar") )  && types.includes("Restaurant") )
            return true
          return false 
        })
      } 
    }
    else 
      specificSpots = allSpots
    
    return specificSpots  
  }

  getCurrentItemsPerPage = () => {
    const { allSpots } = this.props.business;
    return this.getOnlyCurrentCategoryList(allSpots) && this.getOnlyCurrentCategoryList(allSpots).length
  }

  isEstablishmentClosed = (marker) => {
    const { openingHours } = marker;
    var defaultTime = false;
    let restaurantOpen = true;
    const todayDate = moment().format('dddd YYYY-MM-DD HH:mm').split(' ');
    const todayDayName = todayDate[0].toLowerCase();
    let myCurrentTime = parseInt(todayDate[2].toString().replaceAll(':',''));
    
    const specifcDayTimings = openingHours ? openingHours.periods.filter(day => {
      if(day.open.day === this.getKeyByValue(weekDays, todayDayName))
        return true 
    }): null
    let originalTimeOrDefaultTime;
    if(specifcDayTimings && specifcDayTimings.length > 0){
      originalTimeOrDefaultTime = specifcDayTimings[0]
    }
    else{
      defaultTime = true;
      originalTimeOrDefaultTime = {
        close: {
          day: parseInt(this.getKeyByValue(weekDays, todayDayName) + 1) .toString(),
          time:  "0200"
        },
        open: {
          day: this.getKeyByValue(weekDays, todayDayName).toString(),
          time:  "1100"
        }
      }
    }
    
    const openTime = parseInt(originalTimeOrDefaultTime.open.time);
    const closeTime = parseInt(originalTimeOrDefaultTime.close.time);
    const openDay = parseInt(originalTimeOrDefaultTime.open.day);
    const closeDay = parseInt(originalTimeOrDefaultTime.close.day);
    const myCurrentDay = parseInt(this.getKeyByValue(weekDays, todayDayName));
    // console.log(` openTime: ${openTime} , closeTime: ${closeTime} , openDay: ${openDay}, closeDay: ${closeDay}, myCurrentDay: ${myCurrentDay}, my CureentTime: ${myCurrentTime} `)

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
    return restaurantOpen
  }


  render(){
    const { allSpots, isFavorite } = this.props.business;
   
    const { navigation } = this.props;
    const pagesPerList = 30;
    return(
      <View style={styles.container}>
        <View style = {{ flex: 1, flexDirection: 'column' }} >
          <View style = {{ flex: 1, flexDirection: 'row' }} >
            <View
              style = {{ flex: 3, marginTop: 20, marginLeft: 20 }}
            >
              <Text  
                style = {{ fontSize: 22, fontWeight: '500' }}
              >
                { isFavorite ? " Favorite Spots " : "Nearby Spots"}
              </Text> 
            </View>
            <View
              style = {{ flex: 2 }}
            >
              <ToggleSwitch
                isActiveToggle = {this.props.isActiveToggle} 
                onChange = {(toggle)=> {
                  this.props.onChangeToggle(toggle)  
                }}
              />
               <Text 
                style = {{ fontSize: 10, fontWeight: '600',width: '60%',alignSelf: 'center', textAlign: 'center' }} 
              >
              { this.props.isActiveToggle ? "All Venues" : "Venue by Vibe" } 
            </Text>
            </View>
            <View
              style = {{ flex: 2 }}
            >
              <View
                style={{
                  alignSelf: 'flex-end' //for align to right
                }}
              >
                <TouchableOpacity
                  style = {styles.setVibeButton}
                  onPress = {()=> navigation.navigate('vibeTabNavigator')}
                >
                  <Text
                    style = {styles.setVibeButtonText}
                  >
                    SET VIBE
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style = {{ flex: 6 }}>
            <View style = {{ flexDirection: 'row',justifyContent: 'flex-end', flex:1 }} >
              <Text style = {styles.column} >Showing { this.state.currentPageNumber * pagesPerList  + 1 } - {this.getCurrentItemsPerPage()} </Text> 
              <Text style = {styles.column} >Type</Text>
              <Text style = {styles.column} >Distance Away</Text>
            </View>
            { this.state.showProfileModal && 
              ( <Modal 
                  businessData = {this.state.selectedMarker ? this.state.selectedMarker : allSpots[0]} 
                  currentView = {this.state.currentView} 
                  show = {this.state.showProfileModal} 
                  closeModal = {()=> { this.setState({ showProfileModal: false }) }}
                  addToFavourites = {()=> this.addToFavourite()} 
                /> 
              ) 
            } 
            <View style = {{ flex:10, borderWidth: 0 }} >
              <ScrollView  >
                {   allSpots && 
                    this.getOnlyCurrentCategoryList(allSpots)
                    .slice(this.state.currentPageNumber * pagesPerList, this.state.currentPageNumber * pagesPerList + pagesPerList)
                    .map((marker, index)=>{
                    if( this.getCurrentCategorySelected(marker.types, marker.name) ){
                      return(
                        <TouchableOpacity
                          onPress = {()=>{ 
                            if(!this.isEstablishmentClosed(marker))
                              this.props.onShowClosePopUp(marker)
                            else
                              this.selectSpecificBusiness(marker)      
                          }}
                        >
                          <View key = {index} style = { styles.listElement } >
                            <View 
                              style = {[
                                styles.listIcon, 
                                this.isEstablishmentClosed(marker) ? this.getColor(marker) : { backgroundColor: 'gray' } 
                              ]} 
                            >
                            </View>
                            <View style = {{ flex:1 }}>
                              <Text
                                style = {styles.listElementName}
                              >
                                { marker.name }
                              </Text>
                            </View>
                            <View style = {{ flex:1 }}>
                              <Text
                                style = {styles.listElementName}
                              >
                                { this.getMarkerCategoryName(marker) }
                              </Text>
                            </View>
                            <View style = {{ flex:1 }}>
                              <Text>
                                { marker.distanceAway + " " }
                                <Text style = {{ fontWeight: '400' }} >miles</Text>
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>  
                      ) 
                    }
                    else
                      return null; 
                  }) 
                }
              </ScrollView>   
            </View>
            <CategoryAddModal  
              show = {this.state.showCategoryAddPopUp} 
              message = {this.state.totalCategoriesName} 
            />
            <ShowVibeModal 
              show = {this.state.showVibeModal} 
              onClose = {()=> { this.setState({ showVibeModal: false }) }}
              navigation = {navigation} 
            /> 
            <View
              style = {{ flex: 1, flexDirection: 'row', position: 'relative', left: 50}} 
            >
            
                <View
                  style= {{ flex: 1, borderWidth: 0 }}
                > 
                  { this.state.currentPageNumber >0  &&    
                    (<TouchableOpacity
                      style = {styles.paginationButton}
                      onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber - 1) }}
                    >
                      <Text
                        style = {{ fontWeight: '700' }}
                      >
                        Previous Page
                      </Text>
                    </TouchableOpacity> )
                  }                
                </View>
              
              
                <View style = {{ flex: 1}} >
                { allSpots && this.getOnlyCurrentCategoryList(allSpots).slice(this.state.currentPageNumber * pagesPerList ).length > pagesPerList &&
                  <TouchableOpacity
                    style = {[styles.paginationButton, { marginRight: 30 }]}
                    onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber + 1) }}
                  >
                    <Text
                      style = {{ 
                        fontWeight: '700' 
                      }}
                    >
                      Next Page
                    </Text>
                  </TouchableOpacity>
                } 
                </View>
              
            </View>
          </View>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  column: { 
    fontSize: 14,
    fontWeight: '700',
    marginRight: 35,
    textAlign: 'right'
  },
  paginationButton: { 
    marginTop: 10,
    marginBottom: 5,
    marginRight: 10 
  },
  container: {
    flex: 14,
    flexDirection: 'row',
    backgroundColor: '#f5f5f5'
  },
  listElement:{
    flex:1,
    flexDirection: 'row',
    marginTop: 20 
  },
  listElementName:{ 
    fontSize: 13, 
    marginLeft: 20,
    width: '70%',
    color: 'gray',
    fontWeight: '500'
  },
  listIcon:{ 
    width: 25,
    marginLeft: 20,
    height: 20 
  },
  setVibeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '600' 
  },
  setVibeButton: {
    backgroundColor: '#1b76de',
    padding: 10,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    marginRight: 20,
    width: 60,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#043c7d'
  }
});

const mapStateToProps = (state) => {
  const { business, user, category } = state
  return { 
    business: business.business.filterBusinesses,
    location: user.user.location,
    category: category.category.category
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addToFavourite,
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);