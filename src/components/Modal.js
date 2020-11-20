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
import { SliderBox } from "react-native-image-slider-box";
import axios  from '../api/axios';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating'
import _, { map } from 'underscore';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
const { height, width } = Dimensions.get('window')
import call from 'react-native-phone-call';
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
    images: []
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  getFormattedAddress = (address) => {
    const newAddress = address.split(',');
    return newAddress[1] + ',' + newAddress[2] + ',' +  newAddress[3]; 
  }

  getIconName = (icons) => {
    console.log("the icons", icons)
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
    console.log("business data", businessProfile.types);
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
                  dotColor="#FFEE58"
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
                    color = "gray"  
                  />
                </TouchableOpacity>
              </View>
              <View style={[styles.modalView]}>
                
                <Text style={styles.modalText}>{businessProfile.name}</Text>
                <View 
                  style = {styles.detailSection} 
                >
                  <View style = {{ flex:1, alignItems : 'flex-start' }} >  
                    <StarRating
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
                      skjhfdks slkjdfklsj skldjfklsdf skljdfnsjkldf slkdfnskljdf slkdfjks slkdjfklsdj sjkfdh skjdhfkjshf skjfnkjsfn skjfnjksfnd skjdfnjks
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
              </View>
            </ScrollView> 
          </View>
         
        </Modal>
        

        {/* <TouchableHighlight
          style={styles.openButton}
          onPress={() => {
            this.setModalVisible(true);
          }}
        >
          <Text style={styles.textStyle}>Show Modal</Text>
        </TouchableHighlight> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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

export default ProfileModal;