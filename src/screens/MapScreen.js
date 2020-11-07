import React from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

class MapScreen extends React.Component{


  render(){
    const route = this.props.route;
    const {businessData} = route.params;
    console.log("the business data", businessData)
    return(
      <View style={styles.container}>
        <MapView
          provide = {PROVIDER_GOOGLE}
          style={styles.mapStyle} 
          initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        />
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
    height: Dimensions.get('window').height * 0.4,
  },
});

export default MapScreen;