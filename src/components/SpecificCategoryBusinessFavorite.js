// Screen1.js
import React from 'react'                                       
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import StarRatings from 'react-native-star-rating'
import { Icon } from 'react-native-elements'; 
const { width, height } = Dimensions.get("window");
import { SliderBox } from "react-native-image-slider-box";

class MyFavouritesTile extends React.Component {

  render(){
    const { establishment } = this.props;
    const rating = establishment.customBusiness ? establishment.customData.rating : establishment.googleBusiness.rating;
    const address = establishment.customBusiness ? establishment.customData.address : establishment.googleBusiness.formatted_address;

    return(  
      <View
        style = { styles.completeTile }
      >
        <View
          style = {styles.favouriteTile}
        >
          <SliderBox               
            images={establishment.uploadedPhotos.map(photo => photo.secure_url)}
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
            ImageComponentStyle={{borderRadius: 5, borderWidth: 1 ,width: width* 0.9, height: height * 0.3 ,marginTop: 5, marginRight:0}}
            imageLoadingColor="#2196F3"
          /> 
        </View>
        <View style = {styles.heartIcon}  >
          <TouchableOpacity
            onPress = {()=> {
              this.addToFavourites()
            }}
          >
            <Icon
              name="heart"
              type = 'foundation'
              size = {30}
              color = "#e6564e"
              style = {styles.sliderImageIcons}
            />
          </TouchableOpacity>
        </View>
        <View
          style = {styles.bottomContainer}
        >
          <View style = {{ flex:1, alignItems : 'center', flexDirection: 'row', marginTop: 15 }} >  
            <StarRatings
              disable={true}
              maxStars={1}
              rating={2}
              starSize={15}
              starStyle = {{ color: 'red' }}
            />
            <Text
              style = {{ marginLeft: 5 }}
            >{rating}<Text style = {{ color: 'gray' }} >(5)</Text></Text>
          </View>
          <Text style = {styles.categoryTitle} >{ establishment.name }</Text>
          <Text style = {styles.businessAddress} >{ address}</Text>
        </View>
      </View>
    )
  }
}             

export default MyFavouritesTile

const styles = StyleSheet.create({
  businessAddress: {
    marginTop: 10,
    marginLeft: 0,
    fontWeight: '300',
    fontSize: 14
  },  
  sliderImages:{ 
    flex:1, 
    borderWidth: 0,
    borderRadius: 0
  },
  categoryTitle: { 
    marginTop: 10,
    marginLeft: 0,
    fontWeight: '400',
    fontSize: 18
  },
  bottomContainer:{ 
    flex:1,
    backgroundColor: "white",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10 
  },
  screen:{ 
    flex:1, 
    display: 'flex',
    backgroundColor: 'white',
  },
  favouritesText: {
    color: "black",
    fontSize: 30,
    marginLeft: "5%",
    fontWeight: "500"
  },
  favouriteTile: {
    flex: 5,
    alignSelf: 'center'
  },
  completeTile : {
    flex: 1,
    marginBottom: 30,
    width: width * 0.9,
    marginLeft: 0,
    borderWidth: 0,
    borderRadius: 10,
    minHeight: 300,
    alignSelf: 'center'
  },
  heartIcon:{ 
    flex:1,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    top: "3%",
    right: "3%" 
  }
                                                                   
})