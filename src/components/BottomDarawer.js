import React from 'react'
import {Text, View, Dimensions, FlatList,ScrollView, SafeAreaView, TouchableOpacity} from 'react-native'
import { Icon } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel'
import Home from './BottomDrawerComponents/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getfilteredBusiness} from '../../redux/actions/Business';
import Constants from 'expo-constants';
import _, { map } from 'underscore';
import Modal from '../components/Modal';

const { height, width } = Dimensions.get('window')

const styles = {
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    height: '100%'
  },
  panelHeader: {
    height: 60,
    alignItems: 'center',
    justifyContent: 'start',
    borderBottom: 10,
    borderBottomWidth:1,
    width: '100%'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  },
  newContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  }
}

class BottomSheet extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      business: [],
      selectedItem: {},
      selectedBusiness: {}
    }
  }

  componentDidMount(){
    const { filterBusinesses } = this.props.business.business;
    this.setState({ business: filterBusinesses })
  }

  selectSpecificBusiness = (item) => {
    const { businesses } = this.props.business.business;
    const selectedBusiness = businesses.filter( (business) => business.placeId === item.place_id )[0]
    this.setState({ selectedItem: item, showProfileModal: true, selectedBusiness });
  }

  render() {
    const { filterBusinesses } = this.props.business.business;
    const { vibe } = this.props.vibe.vibe;
    const { goodSpots, badSpots } = filterBusinesses;
    // console.log("the filter business", filterBusinesses);
    const isVibeEmpty = _.isEmpty(filterBusinesses); 
    const { category } =  this.props;
    return (
      <View style={styles.container}>
        <Text>Hello world</Text>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.2, bottom: 120}}
          animatedValue={this._draggedValue}
          showBackdrop={true}>
          {dragHandler => (
            <View style={styles.panel}>
              <View style={styles.dragHandler} {...dragHandler}>
                <View style={styles.panelHeader}>      
                  <Icon
                    name='ios-remove'
                    type = 'ionicon'
                    size = {60}
                  />         
                </View>
              </View>
              <View style = {{flex: 1}} >
                <View style={{padding: 0,height: height * 0.35}}>
                  <Text
                    style = {{ 
                      fontSize: 20,
                      margin: 10,
                      fontWeight: '600'
                    }}
                  >
                    <Text style={{ fontSize: 20, fontWeight: '700', paddingHorizontal: 20 }}>
                     { category ? "Results By Category" : "Your Vibe's" }<Text style ={{ fontSize: 10 }} >({ vibe.crowdedPlace ? "Crowded" : "UnCrowdy" },{ vibe.nightLife? "nightLife": "barAndRestaurants"}  ,{ category ? category : vibe.barOrRestaurant})</Text> 
                    </Text>
                  </Text>
                  <ScrollView        
                    horizontal = {true}
                  >          
                    {
                      !isVibeEmpty && goodSpots.map((business)=>{
                        return(
                          <TouchableOpacity
                            onPress = {()=>{ 
                            this.selectSpecificBusiness(business)
                            }}
                          >
                            <Home 
                              width={width}
                              height= {height}
                              item = {business}
                            />
                          </TouchableOpacity>
                        )
                      })
                    }   
                  </ScrollView>
                </View> 
                <View style={{padding: 0, flex: 1}}>
                  <Text
                    style = {{ 
                      fontSize: 20,
                      margin: 10,
                      fontWeight: '600'
                    }}
                  >
                    <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                    { category ? "Results By Category" : "Unvibe" } <Text style ={{ fontSize: 10 }} >({ !vibe.crowdedPlace ? "Crowded" : "UnCrowdy" }, { vibe.nightLife? "nightLife": "barAndRestaurants"} , {category ? category : vibe.barOrRestaurant}</Text> 
                    </Text>
                  </Text>
                  <ScrollView        
                    horizontal = {true}
                  >          
                    {
                      !isVibeEmpty && badSpots.map((business)=>{
                        return(
                          <TouchableOpacity
                            onPress = {()=>{ 
                            this.selectSpecificBusiness(business)
                            }}
                          >
                            <Home 
                              width={width}
                              height= {height}
                              item = {business}
                            />
                          </TouchableOpacity >
                        )
                      })
                    }   
                  </ScrollView>
                </View>
              </View> 
            </View>
          )}
        </SlidingUpPanel>
        { this.state.showProfileModal && <Modal  item  = {this.state.selectedItem}  businessData = {this.state.selectedBusiness}  show = {this.state.showProfileModal} closeModal = {()=> { this.setState({ showProfileModal: false }) }} />  }   
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { business, vibe } = state
  return { 
    business: business, 
    vibe
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheet);
