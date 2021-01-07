// Screen1.js
import React from 'react'                                       
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native' 
import MyFavouritesTile from '../components/MyfavouriteTile';
import { connect } from 'react-redux';

class MyFavourites extends React.Component {

  getBusinessCategories = (category) => {
    return category.map(category => {
      return category.type;
    })
  }
  getBusinessCategoriesId = (category) => {
    return category.map(category => {
      return category._id;
    })
  }  

  getTotalCategoryFavourites = (singleCategory) => {
    const { favouriteEstablishments } = this.props;
    
      if(singleCategory.title === "Bar"){
        return favouriteEstablishments.filter((business)=>{ 
          return this.getBusinessCategories(business.category).includes("sub_bar")         
        })
      }
      else{
        return favouriteEstablishments.filter((business)=>{ 
          return this.getBusinessCategoriesId(business.category).includes(singleCategory._id)         
        })
      }
    
  }

  render(){
    const { navigation, category, favouriteEstablishments } = this.props;
    console.log("here the favourite establishments", favouriteEstablishments);
    return(
      <View style={styles.screen}>
        <View
          style = {{ flex:1, justifyContent: 'center' }}
        >
          <Text
            style = { styles.favouritesText }
          >
            Favourites
          </Text>
        </View>
        <View
          style = {{ flex: 3 }}
        >
          <ScrollView>
            { 
              category.map((category)=>{
                if(category.type === "main_category")
                  return (
                    <TouchableOpacity
                      onPress = {()=> { 
                        navigation.navigate("SpecificCategoryFavourites",{ 
                          categoryFavourite: this.getTotalCategoryFavourites(category),
                          category: category 
                        })
                      }}
                    >
                      <MyFavouritesTile 
                        key = {category._id}
                        category = {category}
                        totalFavourites = { this.getTotalCategoryFavourites(category).length } 
                      />   
                    </TouchableOpacity>  
                  )
              })
            }
          </ScrollView>    
        </View>
       
        
      </View>
    )
  }
}             

const mapStateToProps = (state) => {
  const { category, business} = state
  return { 
    category: category.category.category,
    favouriteEstablishments: business.business.favouriteBusiness
  }
};


export default connect(mapStateToProps, null)(MyFavourites);

const styles = StyleSheet.create({  
  screen:{ 
    flex:1, 
    backgroundColor: 'white',
    height: "100%"
  },
  favouritesText: {
    color: "black",
    fontSize: 30,
    marginLeft: "5%",
    fontWeight: "500"
  },
  favouriteTile: {
    flex: 1,
    flexDirection: 'row'
  },
  completeTile : {
    flex: 1
  }
                                                                   
})