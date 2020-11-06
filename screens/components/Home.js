import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import StarRating from 'react-native-star-rating'
class Home extends Component { 
  
  
  render() {
    const { item } = this.props
    console.log("photorefernece", item.photo_reference)
    return (
      <View style={[styles.businessItem, {  width: this.props.width * 0.65, height: this.props.height * 0.4 }]}>
        <View style={{ flex: 1 }}>
          <Image
            style={styles.businessImage}
            source={ { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${item.photos[0].photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM` } } 
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10 }}>
          <StarRating
            disable={true}
            maxStars={5}
            rating={item.rating}
            starSize={10}
          />
          <Text style={[{ fontSize: 20, color: '#b63838' }, styles.textInfo]}>{item.types[0]}</Text>
          <Text style={[{ fontSize: 16, fontWeight: 'bold' }, styles.textInfo]}>{item.name}</Text>
          <Text style={[{ fontSize: 10 }, styles.textInfo]}>{this.props.price}$</Text>
        </View>
      </View>
    );
  }
}
export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  businessImage:{
    flex: 1, 
    width: null, 
    height: null, 
    resizeMode: 'cover',
    borderRadius: 8,
    borderWidth:1 
  },
  textInfo: {
    marginTop: 5,
    marginBottom: 5
  }
  ,
  businessItem: { 
    marginLeft: 10, 
    borderWidth: 0.5, 
    borderColor: '#dddddd',
  }
});