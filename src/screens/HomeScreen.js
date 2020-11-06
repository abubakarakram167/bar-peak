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
    FlatList
} from "react-native";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/Ionicons'
import Category from '../../screens/components/Category'
import Home from '../../screens/components/Home'
import Tag from '../../screens/components/Tag'
import {getAllBusiness} from '../../redux/actions/Business';
import {getfilteredBusiness} from '../../redux/actions/Business';
import { removeStorageItem } from '../components/localStorage'; 

const { height, width } = Dimensions.get('window')
class HomeScreen extends Component {

  async componentDidMount(){
    const getData = await this.props.getAllBusiness();
    this.props.getfilteredBusiness(getData)
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
        inputRange: [0, 50],
        outputRange: [this.startHeaderHeight, this.endHeaderHeight],
        extrapolate: 'clamp'
    })

    this.animatedOpacity = this.animatedHeaderHeight.interpolate({
        inputRange: [this.endHeaderHeight, this.startHeaderHeight],
        outputRange: [0, 1],
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
      const { filterBusinesses } = this.props.business.business;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <Animated.View style={{ height: this.animatedHeaderHeight, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#dddddd' }}>
                        <View style={{
                            flexDirection: 'row', padding: 10,
                            backgroundColor: 'white', marginHorizontal: 20,
                            shadowOffset: { width: 0, height: 0 },
                            shadowColor: 'black',
                            shadowOpacity: 0.2,
                            elevation: 1,
                            marginTop: Platform.OS == 'android' ? 30 : null
                        }}>
                            <Icon name="ios-search" size={20} style={{ marginRight: 10 }} />
                            <TextInput
                              underlineColorAndroid="transparent"
                              placeholder="Try New Delhi"
                              placeholderTextColor="grey"
                              style={{ flex: 1, fontWeight: '700', backgroundColor: 'white' }}
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
                          <View style={{ width: width , height: height * 0.4, marginTop: 20 }}>
                            <Image
                              style={styles.homeLogo}
                              source={require('../../assets/home.jpg')}
                            />
                          </View>
                        </View>
                      </Animated.View>
                      <View style={{ marginTop: 40 }}>
                        <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                          Your Vibe's
                        </Text>
                        <View style={{ paddingHorizontal: 20, marginTop: 20, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <FlatList
                          data={filterBusinesses}
                          renderItem={({item}) => {
                            console.log("the render item", item);
                            return(
                              <Home 
                                width={width}
                                height= {height}
                                item = {item}
                              />
                            );
                          }}
                          horizontal = {true}
                          keyExtractor={item => item.place_id}
                        />  
                        </View>
                      </View> 
                      <View style={{ flex: 1, backgroundColor: 'white', paddingTop: 20 }}>
                        <Text style={{ fontSize: 24, fontWeight: '700', paddingHorizontal: 20 }}>
                            What can we help you find, Varun?
                        </Text>

                        <View style={{ height: 130, marginTop: 20 }}>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                            >
                                <Category imageUri={require('../../assets/home.jpg')}
                                    name="Home"
                                />
                                <Category imageUri={require('../../assets/experiences.jpg')}
                                    name="Experiences"
                                />
                                <Category imageUri={require('../../assets/restaurant.jpg')}
                                    name="Resturant"
                                />
                            </ScrollView>
                        </View>
                      </View>
                    </ScrollView>

                </View>
            </SafeAreaView>
        );
    }
}
const mapStateToProps = (state) => {
  const { business } = state
  return { business: business }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getAllBusiness,
    getfilteredBusiness
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
    }
});