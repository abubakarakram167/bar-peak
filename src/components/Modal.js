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
  TouchableOpacity
} from "react-native";
import { SliderBox } from "react-native-image-slider-box";
import axios  from '../api/axios';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating'
import _, { map } from 'underscore';

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
    console.log("business Profile", businessProfile);
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
             <View style = {{ top: '2%',width: '100%' ,position: 'relative',flex:1, borderWidth: 0, alignSelf: 'center', borderRadius: 10, borderWidth: 1 }} >
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
                ImageComponentStyle={{borderRadius: 15, borderWidth: 1 ,width: '100%', height: 500,marginTop: 5}}
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
                style = {{ flex:1, flexDirection: 'row', borderWidth:0, marginTop: '5%' }} 
              >
                <View style = {{ flex:1, alignItems : 'center' }} >  
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
              <View style = {{ flex:12 }} >
                <Text>asda</Text>
              </View>
              
            </View>
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
  centeredView: {
    flex: 1,
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
    fontWeight: '500'
  }
});

export default ProfileModal;