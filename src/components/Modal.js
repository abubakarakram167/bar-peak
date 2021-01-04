import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking
} from "react-native";
import { connect } from 'react-redux';
import { SliderBox } from "react-native-image-slider-box";
import TimingModal from './TimingModal';
import axios  from '../api/axios';
import { Icon } from 'react-native-elements';
import StarRatings from 'react-native-star-rating'
import _, { map } from 'underscore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window')
import call from 'react-native-phone-call';
import { Rating, AirbnbRating } from 'react-native-elements';
import { getUserData } from './localStorage'; 
import Spinner from 'react-native-loading-spinner-overlay';
import AlertComponent from './AlertComponent';
import ProgressionBar from './ProgressionBar';
import haversine from 'haversine-distance';

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
    spinner: false
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  getFormattedAddress = (address) => {
    const newAddress = address.split(',');
    return newAddress[1] + ',' + newAddress[2] + ',' +  newAddress[3]; 
  }

  getIconName = (icons) => {
    const data =  iconsList.filter((icon) => icon.type === icons)[0]
    return data ? data.iconName : ''
  
  }

  getBusinessRating = async (placeId) =>{
    console.log("placeId", placeId)
    const body = {
      query:`
      query{
      getSingleBusiness(placeId: "${placeId}"){
        rating{
          fun,
          crowd,
          girlToGuyRatio,
          difficultyGettingIn,
          difficultyGettingDrink
        }
      }}
      `
  }
  try{  
    const res = await axios.post(`graphql?`,body);
    this.setState( { rating: res.data.data.getSingleBusiness.rating } )
    // console.log("the response in business", res.data.data.getSingleBusiness);
    
  }catch(err){
    console.log("hte errorsss", err.response.data)
  }
  } 

  async componentDidMount(){
    // const { businessData } = this.props;
    // console.log("the business Data", businessData)
    // const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`;
    // const {data} =  await axios.post(url);
    // const photos = data.result.photos;
    // const { placeId } = this.props.businessData;
    // this.getBusinessRating(placeId)
    // // this.setState({ rating })
    // const AllPhotos = photos.map((photo)=>{
    //   return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`;
    // })
    // this.setState({ businessProfile: data.result, images: AllPhotos  })
  }
  getRatingCase = (ratingCase, value) => {
    console.log(`the rating case ${ratingCase} and value is ${value}`)
    if(ratingCase === "crowd"){
      if(value >= 0 && value <= 0.9)
        return "Dead";
      else if (value >= 1 && value <= 1.9)
        return "Some People";
      else if (value >= 2 && value <= 2.9)
        return "Decent Level of Crowd";
      else if(value >= 3 && value <= 3.9)
        return "Getting Pretty Crowded";
      else if(value >= 4 && value <= 5)
        return "Packed-in Like Sardines";
    }
    else if(ratingCase === "fun"){
      if(value >= 0 && value <= 0.9)
        return "Not Fun";
      else if (value >= 1 && value <= 1.9)
        return "Sort Of Fun";
      else if (value >= 2 && value <= 2.9)
        return "Decent";
      else if(value >= 3 && value <= 3.9)
        return "Very Fun";
      else if(value >= 4 && value <= 5)
        return "All Time";
    }
    else if(ratingCase === "difficultyGettingIn"){
      if(value >= 0 && value <= 0.9)
        return "No Problem ";
      else if (value >= 1 && value <= 1.9)
        return "Less than 5-minute wait";
      else if (value >= 2 && value <= 2.9)
        return "5 - 15-Minute Wait";
      else if(value >= 3 && value <= 3.9)
        return "15 - 30-Minute Wait";
      else if(value >= 4 && value <= 5)
        return "Over 30-Minute Wait ";
    }
    else if(ratingCase === 'genderBreakdown'){
      if(value >= 0 && value <= 0.9)
        return "Equal Girls and Guys";
      else if (value >= 1 && value <= 1.9)
        return "More Guys than Girls";
      else if (value >= 2 && value <= 3)
        return "More Girls than Guys";
    }
    else if(ratingCase === "difficultyGettingADrink"){
      if(value >= 0 && value <= 0.9)
        return "No Problem";
      else if (value >= 1 && value <= 1.9)
        return "A Little Slow";
      else if (value >= 2 && value <= 3)
        return "Starting to Get Annoying";
      else if (value >= 3.1 && value <= 4)
        return "Forget About It";
    }
  }

  getCaseColor = (value) => {
    if(value>= 0.1 && value <=5)
      return "red";
    else if(value>= 5.1 && value <=7)  
      return "orange";
    else if(value>= 7.1 && value <=10)
      return "green";  
  }
  getVibeCaseColor = (ratingCase, value) => {
    const { vibe } = this.props.vibe.vibe;
    if(ratingCase === "crowdy"){
      if(vibe.crowdedPlace){
        if(value>=0 && value<=2)
          return "#ed4928"
        else if (value >=3 && value <= 5)
          return "#14a843"  
      }
      else{
        if(value>=0 && value<=2)
          return "#14a843"
        else if (value >=3 && value <= 5)
          return "#ed4928" 
      }
      return "#d5db16";
    }
  }
  getMiles = (i) => {
    return i*0.000621371192;
  }

  checkUserRatingAvailableDistance = () => {
    const { businessData } = this.props;
    console.log("the user location", this.props.location);
    const { longitude, latitude } = businessData;
    var userLocation = { lat: parseFloat(this.props.location.latitude).toFixed(5) , lng: parseFloat(this.props.location.longitude).toFixed(5) }
    var destinationLocation = { lat: latitude.toFixed(5) , lng: longitude.toFixed(5)  };
    //For Testing
    // var destinationLocation = { lat: 31.45250, lng: 74.43324  };
    var DistanceInMiles  =  haversine(userLocation, destinationLocation).toFixed(2)
    console.log("the total distance distnce in meters", DistanceInMiles)
    if(DistanceInMiles>=80) return false;
    return true;
  }

  render() {
    const { show } = this.props;
    const { businessProfile } = this.state;
    const { businessData } = this.props;  
    const { vibe } = this.props.vibe.vibe;
    const { rating } = businessData
    const allPhotos = businessData.images.map((photo)=> photo.secure_url);
    console.log("the buseinesss data in modal", businessData);

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
                  ImageComponentStyle={{borderRadius: 15, borderWidth: 1 ,width: '100%', height: height * 0.3 ,marginTop: 5}}
                  imageLoadingColor="#2196F3"
                />
              </View> 
              <View style = {{ alignSelf : "flex-start", position: 'absolute', top: '3%', left: '5%' }}  >
                <TouchableOpacity
                  onPress = {()=> this.props.closeModal()}
                >
                  <Icon 
                    name="x"
                    type = 'foundation'
                    size = {20}
                    color = "white"  
                  />
                </TouchableOpacity>
              </View>
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
                    return (
                      <View style ={[{ borderWidth:0, width: '100%', marginTop: '8%' }]} >
                        <View style={{ flexDirection: 'row' }}>
                          <View style = {{ flex:1, borderWidth:0, paddingTop: '1%' }} >  
                            <FontAwesome5 name={this.getIconName(type)} light />
                          </View>
                          <View style ={ {flex: 6, alignItems: 'flex-start'}} >  
                            <Text style = {{ paddingTop: 2 }} >
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
                  <View style = {{ flex: 1, alignItems: 'flex-start', borderWidth:0 }} >
                    <Text style = {{ textAlign: 'left', borderWidth:0, fontSize: 18, marginBottom:15 }} >Rating</Text>
                  </View>
                  <View 
                    style = {[styles.starComponent, { marginTop:0 }]} 
                  >
                    <Text style = {styles.heading } > { vibe.crowdedPlace ? "Crowdy:" : "Quiet" } </Text>
                    <TouchableOpacity
                      style = {[styles.ratingButtonToggle, { backgroundColor: this.getVibeCaseColor('crowdy', 1.3)}]}
                    >
                      <Text style = {styles.ratingLabel} >{ this.getRatingCase("crowd", 1.3) }</Text>
                    </TouchableOpacity>
                    {/* <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={rating.crowd}
                      starSize={15}
                      starStyle = {{ color: this.getCaseColor(rating.crowd) }}
                    />
                    <Text>5/{rating.crowd}</Text> */}
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading } >Fun Factor:</Text>
                    <TouchableOpacity
                      style = {[styles.ratingButtonToggle, { backgroundColor: '#6fd3d6'}]}
                    >
                      <Text style = {styles.ratingLabel} >{ this.getRatingCase("fun", rating.fun) }</Text>
                    </TouchableOpacity>
                    {/* <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={rating.fun}
                      starSize={15}
                      starStyle = {{ color: this.getCaseColor(rating.fun) }}
                    /> */}
                    {/* <Text>5/{rating.fun && rating.fun.toFixed(1)}</Text> */}
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }  >GenderBreakdown:</Text>
                    <TouchableOpacity
                      style = {[styles.ratingButtonToggle, { backgroundColor: '#6fd3d6'}]}
                    >
                      <Text style = {styles.ratingLabel} >{ this.getRatingCase("genderBreakdown", rating.ratioInput) }</Text>
                    </TouchableOpacity>
                    {/* <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={ rating.ratioInput}
                      starSize={15}
                      starStyle = {{ color: this.getCaseColor(rating.ratioInput) }}
                    />
                    <Text>5/{rating.ratioInput && rating.ratioInput.toFixed(1)}</Text> */}
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }  > Difficulty Getting in: </Text>
                    <TouchableOpacity
                      style = {[styles.ratingButtonToggle, { backgroundColor: '#6fd3d6'}]}
                    >
                      <Text style = {styles.ratingLabel} >{ this.getRatingCase("difficultyGettingIn", rating.difficultyGettingIn) }</Text>
                    </TouchableOpacity>
                    {/* <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={rating.difficultyGettingIn}
                      starSize={15}
                      starStyle = {{ color: this.getCaseColor(rating.difficultyGettingIn) }}
                    />
                    <Text>5/{rating.difficultyGettingIn && rating.difficultyGettingIn.toFixed(1)}</Text> */}
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }>  {vibe.crowdedPlace ? "Difficulty Getting Drink:" : " Easy Getting Drink  "} </Text>
                    <TouchableOpacity
                      style = {[styles.ratingButtonToggle, { backgroundColor: '#6fd3d6'}]}
                    >
                      <Text style = {styles.ratingLabel} >{ this.getRatingCase("difficultyGettingADrink", rating.difficultyGettingDrink) }</Text>
                    </TouchableOpacity>
                    {/* <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={rating.difficultyGettingDrink}
                      starSize={15}
                      starStyle = {{ color: this.getCaseColor(rating.difficultyGettingDrink) }}
                    />
                    <Text>5/{rating.difficultyGettingDrink && rating.difficultyGettingDrink.toFixed(1)}</Text> */}
                  </View>        
                </View>
                
                <View
                  style={[styles.divider, { marginBottom: 20 }]}
                />
                {  this.checkUserRatingAvailableDistance() &&
                  (<View style = {{ flex:2,justifyContent: 'center',alignItems: 'center' ,borderWidth: 0, width: '100%', marginTop: 20}} >
                    <TouchableOpacity
                        style = {{ borderRadius: 6, borderWidth:1,height: '100%', width: '40%',backgroundColor: '#E56060' }}
                        onPress = {() => {  
                          this.setState({ showRatingModal: true })
                        }}
                      >
                        <Text style = {{ textAlign: 'center', fontSize: 12,color: 'white', fontWeight: '700',paddingTop: 18, paddingBottom: 18 }} > Rate It! </Text>
                    </TouchableOpacity>
                  </View>)
                }
                { this.state.showRatingModal && 
                  <RateModal  
                    closeModal = {()=>{ 
                      this.setState({ showRatingModal: false }) 
                      console.log("the pressing")
                    }}
                    rating = {this.state.rating}
                    vibe = {vibe} 
                    data = { businessData }
                    show = {this.state.showRatingModal}  
                    updateRating = {(rating)=>{  this.setState({ rating })    }}
                    
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
            <View style = {{ height: '8%', borderTopWidth: 1, borderTopColor: 'gray' }} >
              <View style = {{ flex:1, flexDirection: 'row' }} >
                <View style = {{ flex:2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }} >
                  <View style = {{ flex:1, alignItems : 'center' }} >  
                      {/* <StarRatings
                        disable={true}
                        maxStars={1}
                        rating={2}
                        starSize={15}
                        starStyle = {{ color: 'red' }}
                      /> */}
                  </View>
                  <View style = {{ flex:2 }} >
                    <Text style = {{ fontWeight: '300', color: 'gray' }} >5.0 ({  !_.isEmpty(businessProfile) && businessProfile.reviews.length })</Text>
                  </View>
                </View>
                <View style = {{ flex:1, justifyContent: 'center', marginBottom: 10 }} >
                  <TouchableOpacity
                    style = {{ borderRadius: 6, marginTop: '5%', borderWidth:1, width: '80%',backgroundColor: '#E56060' }}
                    onPress = {() => {  
                      this.setState({ showTimings: true })
                    }}
                  >
                    <Text style = {{ textAlign: 'center', fontSize: 12,color: 'white', fontWeight: '700',paddingTop: 8, paddingBottom: 8 }} > Timings </Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.spinnerContainer}>
                  <Spinner
                    visible={this.state.spinner}
                    textContent={'Loading...'}
                    textStyle={styles.spinnerTextStyle}
                  />
                </View>
              </View>
            </View> 
          </View>       
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { vibe, user } = state
  return { 
    vibe: vibe,
    location: user.user.location
  }
};


