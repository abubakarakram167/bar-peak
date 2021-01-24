import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { View, Text, Dimensions, Animated,Image, TouchableOpacity, TextInput} from 'react-native';
import CustomMapData from './CustomMapData';
import {getfilteredBusiness, getSearchBusinesses, addToFavourite } from '../../redux/actions/Business';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StarRating from 'react-native-star-rating'
import Modal from './Modal';
import ProfileModalIcon from 'react-native-vector-icons/Ionicons'
import { Icon } from 'react-native-elements';
import ListComponent from './ListComponent';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import ShowVibeModal from "./showVibeModal";
import CategoryAddModal from './CategoryAddOrRemoveAlert';
import styles from './CSS/MapComponent';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT + 50;

class MapScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      goodSpotMarkers:[],
      badSpotMarkers:[],
      averageSpotMarkers: [],
      allMarkers: [],
      selectedMarker: null,
      showProfileModal: false,
      selectedItem: {},
      selectedBusiness: {},
      currentView: 'map',
      currentCategory: null,
      searchValue: '',
      showCard: true,
      spinner: false,
      showVibeModal: false,
      showCategoryAddPopUp: false,
      totalCategoriesName: ''
    }
  }

  renderDollar = (priceLevel) => {
    let dollar = '';
    for(let i=0 ; i< priceLevel; i++){
      dollar = dollar + '$'; 
    }
    return dollar;
  }

  selectSpecificBusiness = () => {
    const { filterBusinesses } = this.props.business.business;
    const { allSpots } = filterBusinesses;
    const marker = this.state.selectedMarker ? this.state.selectedMarker : allSpots[0]
    this.setState({showProfileModal: true, selectedBusiness: marker });
  }


  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  markerClick = (marker) => {
    this.setState({ selectedMarker: marker, showCard: true })
  }

  showSpecificCategoryMarkers = (category) => {
    this.setState({ currentCategory: category }, ()=>{
    if(this.state.currentCategory){  
      let categories  = [];
      let allCategories = this.props.category;
      if(category === 'food'){
        categories = allCategories.filter((category)=>{
        return category.title === "Restaurant"
        }).map((category) => category._id)
      }
      else if(category === 'drinks'){
        categories = allCategories.filter((category)=>{
          return ["Night Clubs", "Bar"].includes(category.title)
        }).map((category) => category._id)
      }
      else if(category === 'food+drinks'){
        categories = allCategories.filter((category)=>{
          return category.type === "main_category"
        }).map((category) => category._id)
      }
      this.props.getfilteredBusiness(categories, null, null);
    }
    else
      this.props.getfilteredBusiness(null, null, null);
    })
  }

  getSearchResults = async() => {
    this.setState({ spinner: true })
    await this.props.getSearchBusinesses(this.state.searchValue)
    await this.props.getfilteredBusiness(null,'search', null)
    return; 
  }

  getImagePath = (types, whichSpot) => {
    let fileName = '';
    if(this.state.currentCategory === "food"){
      return  require('../../assets/FoodBlackTransparent.png')
    }
    else{
      if(types.includes("Night Clubs") || types.includes("Bar")  ){
        if(whichSpot === 'red')
          return require('../../assets/redWhite.png')
        else if(whichSpot === 'green')
          return  require('../../assets/greenWhite.png')
        else
          return  require('../../assets/yellowTest.png')
      }
      else if(types.includes("Restaurant")){
        if(whichSpot === 'red')
          return  require('../../assets/redTransparent.png')
        else if(whichSpot === 'green')
          return  require('../../assets/greenTransparent.png')
        else
          return  require('../../assets/yellowTransparent.png')
      } 
    }
  }

  getFavouriteEstablishmentColor = (marker) => {
    const { favouriteBusiness } = this.props.business.business;
    const allEstablishmentIds = favouriteBusiness.map(business => business._id)
    if(allEstablishmentIds.includes(marker))
      return "red"
    else
      return "gray";
  }

  addToFavourite = async() => {
    const { category } = this.props;
    const { allSpots } = this.props.business.business.filterBusinesses;
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

  render(){
    const { filterBusinesses } = this.props.business.business;
    const { goodSpots, averageSpots, badSpots, allSpots } = filterBusinesses;
    const vibe = this.props.vibe;
    const {navigation, user} = this.props;
    const { location } = user.user;
    console.log("the location", location)
    return(
      <View style={styles.container}>
        <View 
          style={styles.searchBar}
        >
          <ProfileModalIcon name="ios-beer" size={20} style={{ color: 'green',flex: 1, textAlign: 'right', marginRight: 10 }} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Search For a Spot?"
            placeholderTextColor="black"
            style={styles.searchBarInput}
            onChangeText = {(text)=> {
              if(text.length === 0 )
                this.showSpecificCategoryMarkers(this.state.currentCategory)
              this.setState({ searchValue: text })
            }}
           
          />
          <TouchableOpacity
            onPress = {async()=>{ 
              await this.getSearchResults()
              this.setState({ spinner: false, currentView: "list" })
            }}
          >
            <ProfileModalIcon
              name="ios-search" 
              size={20} 
              style={{ 
                color: 'green',
                flex: 1, 
                textAlign: 'right', 
                marginRight: 10 
              }}
            />
          </TouchableOpacity>
          
        </View>
        <View
          style = {{ flex: 1, flexDirection: 'row' }}
        >
          <View style = {{ marginLeft: 3, flex:3, flexDirection: 'row', alignItems: 'flex-end' }} >
            <View style = {{ flex:1 }} >
              <TouchableOpacity
                onPress = {()=> this.setState({ currentView: "map" })}
                style = { this.state.currentView === "map" ? styles.activeViewButtons : styles.viewButtons}
              >
                <Text
                  style = { this.state.currentView === "map" ? styles.activeButtonTextColor :styles.buttonTextColor}
                >
                  MAP VIEW
                </Text>
              </TouchableOpacity>
            </View>
            <View style = {{ flex:1 }} >
              <TouchableOpacity
               style = { this.state.currentView === "list" ? styles.activeViewButtons : styles.viewButtons}
               onPress = {()=> this.setState({ currentView: "list" })}
              >
                <Text
                  style = { this.state.currentView === "list" ? styles.activeButtonTextColor :styles.buttonTextColor}
                >
                  LIST VIEW
                </Text>       
              </TouchableOpacity>
            </View>
          </View>
          <View style = {{ marginLeft: 10, flex:4, flexDirection: 'row', alignItems: 'flex-end', marginBottom: 5 }} >
            <View style = {{ flex:1 }} >
              <TouchableOpacity
                onPress = {()=>{ this.showSpecificCategoryMarkers("food") }}
                style = { this.state.currentCategory === 'food' ? styles.categoryButtons : styles.nonActiveCategory}
              >
                <Text
                  style = {  this.state.currentCategory === 'food' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor  }
                >
                  FOOD
                </Text>
              </TouchableOpacity>
            </View>
            <View style = {{ flex:1 }} >
              <TouchableOpacity
                onPress = {()=>{ this.showSpecificCategoryMarkers("drinks") }}
                style = { this.state.currentCategory === 'drinks' ? styles.categoryButtons : styles.nonActiveCategory}
              >
                <Text
                   style = {  this.state.currentCategory === 'drinks' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor  }
                >
                  DRINKS
                </Text>       
              </TouchableOpacity>
            </View>
            <View style = {{ flex: 2 }} >
              <TouchableOpacity
                onPress = {()=>{ this.showSpecificCategoryMarkers("food+drinks") }}
                style = { this.state.currentCategory === 'food+drinks' ? styles.categoryButtons : styles.nonActiveCategory}
              >
                <Text
                  style = {  this.state.currentCategory === 'food+drinks' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor   }
                >
                  FOOD + DRINKS
                </Text>       
              </TouchableOpacity>
            </View>
          </View>     
        </View>

        { this.state.currentView === "map" && location.latitude && location.longitude ?
        <View style = {{ flex: 12 }} >
          <MapView
            ref={map => this.map = map}
            provider = {PROVIDER_GOOGLE}
            style={styles.mapStyle} 
            initialRegion={{
            latitude:  parseFloat( !location.latitude ? location.latitude : 32.7970465 ),
            longitude: parseFloat( !location.longitude ? location.longitude: -117.254522 ),
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            showsUserLocation = {true}
            showsPointsOfInterest = {true}
            customMapStyle = {CustomMapData}
            mapType = "standard"
            showsCompass = {true}
            showsMyLocationButton={true}
            minZoomLevel = {5}
            userLocationAnnotationTitle = "You"
            showsScale = {true}
            maxZoomLevel = {20}
            showsIndoorLevelPicker = {true}
            loadingEnabled = {true}
          > 
            {  
              goodSpots && goodSpots.length> 0 && goodSpots.map((marker, index)=> {
                const url = this.getImagePath(marker.types, 'green')
                return(
                  <MapView.Marker
                    key = {index}
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    onPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"
                    
                  > 
                    <Image source={url} style={{height: height * 0.09, width: width * 0.13 }} />
                    <MapView.Callout tooltip style={styles.customView}>
                    </MapView.Callout>
                  </MapView.Marker> 
                )
              })   
            }

            {  
                averageSpots && averageSpots.length> 0 && averageSpots.map((marker, index)=> {
                  const url = this.getImagePath(marker.types, 'yellow')
                return(
                  <MapView.Marker
                    key = {index}
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    onPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"
                    
                    
                  >
                    <Image source={url} style={{height: height * 0.09, width: width * 0.13 }} />
                    <MapView.Callout tooltip style={styles.customView}>
                    </MapView.Callout>
                  </MapView.Marker> 
                )
              })   
            }

            {  
              badSpots && badSpots.length> 0 &&  badSpots.map((marker, index)=> {
                const url = this.getImagePath(marker.types, 'red')
                return(
                  <MapView.Marker
                    key = {index}
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    onPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"

                  >
                    <Image source={url} style={{height: height * 0.09, width: width * 0.13 }} />
                    <MapView.Callout tooltip style={styles.customView}>         
                    </MapView.Callout>
                  </MapView.Marker> 
                )
              })   
            }        
         
          </MapView>
          <View
            style={{
              position: 'absolute',//use absolute position to show button on top of the map
              top: '74%', //for center align
              right: '2%',
              alignSelf: 'flex-end' //for align to right
            }}
          >
            <TouchableOpacity
              style = {styles.setVibeButton}
              onPress = {() => navigation.navigate('vibeTabNavigator')}
            >
            <Text
              style = {styles.setVibeButtonText}
            >
              SET VIBE
            </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: '20%', 
              right: '5%',
              alignSelf: 'flex-end' 
            }}
          >
            <TouchableOpacity
              onPress = {() => {
                
                this.setState({ showVibeModal: true }) 
              }}
            >
              <Icon
                name="eye"
                type = 'foundation'
                size = {40}
                color = "black"  
              />
            </TouchableOpacity>
          </View>
        </View>
        :
        <ListComponent 
          navigation = {navigation}
          currentCategory = {this.state.currentCategory} 
        />

        }
        <Animated.ScrollView
          horizontal
          scrollEventThrottle={1}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: this.animation,
                  },
                },
              },
            ],
            { useNativeDriver: true }
          )}
          style={styles.scrollView}
          contentContainerStyle={styles.endPadding}
        >
          
            { allSpots && allSpots.length > 0 && this.state.currentView === "map" && this.state.showCard &&
              <TouchableOpacity
                onPress = {()=>{ 
                this.selectSpecificBusiness()
                }
              }>
                <View style={[styles.card, {  flexDirection: 'row',alignItems: 'center' ,width: width * 0.9, height: height * 0.15 }]}>
                  <View style={{ flex: 2 , height: '100%', borderWidth: 1}}>
                    <Image
                      style={styles.cardImage}
                      source={ { uri: this.state.selectedMarker?  this.state.selectedMarker.images[0].secure_url: allSpots[0].images[0].secure_url } } 
                    />
                    <View style = {styles.heartIcon}  >
                      <TouchableOpacity
                        onPress = {()=> { this.addToFavourite()  }}
                      >
                        <Icon
                          name="heart"
                          type = 'foundation'
                          size = {25}
                          color = {this.getFavouriteEstablishmentColor(this.state.selectedMarker? this.state.selectedMarker.markerId: allSpots[0].markerId)}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={{ flex: 2, alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={[{ fontSize: 20, color: '#b63838', marginBottom: 2 }, styles.textInfo]}>{this.state.selectedMarker ? this.state.selectedMarker.types[0] : allSpots[0].types[0] }</Text> 
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, styles.textInfo]}>{this.state.selectedMarker ? this.state.selectedMarker.name : allSpots[0].name }</Text>
                    <StarRating
                      disable={true}
                      maxStars={5}
                      rating={this.state.selectedMarker && this.state.selectedMarker.businessGoogleRating ? this.state.selectedMarker.businessGoogleRating : allSpots[0].businessGoogleRating }
                      starSize={10}
                      starStyle = {{ color:'#ffbf00' }}
                    />
                  </View>
                  <View style = {{ flex:1, alignSelf: 'flex-start' }}  >
                    <TouchableOpacity
                      onPress = {()=> {
                        this.setState({ showCard: false })
                      }}
                    >
                      <Icon
                        name="x"
                        type = 'foundation'
                        size = {20}
                        color = "black"  
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            }  
        </Animated.ScrollView>
        <OrientationLoadingOverlay
            visible={this.state.spinner}
            message = "Loading..."
            color="white"
            indicatorSize="large"
            messageFontSize={24}
          >
          <View>
            <Image
              source={require('../../assets/loadingIndicator.gif')}
            />
          </View>
        </OrientationLoadingOverlay> 
        <CategoryAddModal  show = {this.state.showCategoryAddPopUp} message = {this.state.totalCategoriesName} /> 
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
         <ShowVibeModal show = {this.state.showVibeModal} onClose = {()=> { this.setState({ showVibeModal: false }) }} /> 
      </View>
    )
  }

}


const mapStateToProps = (state) => {
  const { business, vibe, category, user} = state;
  return { 
    business: business,
    vibe: vibe.vibe.vibe,
    category: category.category.category,
    user
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness,
    getSearchBusinesses,
    addToFavourite
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);