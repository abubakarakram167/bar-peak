import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from "react-native";
import { connect } from 'react-redux';
import { SliderBox } from "react-native-image-slider-box";
import TimingModal from './TimingModal';
import axios  from '../api/axios';
import { Icon } from 'react-native-elements';
import StarRatings from 'react-native-star-rating'
import _ from 'underscore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import call from 'react-native-phone-call'; 
import Spinner from 'react-native-loading-spinner-overlay';
import ProgressionBar from './ProgressionBar';
import haversine from 'haversine-distance';
import SurveyComponent from './Survey';
import PreviousWeekDayRating from './Modals/PreviousWeekDayRating';
import { showRatingModal, showRatingButton } from '../../redux/actions/Components';
import { bindActionCreators } from 'redux';
import RatingComponent from './ReUsable/ratingDisplay';
import CountDown from 'react-native-countdown-component';
const { height } = Dimensions.get("window");
import moment from 'moment';

const iconsList = [
  {
    type: 'bar',
    iconName: 'glass-cheers'
  },
  {
    type: 'restaurant',
    iconName: 'utensils'
  },
  {
    type: 'point_of_interest',
    iconName: 'map-marked-alt' 
  },
  {
    type: 'establishment',
    iconName: 'creative-commons-share' 
  }, 
  {
    type: 'food',
    iconName: 'hamburger'
  }
]

