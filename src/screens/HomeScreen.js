import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    Platform,
    StatusBar,
    ScrollView,
    Image,
    Dimensions,
    Animated,
    FlatList,
    TouchableOpacity,
    ActivityIndicator 
} from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from 'react-native-indicators';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons'
import Category from '../../screens/components/Category'
import Home from '../../screens/components/Home'
import Tag from '../../screens/components/Tag'
import {getAllBusiness} from '../../redux/actions/Business';
import {getfilteredBusiness} from '../../redux/actions/Business';
import {getVibe} from '../../redux/actions/Vibe';
import {emptyBusiness} from '../../redux/actions/Business';
import { getAllCategories } from '../../redux/actions/Category';
import { setUserLocation } from '../../redux/actions/User';
import { removeStorageItem } from '../components/localStorage'; 
import * as Location from 'expo-location';
import ShowPopupModal from '../components/popUpModal';
import _, { map } from 'underscore';
import Modal from '../components/Modal';
import Spinner from 'react-native-loading-spinner-overlay';

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
      spinner: false
    }
  }

  async componentDidMount(){
    await this.props.emptyBusiness()
    this.setState({ spinner: true })
    const [location, getBusiness, getVibe] = await Promise.all([this.getCurrentLocation(), this.props.getAllBusiness(), this.props.getVibe()]) 
    const { coords } = location;
    await this.props.setUserLocation(coords);
    setTimeout(()=> {  
      this.setState({ spinner: false })
    }, 2000)
    const isVibeEmpty = _.isEmpty(getVibe);  
    if(isVibeEmpty)
      this.setState({ showModal: true })    
    await this.props.getfilteredBusiness(null);
    await this.props.getAllCategories();
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

  getCurrentLocation = async() => {
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced
    });
    return location;
  }
    
  componentWillMount() {
    this.scrollY = new Animated.Value(0)

    this.startHeaderHeight = 80
    this.endHeaderHeight = 50
    if (Platform.OS == 'android') {
        this.startHeaderHeight = 100 + StatusBar.currentHeight
        this.endHeaderHeight = 70 + StatusBar.currentHeight
    }

    this.animatedHeaderHeight = this.scrollY.interpolate({
        inputRange: [120, 250],
        outputRange: [this.startHeaderHeight, this.endHeaderHeight],
        extrapolate: 'clamp'
    })

    this.animatedOpacity = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [0, 10],
        extrapolate: 'clamp'
    })
    this.animatedTagTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [-30, 10],
        extrapolate: 'clamp'
    })
    this.animatedMarginTop = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [50, 30],
        extrapolate: 'clamp'
    })
  }

    render() {
      const { navigation } = this.props;
      const { filterBusinesses } = this.props.business.business;
      console.log("the filer Business", filterBusinesses)
      const { vibe } = this.props.vibe.vibe;
      const { category } = this.props.category.category;
      const { user } = this.props.user.user;
      const mainCategories = category.length>0 && category.filter(category => category.type === "main_category")
      
      // console.log("the user in Home screen", user);
      // console.log("caliing ", filterBusinesses);
        return (
          <SafeAreaView style = {{ flex: 1 }} >
            <View style={{ flex: 1 }}>
                <Animated.View style={{ height: this.animatedHeaderHeight, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#dddddd' }}>
                    <View style={{
                      flexDirection: 'row', 
                      padding: 10,
                      backgroundColor: 'white',
                      marginHorizontal: '10%',
                      shadowOffset: { width: 0, height: 0 },
                      shadowColor: 'black',
                      shadowOpacity: 0.2,
                      elevation: 1,
                      marginTop: Platform.OS == 'android' ? 30 : 0,
                      justifyContent: 'center',
                      width: '80%',
                      borderRadius: 20,
                      borderWidth: 1

                    }}>
                      <Icon name="ios-search" size={20} style={{ color: 'red',flex: 2, textAlign: 'right', marginRight: 10 }} />
                      <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Where you want to go?"
                        placeholderTextColor="grey"
                        style={{ flex: 6, fontWeight: '700', backgroundColor: 'white', textAlign: 'left' }}
                      />
                    </View>
                    <Animated.View
                        style={{ flexDirection: 'row', marginHorizontal: 20, position: 'relative', top: this.animatedTagTop, opacity: this.animatedOpacity }}
                    >
                        <Tag name="Guests" />
                        <Tag name="Dates" />

                    </Animated.View>
                </Animated.View>
                <ScrollView
                  scrollEventThrottle={16}
                  style = {{flex: 1}}
                  onScroll={Animated.event(
                      [
                          { nativeEvent: { contentOffset: { y: this.scrollY } } }
                      ]
                  )}
                > 
                  <Animated.View
                    style={{  marginHorizontal: 0, position: 'relative', top: this.animatedTagTop, opacity: this.animatedOpacity }}
                  >   
                    <View style={{ marginTop: 0, paddingHorizontal: 0 }}>
                      {/* <Text style={{ fontSize: 24, fontWeight: '700' }}>
                          Introducing Airbnb Plus
                      </Text>
                      <Text style={{ fontWeight: '100', marginTop: 10 }}>
                          A new selection of homes verified for quality & comfort
                      </Text> */}
                      <View style={{ position: 'relative', width: width , height: height * 0.4, marginTop: 20 }}>
                        <Image
                          style={styles.homeLogo}
                          source={{ uri: "https://media-cdn.tripadvisor.com/media/photo-s/1a/cc/fb/33/downtown-room-a-la-carte.jpg"  }}
                        />
                        <View style = {styles.ImageButton} >
                          <Text
                            style = {{ fontSize:50,fontWeight: '700' ,color: 'white' }}
                          >
                            Go {'\n'}
                            Near 
                          </Text>
                          <View style  = {{ borderRadius:10, borderWidth:1 , backgroundColor: 'white'}} >
                            <TouchableOpacity 
                              onPress = {()=> navigation.navigate('MapScreen',{
                                businessData: filterBusinesses.goodSpots,
                                showGreen:true
                              })} 
                            > 
                              <Text
                                style = {{ textAlign: 'center' ,paddingLeft: 18, paddingRight: 18 ,paddingTop:8, paddingBottom:8, fontSize:14, fontWeight: '600'}} 
                              >
                                Explore Nearby 
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>
                  </Animated.View>
                    { this.state.spinner &&
                    <View style={[styles.spinnerContainer, styles.overlaycontainer]}>
                      {/* <Spinner
                        visible={this.state.spinner}
                        textStyle={styles.spinnerTextStyle}
                        animation = {"fade"}
                        color = "gray"
                      /> */}
                      <SkypeIndicator animationDuration = {1000} style = {{ zIndex:10 }} color='#e31743' size = {100} />
                    </View>
                    }             
                  <View style={{ marginTop: 40 }}>
                    <View style = {{ flex: 1, flexDirection: 'row' }} >
                      <View style = {{flex: 4}} >
                        <Text style={{ fontSize: 20, fontWeight: '700', paddingHorizontal: 20 }}>
                          Your Vibe's  <Text style ={{ fontSize: 10 }} >({ vibe.crowdedPlace ? "Crowded" : "UnCrowdy" }, { vibe.nightLife? "nightLife": "barAndRestaurants"} )</Text> 
                        </Text>
                      </View>
                      <View style = {{flex: 2 , alignSelf: 'center', justifyContent: 'flex-end' }} >
                        <TouchableOpacity 
                          onPress = {()=> navigation.navigate('MapScreen',{
                            businessData: filterBusinesses.goodSpots,
                            showGreen:true
                           })} 
                        >
                          <Text >
                            View on Maps
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    { filterBusinesses.goodSpots ?
                      <View style={{ marginLeft:15, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>      
                        <FlatList
                          data={ filterBusinesses.goodSpots }
                          renderItem={({item}) => {
                          //  console.log("the render item", item);
                            return(
                              <TouchableOpacity
                                onPress = {()=>{ 
                                 this.selectSpecificBusiness(item)
                                }}
                              >
                                <Home 
                                  width={width}
                                  height= {height}
                                  item = {item}
                                />
                              </TouchableOpacity>
                            );
                          }}
                          showsHorizontalScrollIndicator = {false}
                          horizontal = {true}
                          keyExtractor={item => item.place_id}
                        />                       
                      </View> :
                      <View style={{ position: 'absolute', top:"60%",right: 0, left: 0 }}>
                        <ActivityIndicator animating={true} size="small" color="black" />
                      </View>
                    }
                  </View>
                  <View style={{ marginTop: 20 }}>
                    <View style = {{ flex: 1, flexDirection: 'row' }} >
                      <View style = {{flex: 4}} >
                        <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                         Unvibe <Text style ={{ fontSize: 10 }} >({ !vibe.crowdedPlace ? "Crowded" : "UnCrowdy" } { vibe.nightLife? "nightLife": "barAndRestaurants"} )</Text> 
                        </Text>
                      </View>
                      <View style = {{flex: 2 , alignSelf: 'center', justifyContent: 'flex-end' }} >
                        <TouchableOpacity onPress = {()=> navigation.navigate('MapScreen',{
                          businessData: filterBusinesses.badSpots,
                          showGreen: false
                        })} >
                          <Text >
                            View on Maps
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    { filterBusinesses.badSpots ? 
                      <View style={{ marginLeft:15, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>      
                        <FlatList
                          data={ filterBusinesses.badSpots }
                          renderItem={({item}) => {
                            return(
                              <TouchableOpacity
                                onPress = {()=>{ 
                                this.selectSpecificBusiness(item)
                                }}
                              >
                                <Home 
                                  width={width}
                                  height= {height}
                                  item = {item}
                                />
                              </TouchableOpacity>
                            );
                          }}
                          showsHorizontalScrollIndicator = {false}
                          horizontal = {true}
                          keyExtractor={item => item.place_id}
                        />                       
                      </View> :
                    <View style={{ position: 'absolute', top:"60%",right: 0, left: 0 }}>
                      <ActivityIndicator animating={true} size="small" color="black" />
                    </View>
                    }
                  </View>  
                  <View style={{  paddingTop: 20 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', paddingHorizontal: 18 }}>
                      What can we help you find, {user.firstName}
                    </Text>
                    <View style={{ marginTop: 15}}>    
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                        style = {{ marginLeft:20, borderWidth: 0 }}
                      >          
                        { mainCategories && mainCategories.map(category => {
                          return(
                            <TouchableOpacity
                              onPress = {()=>{ this.getBusinessByCategory(category.title) }}
                            >
                              <Category 
                                imageUri={category.imageUrl}
                                name= {category.title}
                                width={width}
                                height= {height}
                              />
                            </TouchableOpacity>
                          )})
                        }               
                      </ScrollView>
                    </View>
                  </View>
                </ScrollView>
                { this.state.showModal &&  <ShowPopupModal  closeModal = {()=> this.setState({ showModal: false })} navigation = {this.props.navigation} /> } 
                { this.state.showProfileModal && <Modal  item  = {this.state.selectedItem}  businessData = {this.state.selectedBusiness}  show = {this.state.showProfileModal} closeModal = {()=> { this.setState({ showProfileModal: false }) }} />  }   
                              
            </View>
          </SafeAreaView>    
        );
    }
}
const mapStateToProps = (state) => {
  const { business, vibe, user, category } = state
  return { 
    business: business,
    vibe: vibe,
    category,
    user
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getAllBusiness,
    getfilteredBusiness,
    getVibe,
    emptyBusiness,
    getAllCategories,
    setUserLocation
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
  
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
    position: 'absolute',
    top: '15%',
    left: '35%'
  },
  overlaycontainer:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity:0.4,
    justifyContent:"center",
    alignItems:"center",
    zIndex: 3 
  }
});