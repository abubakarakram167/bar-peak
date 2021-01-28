import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import { connect } from 'react-redux';
import Modal from './Modal';
import CategoryAddModal from './CategoryAddOrRemoveAlert';
import { addToFavourite } from '../../redux/actions/Business';
import { bindActionCreators } from 'redux';
import ShowVibeModal from "./showVibeModal";

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
      showVibeModal: false
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

  selectSpecificBusiness = (marker) => {
    this.setState({showProfileModal: true, selectedBusiness: marker, selectedMarker: marker });
  }

  getMarkerCategoryName = (category) => {
    if(category.types.includes("Restaurant") && (category.types.includes("Night Clubs") || category.types.includes("Bar")) )
      return "food + drinks"
    if( (category.types.includes("Night Clubs") || category.types.includes("Bar") ) && !category.types.includes("Restaurant") )
      return 'Only drinks';
    else if(category.types.includes("Restaurant") && ! (category.types.includes("Night Clubs") ||  category.types.includes("Bar") ) )
      return 'Only food';
  }
  getCurrentCategorySelected = (categories, markerName) => {
    const {currentCategory} = this.props;
    if(currentCategory === "food")
      return categories.includes("Restaurant") 
    else if(currentCategory === "drinks")   
      return  categories.includes("Night Clubs") ||  categories.includes("Bar")  ? true : false     
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
        specificSpots = allSpots.filter((spot)=> {
          return spot.types.includes("Restaurant") 
        }) 
      }   
      else if(currentCategory === "drinks"){
        specificSpots = allSpots.filter((spot)=> {
          return  spot.types.includes("Night Clubs") ||  spot.types.includes("Bar")  ? true : false 
        }) 
      }           
      else 
        specificSpots = allSpots
    }
    else 
      specificSpots = allSpots
    
    console.log("the all spots", specificSpots)  
    return specificSpots  
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
              <ScrollView >
                {  allSpots && this.getOnlyCurrentCategoryList(allSpots).slice(this.state.currentPageNumber * 10, this.state.currentPageNumber * 10 + 10).map((marker, index)=>{
                    
                    if( this.getCurrentCategorySelected(marker.types, marker.name) ){
                      return(
                        <TouchableOpacity
                          onPress = {()=>{ 
                            this.selectSpecificBusiness(marker)
                          }}
                        >
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
            {
              // !(allSpots && this.getOnlyCurrentCategoryList(allSpots).slice(this.state.currentPageNumber * 10 ).length > 10) || true &&        
              //   (<TouchableOpacity
              //     style = {styles.paginationButton}
              //     onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber - 1) }}
              //   >
              //     <Text
              //       style = {{ fontWeight: '700' }}
              //     >
              //       Previous Pagess
              //     </Text>
              //   </TouchableOpacity>)
            } 
            { allSpots && this.getOnlyCurrentCategoryList(allSpots).slice(this.state.currentPageNumber * 10 ).length > 10 &&
                <View style = {{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end' }} >
                { this.state.currentPageNumber >0  &&
                  <TouchableOpacity
                    style = {styles.paginationButton}
                    onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber - 1) }}
                  >
                    <Text
                      style = {{ fontWeight: '700' }}
                    >
                      Previous Page
                    </Text>
                  </TouchableOpacity>
                }
              
                  <TouchableOpacity
                    style = {[styles.paginationButton, { marginRight: 30 }]}
                    onPress = {()=>{ this.changePageNumber(this.state.currentPageNumber + 1) }}
                  >
                    <Text
                      style = {{ 
                        fontWeight: '700' 
                      }}
                    >Next Page</Text>
                  </TouchableOpacity>
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
  const { business, user, category } = state
  return { 
    business: business.business.filterBusinesses,
    location: user.user.location,
    category: category.category.category
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    addToFavourite
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ListComponent);