class ProfileModal extends Component {
  state = {
    modalVisible: false,
    businessProfile:{} ,
    images: [],
    showTimings: false,
    showRatingModal: false,
    rating: {},
    spinner: false,
    getPreviousWeekDayRating: {},
    showPreviousWeekDayModal: false,
    defaultRating: {},
    isRunning: false,
    noOfUsersUntilShowDefault: 0,
    showRateIt: true,
    showDistanceRateText: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  getFormattedAddress = (address) => {
    const newAddress = address.split(',');
    return newAddress[1] + ',' + newAddress[2] + ',' +  newAddress[3]; 
  }

  getIconName = (icons) => {
    const { category } = this.props;
    let specificCategory = category.filter(category => category.title === icons)[0]
    let data;
    if(specificCategory.type === "sub_bar" || specificCategory.title === "Bar"){
      data =  iconsList.filter((icon) => icon.type === 'bar')[0]
    }
    else if(specificCategory.type === "main_category" ){
      if(specificCategory.title === "Restaurant")
        data =  iconsList.filter((icon) => icon.type === 'restaurant')[0]
      else if(specificCategory.title === "Night Clubs")
        data =  iconsList.filter((icon) => icon.type === 'point_of_interest')[0]
    }
    
    return data ? data.iconName : ''
  }

  getBusinessRating = async (placeId) =>{
    const body = {
      query:`
      query{
      getSingleBusiness(placeId: "${placeId}"){
        rating{
          fun,
          crowd,
          ratioInput,
          difficultyGettingIn,
          difficultyGettingDrink
        }
      }}
      `
    }
    try{  
      const res = await axios.post(`graphql?`,body);
      this.setState( { rating: res.data.data.getSingleBusiness.rating } )
    }catch(err){
      console.log("hte errorsss", err.response.data)
    }
  }
  
  async componentDidMount(){
    console.log("hey")
    const { businessData } = this.props;
    const body = {
      query:`
      query{
        getCurrentDayExactTimeRating(businessId: "${businessData.markerId}"){
            getExactTime,
            rating{
              fun,
              crowd,
              ratioInput,
              difficultyGettingIn,
              difficultyGettingDrink
            }
        }
      }
      `
    }
    try{
      const res = await axios.post(`graphql?`,body);
      const defaultRating = await axios.get('/getdefaultSettings');
      const { isRunning, noOfUsersUntilShowDefault, rating } = defaultRating.data.settings;
      this.props.showRatingButton(businessData.markerId)
      
      this.setState( { 
        getPreviousWeekDayRating: res.data.data.getCurrentDayExactTimeRating,
        defaultRating: rating,
        isRunning,
        noOfUsersUntilShowDefault
      })
    }catch(err){
      console.log("hte errorsss", err)
    }
  }

  getMiles = (i) => {
    return i*0.000621371192;
  }

  checkUserRatingAvailableDistance = () => {
    const { businessData } = this.props;
    const { longitude, latitude } = businessData;
    var userLocation = { lat: parseFloat(this.props.location.latitude).toFixed(5) , lng: parseFloat(this.props.location.longitude).toFixed(5) }
    var destinationLocation = { lat: latitude.toFixed(5) , lng: longitude.toFixed(5)  };
    var DistanceInMiles  =  haversine(userLocation, destinationLocation).toFixed(2)
    
    if(DistanceInMiles>=80) return false;
    return true;
  }

  getFavouriteEstablishmentColor = (marker) => {
    const { favouriteBusiness } = this.props.business.business;
    const allEstablishmentIds = favouriteBusiness.map(business => business._id)
   
    if(allEstablishmentIds.includes(marker))
      return "red"
    else
      return "gray";
  }

  getOriginalOrDefaultRating = (defaultRating, originalRating) => {
    const { businessData } = this.props;
    const { noOfUsersUntilShowDefault: defaultRatingUsers , isRunning} = this.state;
    if(businessData.totalUserCountRating >= defaultRatingUsers && isRunning )
      return defaultRating
    return originalRating;  
  }

  getShowRatingButton = () => {
    const { component } = this.props;
    const { showRatingButton, ratingStartTime } = component.component;
   
    if(!showRatingButton){
      var now = moment(new Date()); //todays date
      var duration = moment.duration(now.diff(ratingStartTime));
      var days = duration.asSeconds();
      console.log( " the total seconds",  parseInt(days))
    }
    console.log("show rating button", showRatingButton)
    return showRatingButton
  }

  render() {
    const { show, component } = this.props;
    const { showRatingModal, showRatingButton } = component.component;
    const { businessProfile, defaultRating } = this.state;
    const { businessData } = this.props;  
    const { vibe } = this.props.vibe.vibe;
    const { rating } = businessData
    const allPhotos = businessData && businessData.images.map((photo)=> photo.secure_url);

    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle = "fullScreen"
          visible={show}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          
          <View style={styles.centeredView}>
            <ScrollView style={styles.container}>
              <View style = {{ top: '2%',width: '100%' ,position: 'relative',flex:1, borderWidth: 0, alignSelf: 'center', borderRadius: 10}} >
                <SliderBox               
                  images={allPhotos}
                  sliderBoxHeight={200}
                  onCurrentImagePressed={index => console.warn(`image ${index} pressed`)}
                  dotColor="white"
                  inactiveDotColor="#90A4AE"
                  paginationBoxVerticalPadding={20}
                  circleLoop
                  resizeMethod={'resize'}
                  resizeMode={'cover'}
                  paginationBoxStyle={{
                    position: "absolute",
                    bottom: 0,
                    padding: 0,
                    alignItems: "center",
                    alignSelf: "center",
                    justifyContent: "center",
                    paddingVertical: 10
                  }}
                  dotStyle={{
                    width: 10,
                    height: 10,
                    borderRadius: 5,
                    marginHorizontal: 0,
                    padding: 0,
                    margin: 0,
                    backgroundColor: "rgba(128, 128, 128, 0.92)"
                  }}
                  ImageComponentStyle={{borderRadius: 15, borderWidth: 1 ,width: '100%', height: 270 ,marginTop: 5}}
                  imageLoadingColor="#2196F3"
                />
              </View> 
              <View style = {{ alignSelf : "flex-start", position: 'absolute', top: '3%', left: '5%' }}  >
                <TouchableOpacity
                  onPress = {()=> this.props.closeModal()  }
                >
                  <Icon 
                    name="x"
                    type = 'foundation'
                    size = {20}
                    color = "black"
                    style = {styles.sliderImageIcons}  
                  />
                </TouchableOpacity>
              </View>
              <View style = {styles.heartIcon}  >
                <TouchableOpacity
                  onPress = {()=> {
                    this.props.addToFavourites()
                  }}
                >
                  <Icon
                    name="heart"
                    type = 'foundation'
                    size = {20}
                    color = {this.getFavouriteEstablishmentColor(businessData.markerId)}
                    style = {styles.sliderImageIcons}
                  />
                </TouchableOpacity>
              </View>
              <PreviousWeekDayRating 
                ratingData = { this.state.getPreviousWeekDayRating } 
                show = { this.state.showPreviousWeekDayModal }
                vibe = { this.props.vibe }
                closeModal = { ()=> this.setState({ showPreviousWeekDayModal: false })  }  
              />
              <View style={[styles.modalView]}>
                
                <Text style={styles.modalText}>{businessData.name}</Text>
                <View 
                  style = {styles.detailSection} 
                >
                  <View style = {{ flex:1, alignItems : 'flex-start' }} >  
                    <StarRatings
                      disable={true}
                      maxStars={1}
                      rating={2}
                      starSize={15}
                      starStyle = {{ color: 'red' }}
                    />
                  </View>
                  <View style = {{ flex:2 }} >
                    <Text style = {{ fontWeight: '300', color: 'gray' }} >5.0 ({  !_.isEmpty(businessData) && businessData.businessGoogleRating })</Text>
                  </View>
                  <View
                    style = {{ flex: 5}}
                  >
                    <Text style = {{ alignSelf: 'center', fontSize: 14, textDecorationLine: 'underline' }}>{  !_.isEmpty(businessData) && businessData.address }</Text>
                  </View>
                  
                </View>
                <View
                  style={{
                    borderTopColor: 'gray',
                    borderTopWidth: 0.2,
                    width: "98%",
                    marginTop: '4%',
                    flex:1,
                  }}
                />

                { !_.isEmpty(businessData) && businessData.types.map((type)=>{
                    return(
                      <View style ={[{ borderWidth:0, width: '100%', marginTop: '8%' }]} >
                        <View style={{ flexDirection: 'row' }}>
                          <View style = {{ flex:1, borderWidth:0, paddingTop: '1%' }} >  
                            <FontAwesome5 name={this.getIconName(type)} light />
                          </View>
                          <View style ={ {flex: 6, alignItems: 'flex-start'}} >  
                            <Text style = {{ fontSize: 16, fontWeight: "400" }} >
                              {type}
                            </Text>
                          </View>  
                        </View>
                      </View>
                    )
                  })
                }
                <View
                  style={styles.divider}
                />
                <TouchableOpacity
                  style = {{ borderRadius: 10, marginTop: '5%', borderWidth:1, width: '100%' }}
                  onPress = {() => {  
                    const args = {
                      number: businessData.phoneNo,
                      prompt: true,
                    };
                    // Make a call
                    call(args).catch(console.error);
                   }}
                >
                  <Text style = {{ textAlign: 'center', fontSize: 20, paddingTop: 10, paddingBottom: 10 }} > Contact </Text>
                </TouchableOpacity>
                <View
                  style={styles.divider}
                />
                <View style = {{ flex:2, borderWidth: 0, width: '100%', marginTop: 20}} >
                  <View style = {{ flex: 1, flexDirection: 'row' }} >
                    <View style = {{ flex: 4, alignItems: 'flex-start', borderWidth:0 }} >
                      <Text style = {{ textAlign: 'left', borderWidth:0, fontSize: 20, marginBottom:15, fontWeight: '600' }} >Rating</Text>
                    </View>
                  </View>

                  <RatingComponent 
                    defaultRating = {defaultRating.crowd}
                    rating = {rating.crowd}
                    ratingHeading = "Crowd Factor"
                    ratingCase = "crowd"
                    noOfUsersUntilShowDefault = {this.state.noOfUsersUntilShowDefault}
                    isRunning = {this.state.isRunning}
                    businessData = {this.props.businessData}
                    currentVibe = {vibe}
                  /> 
                  <RatingComponent 
                    defaultRating = {defaultRating.fun}
                    rating = {rating.fun}
                    ratingHeading = "Fun Factor"
                    ratingCase = "fun"
                    noOfUsersUntilShowDefault = {this.state.noOfUsersUntilShowDefault}
                    isRunning = {this.state.isRunning}
                    businessData = {this.props.businessData}
                    currentVibe = {vibe}
                  /> 
                  <RatingComponent 
                    defaultRating = {defaultRating.difficultyGettingIn}
                    rating = {rating.difficultyGettingIn}
                    ratingHeading = "Difficulty Getting In"
                    ratingCase = "difficultyGettingIn"
                    noOfUsersUntilShowDefault = {this.state.noOfUsersUntilShowDefault}
                    isRunning = {this.state.isRunning}
                    businessData = {this.props.businessData}
                    currentVibe = {vibe}
                  /> 
                   <RatingComponent 
                    defaultRating = {defaultRating.genderBreakdown}
                    rating = {rating.genderBreakdown}
                    ratingHeading = "Gender Breakdown"
                    ratingCase = "genderBreakdown"
                    noOfUsersUntilShowDefault = {this.state.noOfUsersUntilShowDefault}
                    isRunning = {this.state.isRunning}
                    businessData = {this.props.businessData}
                    currentVibe = {vibe}
                  /> 
                   <RatingComponent 
                    defaultRating = {defaultRating.difficultyGettingIn}
                    rating = {rating.difficultyGettingIn}
                    ratingHeading = "Difficulty Getting a Drink"
                    ratingCase = "difficultyGettingADrink"
                    noOfUsersUntilShowDefault = {this.state.noOfUsersUntilShowDefault}
                    isRunning = {this.state.isRunning}
                    businessData = {this.props.businessData}
                    currentVibe = {vibe}
                  /> 
                </View>
                <View
                  style={[styles.divider, { marginBottom: 20 }]}
                />
                  <View style = {{ flex: 3 }}>
                    <TouchableOpacity
                      onPress = {()=> this.setState({ showPreviousWeekDayModal: true })}
                      style = {{ padding: 2, backgroundColor: 'red', paddingTop: 10, paddingLeft: 18, paddingRight: 18, paddingBottom: 10, borderRadius: 10, backgroundColor: "#eb3498"}}
                    >
                      <Text style = {{ color: 'white', textAlign: 'center', fontSize: 12, width: 100 }} >This Time Last Week</Text>
                    </TouchableOpacity>
                  </View>
                {/* {  
                  ! showRatingButton  &&
                    <View
                      style = {{ flex: 1, marginTop: 20}}
                    >
                      <Text style = {{ fontSize: 20, fontWeight: '600' }} >You cannot rate next until:</Text>
                      <CountDown
                        until={ untilNextRateInSeconds }
                        size={20}
                        digitStyle={{backgroundColor: '#FFF'}}
                        digitTxtStyle={{color: '#1CC625', padding: 0 }}
                        timeToShow={['M', 'S']}
                        timeLabels={{m: 'MM', s: 'SS'}}
                      />
                    </View>     
                } */}
                  { 
                    !this.getShowRatingButton() && <Text style = {{ color: 'red',textAlign: 'center' ,fontSize: 16, marginTop: 10 }} > You already rated this spot! Come back in an hour. </Text>
                  }
                   { 
                    !this.checkUserRatingAvailableDistance() && this.state.showDistanceRateText && <Text style = {{ color: 'red',textAlign: 'center' ,fontSize: 16, marginTop: 10 }} > You must be within 80 yards of this establishment to rate it. </Text>
                  }
                  
                    <View style = {{ flex:2,justifyContent: 'center',alignItems: 'center' ,borderWidth: 0, width: '100%', marginTop: 20}} >
                      <TouchableOpacity
                        style = { styles.activeRateButton  }
                        activeOpactity = {0.9}
                        onPress = {() => {
                          this.setState({ showDistanceRateText: true }) 
                          if(this.checkUserRatingAvailableDistance() && this.getShowRatingButton())
                            this.props.showRatingModal(true) 
                        }}
                      >
                        <Text 
                          style = {styles.activeRateButtonStyling} 
                        > 
                          Rate It! 
                        </Text>
                      </TouchableOpacity>
                    </View>
                  
                { showRatingModal && 
                  <RateModal  
                    rating = {this.state.rating}
                    vibe = {vibe} 
                    data = { businessData }
                    show = {showRatingModal}  
                    updateRating = {(rating)=>{  
                      this.setState({ rating })    
                    }}
                    onClose = {()=> { this.props.showRatingModal(false)  }}
                  />
                }
              </View>
            </ScrollView>
            
            { this.state.showTimings &&
                (<TimingModal 
                  timings = { !_.isEmpty(businessProfile) && businessProfile.opening_hours.weekday_text}
                  showTimings = { this.state.showTimings }
                  closeModal = {()=>{ this.setState({ showTimings: false }) }}
                />)
            }
            <View style={styles.spinnerContainer}>
              <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            </View>
          </View>       
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { vibe, user, category, business, component } = state
  return { 
    vibe: vibe,
    location: user.user.location,
    category: category.category.category,
    business,
    component
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    showRatingModal,
    showRatingButton
  }, dispatch)
);


export default connect(mapStateToProps, mapDispatchToProps)(ProfileModal);

class RateModal extends React.Component{