export default connect(mapStateToProps, null)(ProfileModal);

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
      showConfirmation: false
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
    console.log("the rating with props", rating);
    this.setState({ 
      fun: rating.fun,
      crowd: rating.crowd,
      difficultyGettingDrink: rating.difficultyGettingDrink,
      difficultyGettingIn: rating.difficultyGettingIn,
      girlToGuyRatio: rating.girlToGuyRatio
    })
  }

  saveRating = async() => {
    const { vibe } = this.props;
    this.setState({ spinner: true })
    let {
      fun,
      crowd,
      difficultyGettingDrink,
      difficultyGettingIn,
      girlToGuyRatio
    } = this.state;
    

    console.log("here", this.props)
    console.log("the vibe in save rating", vibe)
    if(!vibe.crowdedPlace){
      crowd =  10 - crowd;
      difficultyGettingDrink = 10 - difficultyGettingDrink;
      girlToGuyRatio = 10 - girlToGuyRatio;
    }
    const { token } = await getUserData();
    const { data } = this.props;
    console.log("place id", data.placeId);
    const body = {
        query:`
        mutation{
          addRating(rating:{
              fun: ${fun.toFixed(2)},
              crowd: ${crowd.toFixed(2)},
              girlToGuyRatio: ${girlToGuyRatio.toFixed(2)},
              difficultyGettingIn: ${difficultyGettingIn.toFixed(2)},
              difficultyGettingDrink: ${difficultyGettingDrink.toFixed(2)}    
          },
          businessId: "${data.placeId}"
          ){
              fun,
              crowd,
              girlToGuyRatio,
              difficultyGettingDrink,
              difficultyGettingIn
          }
        }
        `
    }
    try{  
      const res = await axios.post(`graphql?`,body,{ headers: {
        'Authorization': `Bearer ${token}`
      } });
      console.log("the response in Rating", res.data.data.addRating);
      this.props.updateRating(res.data.data.addRating);
      this.setState({ spinner: false, showConfirmation: true })
      this.props.closeModal()
    }catch(err){
      console.log("hte errorsss", err.response.data)
    }

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
                <ProgressionBar />
              </View>
            <View style={styles.rateModal}>
              <Text style = {{ fontSize: 16, textAlign: 'center', paddingLeft:10, paddingRight:10 }} >Please submit this seriously to help us imrove more next time.Thanks!</Text>
              <View style = {{ flex:1, width: '100%', justifyContent: 'center', alignItems: 'center' }} >
                {/* <View 
                  style = {styles.ratingComponent}  
                >
                  <Text style = { styles.ratingText } >Fun:</Text>
                  <Rating 
                    showRating 
                    fractions={0.1} 
                    startingValue={fun && fun}
                    imageSize = {25}
                    ratingCount = {10}
                    onFinishRating = {(rating)=>{ this.setState({ fun: rating }) }} 
                  />  
                </View> */}
                {/* <View 
                  style = {styles.ratingComponent} 
                >
                  <Text style = { styles.ratingText } >{ vibe.crowdedPlace ? "Crowdy:" : "Quiet" }</Text>
                  <Rating 
                    showRating 
                    fractions={0.1} 
                    startingValue={crowd && crowd}
                    imageSize = {25}
                    ratingCount = {10}
                    onFinishRating = {(rating)=>{ this.setState({ crowd: rating}) }} 
                  /> 
                </View>
                <View 
                  style = {styles.ratingComponent} 
                >
                  <Text style = { styles.ratingText } > {vibe.crowdedPlace ? "Difficulty Getting Drink:" : " Easy Getting Drink  "}</Text>
                  <Rating 
                    showRating 
                    fractions={0.1} 
                    startingValue={difficultyGettingDrink && difficultyGettingDrink}
                    imageSize = {25}
                    ratingCount = {10}
                    onFinishRating = {(rating)=>{ this.setState({ difficultyGettingDrink: rating }) }} 
                  /> 
                </View>
                <View 
                  style = {styles.ratingComponent} 
                >
                  <Text style = { styles.ratingText }  > Girl To Guy Ratio </Text>
                  <Rating 
                    showRating 
                    fractions={0.1} 
                    startingValue={girlToGuyRatio && girlToGuyRatio}
                    imageSize = {25}
                    ratingCount = {10}
                    onFinishRating = {(rating)=>{ this.setState({ girlToGuyRatio: rating })  }} 
                  /> 
                </View>
                <View 
                  style = {styles.ratingComponent} 
                >
                  <Text style = { styles.ratingText }  >{vibe.crowdedPlace ? "Difficulty Getting in:" : " Easy Getting In  "}</Text>
                  <Rating 
                    showRating 
                    fractions={0.1} 
                    startingValue={ difficultyGettingIn && difficultyGettingIn }
                    imageSize = {25}
                    ratingCount = {10}
                    onFinishRating = {(rating)=>{ this.setState({ difficultyGettingIn: rating})  }} 
                  /> 
                </View>
                <View style = {{ flex:1,justifyContent: 'center',alignItems: 'center' ,borderWidth: 0, width: '100%', marginTop: 20}} >
                  <TouchableOpacity
                      style = {{ borderRadius: 6, borderWidth:1,height: '100%', width: '40%',backgroundColor: '#E56060' }}
                      onPress = {() => {  
                        this.saveRating()
                      }}
                    >
                      <Text style = {{ textAlign: 'center', fontSize: 18,color: 'white', fontWeight: '700',paddingTop: 18, paddingBottom: 18,padding: 25 }} > Submit</Text>
                    </TouchableOpacity>
                </View> */}
              </View>
            </View>
          </ScrollView>
          <View style = {{ alignSelf : "flex-start", position: 'absolute', top: '5%', left: '5%' }}  >
            <TouchableOpacity
              onPress = {()=> {
                console.log("called")
                this.props.closeModal()
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
          { this.state.showConfirmation &&
          <AlertComponent closeModal = {()=>{ this.setState({ showConfirmation: false }) }} showError = {this.state.showConfirmation} message = "Rating Succesffully Submitted" />
          }
          </Modal>
      </View>  
    )
  }

}

const styles = StyleSheet.create({
  ratingText: { 
    textAlign: 'center', 
    width: '30%',
    fontSize: 18,
    fontWeight: '600' 
  },
  ratingLabel: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500'
  },
  ratingButtonToggle: {  
    padding: 10, 
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 150,
    minWidth: 150,
    minHeight: 50,
    textAlign: 'center',
    borderRadius: 10,
    borderWidth:3
  },
  ratingComponent: {
    flex:1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  rateModal: {
    flex:2,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  heading: {
    textAlign: 'left',
    width: '30%',
    fontSize: 20,
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

