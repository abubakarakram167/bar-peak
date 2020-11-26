import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions, Animated,Image,AppRegistry, ScrollView, TouchableHighlight, TouchableOpacity } from 'react-native';
import BottomDrawer from '../components/BottomDarawer';
import {getAllBusiness} from '../../redux/actions/Business';
import {getfilteredBusiness} from '../../redux/actions/Business';
import {getVibe} from '../../redux/actions/Vibe';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StarRating from 'react-native-star-rating'
import Modal from '../components/Modal';

const Images = [
  { uri: "https://i.imgur.com/sNam9iJ.jpg" },
  { uri: "https://i.imgur.com/N7rlQYt.jpg" },
  { uri: "https://i.imgur.com/UDrH0wm.jpg" },
  { uri: "https://i.imgur.com/Ka8kNST.jpg" }
]

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
      selectedBusiness: {}
    }
  }

  getAllMarkers = (filterBusinesses, vibe) => {
    
    const { goodSpots, badSpots, averageSpots } = filterBusinesses;

    const goodSpotMarkers = goodSpots.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng,
        image:  marker.hasOwnProperty('photos') ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ marker.photos[0].photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`: 'https://c8.alamy.com/comp/P2D5P1/photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept-P2D5P1.jpg',
        rating: marker.rating,
        types: marker.types[0],
        name: marker.name,
        priceLevel: marker.price_level
      }
    });

    const averageSpotMarkers = averageSpots.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng,
        image: marker.hasOwnProperty('photos') ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ marker.photos[0].photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`: 'https://c8.alamy.com/comp/P2D5P1/photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept-P2D5P1.jpg',
        rating: marker.rating,
        types: marker.types[0],
        name: marker.name,
        priceLevel: marker.price_level
      }
    });

    const badSpotMarkers = badSpots.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng,
        image: marker.hasOwnProperty('photos') ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ marker.photos[0].photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`: 'https://c8.alamy.com/comp/P2D5P1/photo-not-available-vector-icon-isolated-on-transparent-background-photo-not-available-logo-concept-P2D5P1.jpg',
        rating: marker.rating,
        types: marker.types[0],
        name: marker.name,
        priceLevel: marker.price_level
      }
    });
    
    
    this.setState({ 
      goodSpotMarkers,
      averageSpotMarkers,
      badSpotMarkers,  
      allMarkers: goodSpotMarkers.concat(averageSpotMarkers, badSpotMarkers)
    }, ()=>{ console.log(" the state concat ",this.state ) })
  }

  renderDollar = (priceLevel) => {
    let dollar = '';
    for(let i=0 ; i< priceLevel; i++){
      dollar = dollar + '$'; 
    }
    return dollar;
  }

  componentDidMount(){
    const { filterBusinesses } = this.props.business.business;
    const { vibe } = this.props.vibe.vibe;

    // const route = this.props.route;
    // const {businessData} = route.params;
    this.getAllMarkers(filterBusinesses, vibe)
  }

  selectSpecificBusiness = () => {
    const marker = this.state.selectedMarker.image ? this.state.selectedMarker : this.state.allMarkers[0]
    const item = {
      place_id: marker.placeId
    };
    console.log("the marker before", marker)
    const { businesses } = this.props.business.business;
    const selectedBusiness = businesses.filter( (business) => business.placeId === item.place_id )[0]
    console.log("the selected Business", selectedBusiness);
    this.setState({ selectedItem: item, showProfileModal: true, selectedBusiness });
  }


  componentWillMount() {
    this.index = 0;
    this.animation = new Animated.Value(0);
  }

  markerClick = (marker, index) => {
     console.log("the marker selected", marker)
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

  render(){
    const route = this.props.route;
    const {category} = route.params;
    console.log("the category", category);
    return(
      <View style={styles.container}>
        <MapView
          ref={map => this.map = map}
          provider = {PROVIDER_GOOGLE}
          style={styles.mapStyle} 
          initialRegion={{
           latitude: this.state.allMarkers.length > 0 ? this.state.allMarkers[0].latitude: 102,
           longitude: this.state.allMarkers.length > 0 ? this.state.allMarkers[0].longitude: -57,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
          }}
        >
        { 
          this.state.goodSpotMarkers.map((marker, index)=>{
            return(
              <MapView.Marker
                coordinate={{ 
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                 }}
                pinColor = "green" 
                onPress={e => this.markerClick(marker)}
                // onCalloutPress={()=>this.markerClick(marker)}
                title={marker.title}
                description={marker.description}>
                  <MapView.Callout tooltip style={styles.customView}>
                    <TouchableHighlight onPress= {()=>this.markerClick(marker)} underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                            <Text>{marker.title}{"\n"}{marker.description}</Text>
                        </View>
                    </TouchableHighlight>
                  </MapView.Callout>
              </MapView.Marker>
            );
          })
        }
        { 
          this.state.averageSpotMarkers.map((marker)=>{
            return( 
              <MapView.Marker
                coordinate={{ 
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                 }}
                pinColor = "orange" 
                onPress={e => this.markerClick(marker)}
                // onCalloutPress={()=>this.markerClick(marker)}
                title={marker.title}
                description={marker.description}>
                  <MapView.Callout tooltip style={styles.customView}>
                    <TouchableHighlight onPress= {()=>this.markerClick(marker)} underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                            <Text>{marker.title}{"\n"}{marker.description}</Text>
                        </View>
                    </TouchableHighlight>
                  </MapView.Callout>
              </MapView.Marker>
            );
          })
        }
         { 
          this.state.badSpotMarkers.map((marker)=>{
            return( 
              <MapView.Marker
                coordinate={{ 
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                 }}
                pinColor = "red" 
                onPress={e => this.markerClick(marker)}
                // onCalloutPress={()=>this.markerClick(marker)}
                title={marker.title}
                description={marker.description}>
                  <MapView.Callout tooltip style={styles.customView}>
                    <TouchableHighlight onPress= {()=>this.markerClick(marker)} underlayColor='#dddddd'>
                        <View style={styles.calloutText}>
                            <Text>{marker.title}{"\n"}{marker.description}</Text>
                        </View>
                    </TouchableHighlight>
                  </MapView.Callout>
              </MapView.Marker>
            );
          })
        }    
        </MapView>
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
          
            {/* <View style={styles.card} key={"2"}>
              <Image
                source={ { uri: this.state.selectedMarker.image } }
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{"as"}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {"asdas"}
                </Text>
              </View>
            </View> */}
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
        <Text style = {{color: 'black'}} >sdfsdsss</Text>
        <BottomDrawer category = {category}  />
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
    justifyContent: 'flex-start',
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.85,
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
  const { business, vibe } = state
  return { 
    business: business,
    vibe: vibe
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getAllBusiness,
    getfilteredBusiness,
    getVibe
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MapScreen);