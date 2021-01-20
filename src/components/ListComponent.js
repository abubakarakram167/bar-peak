import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import haversine from 'haversine-distance'
import { property } from 'underscore';
class ListComponent extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      renderList: [],
      currentPageNumber : 0
    }
  }

  componentDidMount(){

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

  getMarkerCategoryName = (category) => {
    if(category.types.includes("Restaurant") && (category.types.includes("Night Clubs") || category.types.includes("Bar")) )
      return "food + drinks"
    if( (category.types.includes("Night Clubs") || category.types.includes("Bar") ) && !category.types.includes("Restaurant") )
      return 'Only drinks';
    else if(category.types.includes("Restaurant") && ! (category.types.includes("Night Clubs") ||  category.types.includes("Bar") ) )
      return 'Only food';
  }
  getCurrentCategorySelected = (categories) => {
    const {currentCategory} = this.props;
  
    if(currentCategory === "food")
      return categories.includes("Restaurant") &&  ! (categories.includes("Night Clubs") ||  categories.includes("Bar") ) ? true : false
    else if(currentCategory === "drinks")   
      return !categories.includes("Restaurant") &&  (categories.includes("Night Clubs") ||  categories.includes("Bar") ) ? true : false     
    else 
      return true
  }

  render(){
    const { allSpots } = this.props.business;
    const { navigation } = this.props;
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
          </View>
          <View style = {{ flex: 6 }}>
            <View style = {{ flexDirection: 'row',justifyContent: 'flex-end', flex:1 }} >
              <Text style = {styles.column} >Type</Text>
              <Text style = {styles.column} >Distance Away</Text>
            </View>
            <View style = {{ flex:10, borderWidth: 0 }} >
              <ScrollView >
                {  allSpots && allSpots.slice(this.state.currentPageNumber * 10, this.state.currentPageNumber * 10 + 10).map((marker, index)=>{
                    
                    if( this.getCurrentCategorySelected(marker.types, marker.name) ){
                      return(
                        <View key = {index} style = { styles.listElement } >
                          <View style = {[styles.listIcon, this.getColor(marker)  ]} >
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
                      ) 
                    }
                    else
                      return null; 
                  }) 
                }
              </ScrollView>   
            </View>
            { allSpots && allSpots.slice(this.state.currentPageNumber * 10 ).length > 10 &&
                <View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                { this.state.currentPageNumber >0  &&
                  (<TouchableOpacity
                    style = {styles.paginationButton}
                    onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber - 1) }}
                  >
                    <Text
                      style = {{ fontWeight: '700' }}
                    >Previous Page</Text>
                  </TouchableOpacity>)
                }
              
                  (<TouchableOpacity
                    style = {[styles.paginationButton, { marginRight: 30 }]}
                    onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber + 1) }}
                  >
                    <Text
                      style = {{ 
                        fontWeight: '700' 
                      }}
                    >Next Page</Text>
                  </TouchableOpacity>)
                </View>
            }
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
    flex: 12,
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
    width: '80%',
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
  const { business, user } = state
  return { 
    business: business.business.filterBusinesses,
    location: user.user.location
  }
};

export default connect(mapStateToProps, null)(ListComponent);