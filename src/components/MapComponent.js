import React from 'react';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions, Animated,Image,AppRegistry, ScrollView, TouchableHighlight, TouchableOpacity , TextInput} from 'react-native';
import BottomDrawer from '../components/BottomDarawer';
import CustomMapData from './CustomMapData';
import {getfilteredBusiness, getSearchBusinesses } from '../../redux/actions/Business';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StarRating from 'react-native-star-rating'
import Modal from '../components/Modal';
import Icon from 'react-native-vector-icons/Ionicons'
import ListComponent from './ListComponent';


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
      selectedMarker: {
        image: '',
        title: '',
        rating: ''
      },
      showProfileModal: false,
      selectedItem: {},
      selectedBusiness: {},
      currentView: 'map',
      defaultCategory: 'food',
      searchValue: ''
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
    const marker = this.state.selectedMarker.image ? this.state.selectedMarker : this.state.allMarkers[0]
    const item = {
      place_id: marker.placeId
    };
    const { businesses } = this.props.business.business;
    const selectedBusiness = businesses.filter( (business) => business.placeId === item.place_id )[0]
    this.setState({ selectedItem: item, showProfileModal: true, selectedBusiness });
  }


  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  markerClick = (marker, index) => {
    let selectedMarker = {
      image: marker.image,
      rating: marker.rating,
      name: marker.name,
      types: marker.types,
      priceLevel: marker.priceLevel,
      placeId: marker.placeId
    }
    this.setState({ selectedMarker })
  }

  showSpecificCategoryMarkers = (category) => {
    console.log("the default on search", category)
    this.setState({ defaultCategory: category })
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
    
    this.props.getfilteredBusiness(categories, null);
  }

  getSearchResults = async() => {
    await this.props.getSearchBusinesses(this.state.searchValue)
    this.props.getfilteredBusiness(null,'search')
  }

  render(){
    const { filterBusinesses } = this.props.business.business;
    const { goodSpots, averageSpots, badSpots } = filterBusinesses;
    const vibe = this.props.vibe;
    const {navigation} = this.props;
    
    return(
      <View style={styles.container}>
        <View 
          style={styles.searchBar}
        >
          <Icon name="ios-beer" size={20} style={{ color: 'green',flex: 1, textAlign: 'right', marginRight: 10 }} />
          <TextInput
            underlineColorAndroid="transparent"
            placeholder="Search For a Spot?"
            placeholderTextColor="black"
            style={styles.searchBarInput}
            onChangeText = {(text)=> {
              if(text.length === 0 )
                this.showSpecificCategoryMarkers(this.state.defaultCategory)
              this.setState({ searchValue: text })
            }}
           
          />
          <TouchableOpacity
            onPress = {()=>{ 
              this.getSearchResults()
            }}
          >
            <Icon 
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
                style = {styles.categoryButtons}
              >
                <Text
                  style = { [  this.state.defaultCategory === 'food' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor, { color: 'black' }] }
                >
                  FOOD
                </Text>
              </TouchableOpacity>
            </View>
            <View style = {{ flex:1 }} >
              <TouchableOpacity
                onPress = {()=>{ this.showSpecificCategoryMarkers("drinks") }}
                style = {[styles.categoryButtons]}
              >
                <Text
                  style = {[ this.state.defaultCategory === 'drinks' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor, { color: 'black' }]}
                >
                  DRINKS
                </Text>       
              </TouchableOpacity>
            </View>
            <View style = {{ flex: 2 }} >
              <TouchableOpacity
                onPress = {()=>{ this.showSpecificCategoryMarkers("food+drinks") }}
                style = {[styles.categoryButtons, { marginRight: 5}]}
              >
                <Text
                  style = {[ this.state.defaultCategory === 'food+drinks' ? styles.activeCategoryButtonTextColor : styles.categoryButtonTextColor,  { color: 'black' }]}
                >
                  FOOD + DRINKS
                </Text>       
              </TouchableOpacity>
            </View>
          </View>     
        </View>

        { this.state.currentView === "map" ?
        <View style = {{ flex: 12 }} >
          <MapView
            ref={map => this.map = map}
            provider = {PROVIDER_GOOGLE}
            style={styles.mapStyle} 
            initialRegion={{
            latitude: this.state.allMarkers.length > 0 ? this.state.allMarkers[0].latitude: 32.7970465,
            longitude: this.state.allMarkers.length > 0 ? this.state.allMarkers[0].longitude: -117.2545220,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
            }}
            showsUserLocation = {true}
            showsPointsOfInterest = {true}
            customMapStyle = {CustomMapData}
            showsCompass = {true}
            showsMyLocationButton={true}
          > 
            {  
              goodSpots && goodSpots.length> 0 && goodSpots.map((marker)=> {
                return(
                  <MapView.Marker
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    // onCalloutPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"
                    image = { require('../../assets/greenWhite.png') }
                  >
                    <MapView.Callout tooltip style={styles.customView}>
                      <TouchableHighlight underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                          <Text>{marker.name}</Text>
                        </View>
                      </TouchableHighlight>
                    </MapView.Callout>
                  </MapView.Marker> 
                )
              })   
            }

            {  
                averageSpots && averageSpots.length> 0 && averageSpots.map((marker)=> {
                return(
                  <MapView.Marker
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    // onCalloutPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"
                    image = { require('../../assets/yellowTest.png') }
                  >
                    <MapView.Callout tooltip style={styles.customView}>
                      <TouchableHighlight underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                          <Text>{marker.name}</Text>
                        </View>
                      </TouchableHighlight>
                    </MapView.Callout>
                  </MapView.Marker> 
                )
              })   
            }

            {  
              badSpots && badSpots.length> 0 &&  badSpots.map((marker)=> {
                return(
                  <MapView.Marker
                    coordinate={{ 
                      latitude: marker.latitude,
                      longitude: marker.longitude,
                      }}
                    // onCalloutPress={()=>this.markerClick(marker)}
                    title={marker.name}
                    description = "this is marker description"
                    image = { require('../../assets/redWhite.png') }
                  >
                    <MapView.Callout tooltip style={styles.customView}>
                      <TouchableHighlight underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                          <Text>{marker.name}</Text>
                        </View>
                      </TouchableHighlight>
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
        </View>
        :
        <ListComponent navigation = {navigation} />

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
          
            { this.state.allMarkers.length > 0 &&
              <TouchableOpacity
                onPress = {()=>{ 
                this.selectSpecificBusiness()
                }
              }>
                <View style={[styles.card, {  flexDirection: 'row',alignItems: 'center' ,width: width * 0.9, height: height * 0.15 }]}>
                  <View style={{ flex: 1 , height: '100%', borderWidth: 1}}>
                    <Image
                      style={styles.cardImage}
                      source={ { uri: this.state.selectedMarker.image ? this.state.selectedMarker.image : this.state.allMarkers[0].image } } 
                    />
                  </View>
                  <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10 }}>
                    <Text style={[{ fontSize: 20, color: '#b63838', marginBottom: 2 }, styles.textInfo]}>{this.state.selectedMarker.types ? this.state.selectedMarker.types : this.state.allMarkers[0].types }</Text> 
                    <Text style={[{ fontSize: 16, fontWeight: 'bold' }, styles.textInfo]}>{this.state.selectedMarker.name ? this.state.selectedMarker.name : this.state.allMarkers[0].name }</Text>
                    <Text style={[{ fontSize: 12,  marginBottom: 4 }, styles.textInfo]} >{this.state.selectedMarker.priceLevel > 0 || this.state.allMarkers[0].priceLevel > 0 ?  this.renderDollar(this.state.selectedMarker.priceLevel ? this.state.selectedMarker.priceLevel : this.state.allMarkers[0].priceLevel) : "Price not available" }</Text> 
                    <StarRating
                      disable={true}
                      maxStars={5}
                      rating={this.state.selectedMarker.rating ? this.state.selectedMarker.rating : this.state.allMarkers[0].rating }
                      starSize={10}
                      starStyle = {{ color:'#ffbf00' }}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            }  
        </Animated.ScrollView> 
        {/* <BottomDrawer category = {category}  /> */}
        { this.state.showProfileModal && <Modal  item  = {this.state.selectedItem}  businessData = {this.state.selectedBusiness}  show = {this.state.showProfileModal} closeModal = {()=> { this.setState({ showProfileModal: false }) }} />  } 
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  setVibeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800' 
  },
  setVibeButton: {
    backgroundColor: '#1b76de',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: 70,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#043c7d'
  },
  searchBarInput:{ 
    flex: 6, 
    fontWeight: '700',
    color: 'black', 
    backgroundColor: 'white', 
    textAlign: 'left', 
    height: '80%'
  },
  viewButtons: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    paddingRight: 2,
    paddingLeft: 2 
  },
  activeViewButtons: {
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    paddingRight: 2,
    paddingLeft: 2 
  },
  activeCategoryButtonTextColor: {
    color: 'black',
    textAlign:'center',
    fontSize: 10,
    fontWeight: '900'
  },
  categoryButtonTextColor: {
    color: 'black',
    textAlign:'center',
    fontSize: 8,
    fontWeight: '200'
  },
  searchBar:{
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: '10%',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 1,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    borderRadius: 20,
    borderWidth: 1
  },
  categoryButtons: {
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    marginLeft: 5 ,
    borderRadius: 8,
    borderColor: 'lightgray'
  },
  categoryButtonTextColor: {
    color: 'white',
    textAlign:'center',
    fontSize: 11,
    fontWeight: '300'
  },
  activeButtonTextColor: {
    color: 'white',
    textAlign:'center',
    fontSize: 13,
    fontWeight: '800'
  },
  buttonTextColor: {
    color: 'black',
    textAlign:'center',
    fontSize: 11,
    fontWeight: '800'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.70,
  },
  scrollView: {
    position: "absolute",
    bottom: '6%',
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 0,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 0.3
  },
  cardImage: {
    flex: 1,
    width: "100%",
    height: "50%"
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  }
});

const mapStateToProps = (state) => {
  const { business, vibe, category} = state
  return { 
    business: business,
    vibe: vibe.vibe.vibe,
    category: category.category.category
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness,
    getSearchBusinesses
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);