import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";
import StarRating from 'react-native-star-rating'
class Home extends Component { 
  
  renderDollar = (priceLevel) => {
    let dollar = '';
    for(let i=0 ; i< priceLevel; i++){
      dollar = dollar + '$'; 
    }
    return dollar;
  }

  render() {
    const { item } = this.props
    return (
      <View style={[styles.businessItem, {  width: this.props.width * 0.65, height: this.props.height * 0.4 }]}>
        <View style={{ flex: 1 }}>
          <Image
            style={styles.businessImage}
            source={ { uri: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ item.photos[0].photo_reference}&key=AIzaSyD9CLs9poEBtI_4CHd5Y8cSHklQPoCi6NM` } } 
          />
        </View>
        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 10, paddingTop: 10 }}>
          <StarRating
            disable={true}
            maxStars={5}
            rating={item.rating}
            starSize={10}
            starStyle = {{ color:'#ffbf00' }}
          />
          <Text style={[{ fontSize: 20, color: '#b63838' }, styles.textInfo]}>{item.types[0]}</Text>
          <Text style={[{ fontSize: 16, fontWeight: 'bold' }, styles.textInfo]}>{item.name}</Text>
          <Text style={[{ fontSize: 12 }, styles.textInfo]}>{item.price_level>0 ?  this.renderDollar(item.price_level) : "Price not available" }</Text>
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
    marginTop: 3,
    marginBottom: 3
  }
  ,
  businessItem: { 
    marginLeft: 10, 
    borderColor: '#dddddd',
  }
});