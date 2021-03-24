import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { View, Text, Dimensions, Animated,Image, TouchableOpacity, TextInput, Keyboard} from 'react-native';
import { Input, Textarea } from 'native-base';
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
import CategoryAddModal from './CategoryAddOrRemoveAlert';
import styles from './CSS/MapComponent';
import ToggleSwitch from '../components/ReUsable/Toggle';
import InfoModal from './Modals/infoAnimatedModal';
import axios from '../api/axios';

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT + 50;

const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.05 //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO
const mapRef = React.createRef();

class MapScreen extends React.PureComponent{

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
      showCard: false,
      spinner: false,
      showVibeInfoModal: true,
      showCategoryAddPopUp: false,
      totalCategoriesName: '',
      showMarkerName: false,
      tracksViewChanges: true,
      isActiveToggle: false,
      showInfoModal: false,
      adminSettings: null
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
  
  makeAnimate = () => {
    const {user} = this.props;
    const { location } = user.user;

    let r = 
    {
      latitude:  parseFloat( location.latitude ? location.latitude : 32.7970465 ),
      longitude: parseFloat( location.longitude ? location.longitude: -117.254522 ),
      latitudeDelta: 0.0009,
      longitudeDelta: 0.0009
    }
    this.mapView.animateToRegion(r, 2000);
  }

