import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import BottomDrawer from '../components/BottomDarawer';
import {getAllBusiness} from '../../redux/actions/Business';
import {getfilteredBusiness} from '../../redux/actions/Business';
import {getVibe} from '../../redux/actions/Vibe';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class MapScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      vibeMarkers:[],
      unVibeMarkers:[]
    }
  }

  getAllMarkers = (filterBusinesses, vibe) => {
    const vibeData = vibe.crowdedPlace ? filterBusinesses.crowded : filterBusinesses.unCrowded;
    const unVibeData = !vibe.crowdedPlace ? filterBusinesses.crowded : filterBusinesses.unCrowded;

    const vibeMarkers = vibeData.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng
      }
    });

    const unVibeMarkers = unVibeData.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng
      }
    });
    this.setState({ vibeMarkers, unVibeMarkers })
  }

  componentDidMount(){
    const { filterBusinesses } = this.props.business.business;
    const { vibe } = this.props.vibe.vibe;

    // const route = this.props.route;
    // const {businessData} = route.params;
    this.getAllMarkers(filterBusinesses, vibe)
  }

  render(){
    return(
      <View style={styles.container}>
        <MapView
          provider = {PROVIDER_GOOGLE}
          style={styles.mapStyle} 
          initialRegion={{
           latitude: this.state.vibeMarkers.length > 0 ? this.state.vibeMarkers[0].latitude: 102,
           longitude: this.state.vibeMarkers.length > 0 ? this.state.vibeMarkers[0].longitude: -57,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
          }}
        >
        { 
          this.state.vibeMarkers.map((marker)=>{
            return( 
              <Marker
                coordinate={{ 
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor = "green"
                title = "assdd"
                key = {marker.placeId}
              />
            );
          })
        }
        { 
          this.state.unVibeMarkers.map((marker)=>{
            return( 
              <Marker
                coordinate={{ 
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor = "red"
                title = "assdd"
                key = {marker.placeId}
              />
            );
          })
        }    
        </MapView> 
        <Text style = {{color: 'black'}} >sdfsdsss</Text>
        <BottomDrawer  />
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