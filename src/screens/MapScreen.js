import React from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import BottomDrawer from '../components/BottomDarawer';

class MapScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      markers:[]
    }
  }

  getAllMarkers = (data) => {
    const markers = data.map((marker)=>{
      return {
        placeId: marker.place_id,
        latitude: marker.geometry.location.lat,
        longitude: marker.geometry.location.lng
      }
    });
    this.setState({ markers })
  }

  componentDidMount(){
    const route = this.props.route;
    const {businessData} = route.params;
    this.getAllMarkers(businessData)
  }

  render(){
    return(
      <View style={styles.container}>
        <MapView
          provider = {PROVIDER_GOOGLE}
          style={styles.mapStyle} 
          initialRegion={{
           latitude: this.state.markers.length > 0 && this.state.markers[0].latitude,
           longitude: this.state.markers.length > 0 && this.state.markers[0].longitude,
           latitudeDelta: 0.0922,
           longitudeDelta: 0.0421,
          }}
        >
        { 
          this.state.markers.map((marker)=>{
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

export default MapScreen;