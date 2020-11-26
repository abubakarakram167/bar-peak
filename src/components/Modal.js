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
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window')
import call from 'react-native-phone-call';
import { Rating, AirbnbRating } from 'react-native-elements';

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
    showRatingModal: true
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
  async componentDidMount(){
    const { item } = this.props;
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`;
    const {data} =  await axios.post(url);
    const photos = data.result.photos;
    const AllPhotos = photos.map((photo)=>{
      return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM`;
    })
    this.setState({ businessProfile: data.result, images: AllPhotos  })
  }

  render() {
    const { show } = this.props;
    const { businessProfile } = this.state;
    const { businessData } = this.props;
    const { rating } = businessData;
    const { vibe } = this.props.vibe.vibe;

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
                  images={this.state.images}
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
                
                <Text style={styles.modalText}>{businessProfile.name}</Text>
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
                  <View style = {{ flex:1 }} >
                    <Text style = {{ fontWeight: '300', color: 'gray' }} >5.0 ({  !_.isEmpty(businessProfile) && businessProfile.reviews.length })</Text>
                  </View>
                  <View
                    style = {{ flex: 5}}
                  >
                    <Text style = {{ alignSelf: 'center', fontSize: 14, textDecorationLine: 'underline' }}>{  !_.isEmpty(businessProfile) && this.getFormattedAddress(businessProfile.formatted_address) }</Text>
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

                <View style = {[styles.detailSection, { flex:2 }]} >
                  <View style = {{ flex: 2, borderWidth: 0 }} >
                    <Text 
                      style = {{ fontSize: 18, textAlign: 'left', fontWeight: '500' }}
                    > 
                    { businessData.shortDescription } 
                    </Text>
                  </View>
                  <View
                    style = {{ flex: 1, alignItems: 'flex-end' }}
                  >
                    <Image 
                      source = {{uri: businessProfile.icon}}
                      style = {{ height: 30, width: 40, position: 'relative', bottom: 7 }}
                    />
                  </View>
                </View>
                <View
                  style={styles.divider}
                />
                { !_.isEmpty(businessProfile) && businessProfile.types.map((type)=>{
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
                <View style = {[styles.detailSection, { flex: 2 }]} >  
                  <View style = {{ flex: 1 }} >
                    <Text 
                      style = {styles.largeDescription}
                    >
                        { businessData.longDescription } 
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style = {{ borderRadius: 10, marginTop: '5%', borderWidth:1, width: '100%' }}
                  onPress = {() => {  
                    const args = {
                      number: "4824789274892",
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
                    <Text style = {styles.heading } >Crowdy:</Text>
                    <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={2}
                      starSize={15}
                      starStyle = {{ color: 'orange' }}
                    />
                    <Text>10/6</Text>
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading } >Fun Factor:</Text>
                    <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={4}
                      starSize={15}
                      starStyle = {{ color: 'green' }}
                    />
                    <Text>10/8</Text>
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }  >Girl to Guy Ratio:</Text>
                    <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={2}
                      starSize={15}
                      starStyle = {{ color: 'orange' }}
                    />
                    <Text>10/6</Text>
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }  >Difficulty Getting in:</Text>
                    <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={2}
                      starSize={15}
                      starStyle = {{ color: 'red' }}
                    />
                    <Text>10/3</Text>
                  </View>
                  <View 
                    style = {styles.starComponent} 
                  >
                    <Text style = {styles.heading }  >Difficulty Getting a Drink:</Text>
                    <StarRatings
                      disable={true}
                      maxStars={5}
                      rating={2}
                      starSize={15}
                      starStyle = {{ color: 'orange' }}
                    />
                    <Text>10/5</Text>
                  </View>        
                </View>
                
                <View
                  style={[styles.divider, { marginBottom: 20 }]}
                />
                <View style = {{ flex:2,justifyContent: 'center',alignItems: 'center' ,borderWidth: 0, width: '100%', marginTop: 20}} >
                  <TouchableOpacity
                      style = {{ borderRadius: 6, borderWidth:1,height: '100%', width: '40%',backgroundColor: '#E56060' }}
                      onPress = {() => {  
                        this.setState({ showRatingModal: true })
                      }}
                    >
                      <Text style = {{ textAlign: 'center', fontSize: 12,color: 'white', fontWeight: '700',paddingTop: 18, paddingBottom: 18 }} > Rate It! </Text>
                    </TouchableOpacity>
                </View>
                { this.state.showRatingModal && 
                  <RateModal  
                    closeModal = {()=>{ 
                      this.setState({ showRatingModal: false }) 
                      console.log("the pressing")
                    }}
                    rating = {rating}
                    vibe = {vibe} 
                    data = { businessData }
                    show = {this.state.showRatingModal}  
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
                      <StarRatings
                        disable={true}
                        maxStars={1}
                        rating={2}
                        starSize={15}
                        starStyle = {{ color: 'red' }}
                      />
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
              </View>
            </View> 
          </View>       
        </Modal>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { vibe} = state
  return { 
    vibe: vibe
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
        girlToGuyRatio:0
      
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
    const { rating } = this.props;
    console.log("the rating with props", rating);
    this.setState({ 
      fun: rating.fun,
      crowd: rating.crowd,
      difficultyGettingDrink: rating.difficultyGettingDrink,
      difficultyGettingIn: rating.difficultyGettingIn,
      girlToGuyRatio: rating.girlToGuyRatio
    })
  }

  saveRating = () => {
    const {
      fun,
      crowd,
      difficultyGettingDrink,
      difficultyGettingIn,
      girlToGuyRatio
    } = this.state;
    console.log("the rating", fun);
  }

  render(){
    const {
      fun,
      crowd,
      difficultyGettingDrink,
      difficultyGettingIn,
      girlToGuyRatio
    } = this.state;
    console.log("vibe", this.props.vibe);
    return(
      <View style={styles.centeredView}>
        <Modal
          animationType="fade"
          transparent={true}
          presentationStyle = "fullScreen"
          visible={this.props.show}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <ScrollView 
            style = {{ flex: 1} } 
            contentContainerStyle = {{ justifyContent: 'center', alignItems: 'center', paddingVertical: 50 }}  
          >
            <View style={styles.rateModal}>
              <Text style = {{ fontSize: 16, textAlign: 'center', paddingLeft:10, paddingRight:10 }} >Please submit this seriously to help us imrove more next time.Thanks!</Text>
              <View style = {{ flex:1, width: '100%', justifyContent: 'center', alignItems: 'center' }} >
                <View 
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
                </View>
                <View 
                  style = {styles.ratingComponent} 
                >
                  <Text style = { styles.ratingText } >Crowdy:</Text>
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
                  <Text style = { styles.ratingText } >Difficulty Getting Drink:</Text>
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
                  <Text style = { styles.ratingText }  >Difficulty Getting In:</Text>
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
                </View>
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
  }
  ,
  ratingComponent: {
    flex:1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  rateModal: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40
  },
  heading: {
    textAlign: 'left',
    width: '30%'
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
    
  }
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

