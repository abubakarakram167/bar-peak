import React, { Component } from "react";
import {
    View,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    Image,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import MapComponent from '../components/MapComponent';
import {getfilteredBusiness, getFavouritesBusinessAction, getNearLocationBusiness, emptyBusiness} from '../../redux/actions/Business';
import {getVibe} from '../../redux/actions/Vibe';
import { getAllCategories } from '../../redux/actions/Category';
import { setUserLocation } from '../../redux/actions/User';
import * as Location from 'expo-location';
import VibeRequirePopUp from '../components/Modals/VibeRequiredPopupModal';
import ShowLocationPopup from '../components/Modals/showMessagePopUp';
import _, { map } from 'underscore';
import Modal from '../components/Modal';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import ShowVibeModal from "../components/showVibeModal";

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);

const { height, width } = Dimensions.get('window')
class HomeScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      location: null,
      errorMsg: null,
      showModal: false,
      showProfileModal: false,
      selectedItem: {},
      selectedBusiness: {},
      showIndicator: false,
      spinner: false,
      makeAnimate: false,
      showLocationPopup: false,
      isVibeEmpty: true
    }
  }

  makeCalls = async() => {
    try{
      await this.props.emptyBusiness()
      this.setState({ spinner: true })
      const location = await this.getCurrentLocation()
      await this.getNewChangedLocation(); 
      const { coords } = location;
      const [getVibe] = await Promise.all([ this.props.getVibe(), this.props.getNearLocationBusiness(coords, null), this.props.setUserLocation(coords)]) 
      this.setState({ spinner: false })
      await this.props.getAllCategories();
      if(!getVibe){
        setTimeout(()=> { this.setState({ showModal: true }) }, 200)      
      }
      else
        this.setState({ isVibeEmpty: false, showVibeModal: true })
      await this.props.getfilteredBusiness(null, null, null);
      await this.props.getFavouritesBusinessAction();
      this.setState({ spinner: false , makeAnimate: true})
     
    }catch(error){
      console.log("the error", error)
      this.setState({ showLocationPopup: true })
    }
  }

  async componentDidMount(){
    this.makeCalls()
  }

  getBusinessByCategory = async(category) => {
    this.setState({ spinner: true })
    const { navigation } = this.props;
    await this.props.getfilteredBusiness(category);
    this.setState({ spinner: false })
    navigation.navigate('MapScreen',{
      category
    })
  }

  selectSpecificBusiness = (item) => {
    const { businesses } = this.props.business.business;
    const selectedBusiness = businesses.filter( (business) => business.placeId === item.place_id )[0]
    this.setState({ selectedItem: item, showProfileModal: true, selectedBusiness });
  }

  getNewChangedLocation = async() => {
    await Location.watchPositionAsync(
      {
        enableHighAccuracy: true,
        distanceInterval: 10,
        timeInterval: 6000
      },
      newLocation => {
        let { coords } = newLocation;
        this.props.setUserLocation(coords);
      },
      error => console.log( "thwe error", error)
    );
  }

  getCurrentLocation = async() => {
    try{
      let { status } = await Location.requestPermissionsAsync();
       if(status !== 'granted'){
          return null
       } 
        
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      return location;
    }catch(err){
      return null
    }
  }
    
  render() {  
    const {navigation, route, component } = this.props;
    const showVibeInfoAfterVibe = component && component.component.showVibeInfoModalAfterVibe
    console.log("hehehehehe", showVibeInfoAfterVibe)

    return (
      <DismissKeyboard> 
        <SafeAreaView style = {{ flex: 1 }} >
          <View style={{ flex: 1 }}>
            <MapComponent  navigation = {navigation}/>
            { (this.state.showVibeModal && !this.state.isVibeEmpty || showVibeInfoAfterVibe ) &&
              (<ShowVibeModal 
                show = {this.state.showVibeModal}
                onClose = {() => { this.setState({ showVibeModal: false }) }}
                navigation = {navigation}
                showButtons = {false}
              />
              )
            } 
            { this.state.showModal &&
              < VibeRequirePopUp 
                show = {this.state.showModal} 
                closeModal = {()=> this.setState({ showModal: false })} 
                navigation = {this.props.navigation} 
              /> 
            }
            { this.state.showProfileModal && 
              ( <Modal  
                  item  = {this.state.selectedItem}  
                  businessData = {this.state.selectedBusiness}  
                  show = {this.state.showProfileModal} 
                  closeModal = {()=> { this.setState({ showProfileModal: false }) }} 
                />
              ) 
            }   
            <OrientationLoadingOverlay
              visible={this.state.spinner}
              message = "Loading..."
              color="white"
              indicatorSize="large"
              messageFontSize={24}
            >
            <ShowLocationPopup
              show = {this.state.showLocationPopup}
              message = "You have denied the access for location.Please use location services to facilitate better.After enable location restart the app."
              onClose = {()=> this.setState({ showLocationPopup: false, spinner: false })}
            />  
            <View>
              <Image
                source={require('../../assets/loadingIndicator.gif')}
              />
            </View>
          </OrientationLoadingOverlay>         
          </View>
        </SafeAreaView>
      </DismissKeyboard>      
    );
  }
}
const mapStateToProps = (state) => {
  const { business, vibe, user, category, component } = state
  return { 
    business: business,
    vibe: vibe,
    category,
    user,
    component
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getNearLocationBusiness,
    getfilteredBusiness,
    getVibe,
    emptyBusiness,
    getAllCategories,
    setUserLocation,
    getFavouritesBusinessAction
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  homeLogo: { flex: 1,
    height: null, 
    width: '100%',
    resizeMode: 'cover',
    borderBottomLeftRadius:0,
    borderBottomRightRadius:0 ,
    borderRadius: 15,
    borderBottomWidth: 0,
    borderWidth: 1, 
    borderColor: '#dddddd' 
  },
  ImageButton: {
    position: 'absolute',
    top: '25%',
    left: '5%'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  spinnerContainer: {
    position: 'relative',
    top: '0%',
    bottom:'40%',
    left: '35%'
  },
  overlaycontainer:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity:0.3,
    justifyContent:"center",
    alignItems:"center",
    zIndex: 3 
  }
});