  showSpecificCategoryMarkers = (category) => {
    this.setState({ currentCategory: category, isActiveToggle: true }, ()=>{
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
    Keyboard.dismiss()
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

  getAdminSettings = async () => {
    const { vibe } = this.props;
    const getAdminData = await axios.get('/getdefaultSettings');
    console.log("the admin data", getAdminData.data.settings.vibeCategoryPinsColor);
    const vibeCategory = getAdminData.data.settings.vibeCategoryPinsColor.filter(category => {
      return category.name === vibe.vibeCategory ;
    })[0]
    this.setState({ 
      adminSettings: vibeCategory
    }, ()=> {
      console.log("the admin settings", this.state.adminSettings);
    });
  }

  getCurrentCategorySelected = (categories, name) => {
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
  changedView = (view) => {
    const { user } = this.props;
    const { location } = user.user;
    this.setState({ currentView: view })
    if(view === 'map'){
      this.setState({ showCard: false })
      setTimeout(()=>{
        if(location.latitude && location.longitude)
          this.makeAnimate() 
      }, 200)
    }
    Keyboard.dismiss()
  }

  onChangeToggle = (toggle) => {
    this.setState({ isActiveToggle: toggle},()=> {
      if(toggle){
        if(this.state.currentCategory === null)
          this.showSpecificCategoryMarkers('food')
        else
          this.showSpecificCategoryMarkers(this.state.currentCategory)
      }
      else{
        this.setState({ currentCategory: null })
        this.props.getfilteredBusiness(null, null, null);
      }
        
    })
  }

  componentDidMount(){
    const vibe = this.props.vibe;
    this.getAdminSettings()
    setTimeout(()=> {
      this.setState({tracksViewChanges: true, showVibeInfoModal: false })
      // this.makeAnimate()
    }, 2000)
  }

  render(){
    const { filterBusinesses } = this.props.business.business;
    const { goodSpots, averageSpots, badSpots, allSpots } = filterBusinesses;
    const {navigation, user, vibe } = this.props;
    const { location, radius } = user.user;
 
    return(
      <View style={styles.container}>
        <InfoModal 
          show = {this.state.showInfoModal}
          onClose = {() => this.setState({ showInfoModal: false })}
        />
        <View 
          style={styles.searchBar}
        >
          <ProfileModalIcon 
            name="ios-beer" 
            size={20} 
            style={{ color: 'green',flex: 1, textAlign: 'right', marginRight: 10 }} 
          /> 
            <Textarea />       
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
                onPress = {()=> this.changedView('map') }
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
                onPress = {()=> this.changedView('list') }
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
            ref = {(ref)=>this.mapView=ref}
            provider = {PROVIDER_GOOGLE}
            style={styles.mapStyle} 
            initialRegion={{
              latitude:  parseFloat( !location.latitude ? location.latitude : 32.7970465 ),
              longitude: parseFloat( !location.longitude ? location.longitude: -117.254522 ),
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            followsUserLocation = {true}
            showsUserLocation = {true}
            showsPointsOfInterest = {true}
            cacheEnabled = {true}
            onRegionChange = { (region)=> {
              let showMarker = true;
              Keyboard.dismiss()
              const { latitudeDelta } = region;
          
              if(latitudeDelta <= 0.006)
                showMarker = true;
              else
                showMarker = false;     
              this.setState({ showMarkerName: showMarker }) 
            } }
            customMapStyle = {CustomMapData}
            mapType = "standard"
            showsCompass = {false}
            showsMyLocationButton={true}
            minZoomLevel = { 5 }
            userLocationAnnotationTitle = "You"
            showsScale = {true}
            maxZoomLevel = {20}
            showsIndoorLevelPicker = {true}
            loadingEnabled = {true}
            onPress = {()=> Keyboard.dismiss()}
          > 
          <MapView.Circle
            center = {{
              latitude:  parseFloat( location.latitude ? location.latitude : 32.7970465 ),
              longitude: parseFloat( location.longitude ? location.longitude: -117.254522 ),
            }}
            radius = {radius}
            zIndex = {0}
          >
          </MapView.Circle>
            {  
              goodSpots && goodSpots.length> 0 && goodSpots.map((marker, index)=> {
                const url = this.getImagePath(marker.types, this.state.adminSettings && this.state.adminSettings.color )
                if(this.getCurrentCategorySelected(marker.types, marker.name) ){
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
                      // tracksViewChanges={ this.state.tracksViewChanges  }  
                    > 
                      <Image source={url} style={{height: height * 0.09, width: width * 0.13 }} />
                        { this.state.showMarkerName && (<Text style = {{ width: 100, textAlign: 'left', fontSize: 16 }} >{ marker.name }</Text>) }
                      <MapView.Callout tooltip style={styles.customView}>
                      </MapView.Callout>
                    </MapView.Marker> 
                  )
                }   
              })   
            }

            {  
              averageSpots && averageSpots.length> 0 && averageSpots.map((marker, index)=> {
                const url = this.getImagePath(marker.types, 'yellow')
                if(this.getCurrentCategorySelected(marker.types, marker.name) ){
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
                      // tracksViewChanges={ this.state.tracksViewChanges }
                    >
                      <Image 
                        source={url} 
                        style={{ 
                          height: height * 0.09, 
                          width: width * 0.13 
                        }} 
                      />
                      {  this.state.showMarkerName && (<Text style = {{ width: 100, textAlign: 'left', fontSize: 16 }} >{ marker.name }</Text>) }
                      
                      <MapView.Callout tooltip style={styles.customView}>
                      </MapView.Callout>
                    </MapView.Marker> 
                  )
                }
              })   
            }

            {  
              badSpots && badSpots.length> 0 &&  badSpots.map((marker, index)=> {
                const url = this.getImagePath(marker.types, 'red')
                if(this.getCurrentCategorySelected(marker.types, marker.name) ){
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
                      // tracksViewChanges={ this.state.tracksViewChanges  }

                    > 
                      <Image source={url} style={{height: height * 0.09, width: width * 0.13 }} />
                      {  this.state.showMarkerName && (<Text style = {{ width: 100, textAlign: 'left', fontSize: 16 }} >{ marker.name }</Text>) }
                      <MapView.Callout tooltip style={styles.customView}>       
                      </MapView.Callout>
                    </MapView.Marker> 
                  )
                }
              })   
            }        
         
          </MapView>
          <View
            style={{
              position: 'absolute',//use absolute position to show button on top of the map
              top: '5%', //for center align
              right: '1%',
              alignSelf: 'flex-end', //for align to right
            }}
          > 
            <TouchableOpacity
              onPress = {()=> { this.setState({ showInfoModal: true }) }}
            >
              <Image 
                source = {require('../../assets/icons/info.png')}
                style = {{ width: 25, height: 25, alignSelf: 'center' }}
              />
            </TouchableOpacity>          
            <ToggleSwitch
              isActiveToggle = {this.state.isActiveToggle} 
              onChange = {(toggle)=> {
                this.setState({ isActiveToggle: toggle},()=> {
                  if(toggle){
                    if(this.state.currentCategory === null)
                      this.showSpecificCategoryMarkers('food')
                    else
                      this.showSpecificCategoryMarkers(this.state.currentCategory)
                  }
                  else{
                    this.setState({ currentCategory: null })
                    this.props.getfilteredBusiness(null, null, null);
                  }
                    
                })
              }}
            />
            <Text 
              style = {{ fontSize: 12, fontWeight: '600',width: '80%',alignSelf: 'center', textAlign: 'center' }} 
            >
              { this.state.isActiveToggle ? "All Venues" : "Venue by Vibe" } 
            </Text>
          </View>
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
              onPress = { ()=> navigation.navigate('vibeTabNavigator')  }
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
              top: '92%', 
              right: '5%',
              alignSelf: 'flex-end' 
            }}
          >
            <TouchableOpacity
              onPress = {()=> {
                this.makeAnimate()} 
              }
            >
              <Text style = {{ fontSize: 13, color: 'white' }} >sdfsdf</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              position: 'absolute',
              top: '22%', 
              right: '8%',
              alignSelf: 'flex-end' 
            }}
          >
            <TouchableOpacity
              onPress = {() => {
                navigation.navigate('Screen 4', { screen: 'radiusScreen' })
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
          showSpecificCategoryMarkers = { (currentCategory)=> {
            this.showSpecificCategoryMarkers(currentCategory)
          }}
          setCategory = {() => this.setState({ currentCategory: null }) }
          isActiveToggle = {this.state.isActiveToggle}
          onChangeToggle = {(toggle)=> { this.onChangeToggle(toggle) }} 
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