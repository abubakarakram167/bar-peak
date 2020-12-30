import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import haversine from 'haversine-distance'
class ListComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      renderList: []
    }
  }

  getMiles = (i) => {
    return i*0.000621371192;
  }

  sortSpotsByDistanceAway = (markerList) => {
    return markerList.sort(function(a, b) {
      return parseFloat(a.distanceAway) - parseFloat(b.distanceAway);
    });
  }

  componentDidMount(){
    const { allSpots } = this.props.business;
    // let { latitude, longitude } = this.props.location;
    latitude = 32.7970465;
    longitude = -117.254522;
    var userLocation = { lat: latitude.toFixed(5) , lng: longitude.toFixed(5) }
    var destinationLocation = {};
    const markerList = allSpots.map((marker)=>{
      destinationLocation = { lat: marker.latitude.toFixed(5) , lng: marker.longitude.toFixed(5) }
      return {...marker, distanceAway:  this.getMiles(haversine(userLocation, destinationLocation)).toFixed(2)}
    })
    console.log("the markerss in list", this.sortSpotsByDistanceAway(markerList));
    this.setState({ renderList: markerList })
  }

  render(){
    return(
      <View style={styles.container}>
        <View style = {{ flex: 1, flexDirection: 'column' }} >
          <View style = {{ flex: 1, flexDirection: 'row' }} >
            <View
              style = {{ flex: 2, marginTop: 20, marginLeft: 20 }}
            >
              <Text  
                style = {{ fontSize: 22, fontWeight: '500' }}
              >Nearby Spots</Text>  
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
            <View style = {{  alignSelf: 'flex-end', marginRight: '5%'}}>
              <Text style = {{ fontSize: 14, fontWeight: '700' }} >Distance Away</Text>
            </View>
            <View style = {{ flex:1, borderWidth: 0 }} >
              <ScrollView >
                { this.state.renderList.map((marker)=>{
                    return(
                      <View style = { styles.listElement } >
                        <View style = {styles.listIcon} >
                        </View>
                        <View style = {{ flex:2 }}>
                          <Text
                            style = {styles.listElementName}
                          >
                            { marker.name }
                          </Text>
                        </View>
                        <View style = {{ flex:1 }}>
                          <Text>
                            { marker.distanceAway }
                          </Text>
                        </View>
                      </View>
                    )
                  })
                }
              </ScrollView>   
            </View>
          </View>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 12,
    flexDirection: 'row'
  },
  listElement:{
    flex:1,
    flexDirection: 'row',
    marginTop: 10 
  },
  listElementName:{ 
    fontSize: 12, 
    marginLeft: 20 
  },
  listIcon:{ 
    width: 25,
    marginLeft: 20,
    backgroundColor: 'green' 
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
  const { business, user } = state
  return { 
    business: business.business.filterBusinesses,
    location: user.user.location
  }
};

export default connect(mapStateToProps, null)(ListComponent);