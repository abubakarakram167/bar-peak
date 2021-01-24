// Screen1.js
import React from 'react'                                       
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions } from 'react-native' 
const { width, height } = Dimensions.get("window");

class MyFavouritesTile extends React.Component {

  render(){
    const { category, totalFavourites } = this.props;
  
    return(  
      <View
        style = { styles.completeTile }
      >
        <View
          style = {styles.favouriteTile}
        >
          <View
            style = {{flex:2 }}
          >
            <Image
              source = {{ uri: category.imageUrl }}
              style = {styles.imageStyle}
            />
          </View>
        </View>
        <View
          style = {styles.bottomContainer}
        >
          <Text style = {styles.categoryTitle} >{ category.title !== "Night Clubs" ? category.title + 's' : category.title }</Text>
          <Text style = {[styles.categoryTitle, { fontSize: 15 }]} > {totalFavourites}  Favorites</Text>
        </View>
      </View>
    )
  }
}             

export default MyFavouritesTile

const styles = StyleSheet.create({  
  categoryTitle: { 
    marginTop: 20,
    marginLeft: 20,
    fontWeight: '500',
    fontSize: 20 
  },
  bottomContainer:{ 
    flex:1,
    backgroundColor: "white",
    borderWidth: 1,
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
    flex: 10,
    flexDirection: 'row'
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
  imageStyle:{ 
    width: '100%',
    height: "100%" 
  }
                                                                   
})