  constructor(props){
    super(props)
    this.state = {
      fun: 0,
      crowd:0,
      difficultyGettingDrink: 0,
      difficultyGettingIn: 0,
      girlToGuyRatio:0,
      spinner: false,
      showConfirmation: false,
      progress: 0
    }
  }

  ratingCompleted(rating) {
    console.log("Rating is: " + rating)
  }

  handleInputChange = (event)=>{
    const value = event.value;
    const name = event.name;
    console.log(`the value${value} and name is ${name}`)
    this.setState({
      [name]: value
    });
  }

  componentDidMount(){
    const { rating } = this.props
    this.setState({ 
      fun: rating.fun,
      crowd: rating.crowd,
      difficultyGettingDrink: rating.difficultyGettingDrink,
      difficultyGettingIn: rating.difficultyGettingIn,
      girlToGuyRatio: rating.girlToGuyRatio
    })
  }

  render(){
    return(
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle = "fullScreen"
          visible={this.props.show }
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        > 
          <ScrollView 
            style = {{ flex: 2} } 
            contentContainerStyle = {{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}  
          > 
            <View
              style = {{ flex: 1 }}
            >
                <ProgressionBar  />
            </View>
            <View style={styles.rateModal}>
              <View style = {{ flex:1, width: '100%', justifyContent: 'center', alignItems: 'center' }} >      
                <View
                  style = {{ flex: 1 }}
                >
                  <SurveyComponent                      
                    data = { this.props.data }
                  />   
                </View>
              </View>
              <Text style = {styles.surveyHeading} >Help others know what they are getting themselves into!</Text>
            </View>
          </ScrollView>
          <View style = {{ alignSelf : "flex-start", position: 'absolute', top: '5%', left: '5%' }}  >
            <TouchableOpacity
              onPress = {()=> {
                this.props.onClose()
              }}
            >
              <Icon 
                name="x"
                type = 'foundation'
                size = {30}
                color = "black"  
              />
            </TouchableOpacity>
          </View>
          <View style={styles.spinnerContainer}>
            <Spinner
              visible={this.state.spinner}
              textContent={'Loading...'}
              textStyle={styles.spinnerTextStyle}
            />
          </View>
        </Modal>
      </View>  
    )
  }

}

const styles = StyleSheet.create({
  activeRateButton: { 
    borderRadius: 6, 
    borderWidth:1,
    height: '100%', 
    width: '40%',
    backgroundColor: '#050505' 
  },
  disableRateButton: {
    borderRadius: 6, 
    borderWidth:0.3,
    borderColor: 'gray',
    height: '100%', 
    width: '40%',
    backgroundColor: '#e8e8e8'
  },
  activeRateButtonStyling: { 
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    paddingTop: 15, 
    paddingBottom: 15 
  },
  disableRateButtonStyling: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    fontWeight: '400',
    paddingTop: 15, 
    paddingBottom: 15 
  },
  sliderImageIcons:{ 
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding:3,
    paddingLeft: 5,
    paddingRight: 5 
  },
  ratingText: { 
    textAlign: 'center', 
    width: '30%',
    fontSize: 18,
    fontWeight: '600' 
  },
  heartIcon:{ 
    flex:1,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    top: "3%",
    right: "3%" 
  },
  surveyHeading: { 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "400",
    color: 'black',
    paddingLeft:10,
    paddingRight:10,
    marginTop: 30 
  },
  ratingLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: 'white'
  },
  ratingButtonToggle: {  
    padding: 10, 
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 150,
    minWidth: 150,
    minHeight: 40,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingComponent: {
    flex:1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  rateModal: {
    flex:3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  heading: {
    textAlign: 'left',
    width: '35%',
    fontSize: 14,
    fontWeight: '500'
  },
  starComponent: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15
  },
  container: {
    flex: 1
  },
  largeDescription: { 
    lineHeight: 24, 
    color: '#4F4E4E', 
    textAlign: 'left', 
    width: '90%', 
    fontWeight: '400' 
  },
  divider: {
    borderTopColor: 'gray',
    borderTopWidth: 0.5,
    width: "98%",
    marginTop: '4%',
    flex:1,
  },
  detailSection: { 
    flex:2, 
    flexDirection: 'row', 
    borderWidth:0, 
    marginTop: '5%' 
  },
  centeredView: {
    flex: 0,
    position: 'absolute',
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
    // justifyContent: "center",
    // alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "transparent",
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0,
    shadowRadius: 1,
    elevation: 5,
    flex:2
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 0,
    textAlign: "center",
    alignSelf: 'flex-start',
    fontSize: 22,
    fontWeight: '500', 
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
});

function TheTimingModalWrapper() {
  return (
    <View>
      <TimingModal isVisible={true}>
        <View style={{ flex: 1 }}>
          <Text>I am the modal content!</Text>
        </View>
      </TimingModal>
    </View>
  )
}

