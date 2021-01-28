// Screen1.js
import React from 'react'                                       
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native' 
import CategorySpecificBusiness from '../components/SpecificCategoryBusinessFavorite';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements'; 
import {getfilteredBusiness, selectSpecifcCategoryEstablishmentsAction} from '../../redux/actions/Business';
import { bindActionCreators } from 'redux';
const { width, height } = Dimensions.get("window");

class SpecificCategoryFavourite extends React.Component {


  getCurrentCategoryFavourite = () => {
    const { categoryFavourite } = this.props.route.params;
    const { favouriteEstablishments } = this.props;
    return categoryFavourite.filter((establishment)=>{
      if(favouriteEstablishments.map(establishment =>  establishment._id).includes(establishment._id))
        return true
    }).length
  }

  render(){
    const { categoryFavourite, category } = this.props.route.params;
    const { navigation, favouriteEstablishments } = this.props;
    console.log("the favoruite", favouriteEstablishments)

    return(
      <View style={styles.screen}>
        <View
          style = {{ flex:1, justifyContent: 'center' }}
        >
          <Text
            style = { styles.favouritesText }
          >
            { category.title !== "Night Clubs" ? category.title + 's' : category.title  }
          </Text>
          <Text
            style = { styles.favouriteHeading }
          >
            { this.getCurrentCategoryFavourite() } Favorites
          </Text>
        </View>
        <View
          style = {{ flex: 5 }}
        >
          <ScrollView>
            {
              categoryFavourite.map((establishment)=>{
                if(favouriteEstablishments.map(establishment =>  establishment._id).includes(establishment._id))
                return (
                  <CategorySpecificBusiness establishment = {establishment} categoryId = {category}  />
                )
              })
            }   
          </ScrollView>    
        </View>
        <TouchableOpacity
          style = {styles.mapButton}
          onPress = {async()=>{ 
            const data =  await this.props.selectSpecifcCategoryEstablishmentsAction(category._id)
            this.props.getfilteredBusiness(null, null, true)
            navigation.navigate('Home');
          }}
        > 
          <View style = {{ flex:1, flexDirection: "row" }} >
            <Text style = {{ color: "white", textAlign: 'center', fontSize: 16 }} >Map</Text>
            <Icon
              name="map"
              type = 'foundation'
              size = {20}
              color = "white"
              style = {{ marginLeft: 10  }}
            />
          </View>        
        </TouchableOpacity>
      </View>
    )
  }

} 

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness,
    selectSpecifcCategoryEstablishmentsAction
  }, dispatch)
);

const mapStateToProps = (state) => {
  const { category, business} = state
  return { 
    favouriteEstablishments: business.business.favouriteBusiness,
    category: category.category.category
  }
};


export default connect(mapStateToProps, mapDispatchToProps)(SpecificCategoryFavourite);

const styles = StyleSheet.create({
  mapButton:{ 
    backgroundColor: "black",
    width: width * 0.23,
    borderRadius: 20,
    padding: 15,
    paddingTop: 8,
    paddingBottom: 8,
    paddingRight: 20,
    position: "absolute",
    top: height * 0.7,
    left: width * 0.4,
  },  
  favouriteHeading:{
    fontSize: 20,
    marginLeft: "5%",
    marginTop: "10%",
    fontWeight: "500"
  },
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