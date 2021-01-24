//React Native Picker
//https://aboutreact.com/react-native-picker/

//import React in our code
import React, {useState} from 'react';
import {updateRadius} from '../../redux/actions/User';
//import all the components we are going to use
import {
  Picker,
  View,
  Text,
  SafeAreaView,
  StyleSheet
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-loading-spinner-overlay';
import {getfilteredBusiness, getFavouritesBusinessAction, getNearLocationBusiness, emptyBusiness} from '../../redux/actions/Business';
const milesArray = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8];

class radiusScreen extends React.Component{

  
  constructor(props){
    super(props);
    this.state = {
      choosenLabel: 0,
      chooseIndex: 500,
      spinner: false,
      selectedValue: 1
    }
  }

  getMilesintoMeters = (miles)=>{
    return miles * 1609;
  }
  getMetersIntoMiles(meters){
    return parseFloat((meters/1609).toFixed(1))
  }
  componentDidMount(){
    const { radius } = this.props.user.user;
    this.setState({ selectedValue: this.getMetersIntoMiles(radius)}, ()=> console.log("the state", this.state) )
  }

  render(){
    const { navigation } = this.props;
    const { location, radius } = this.props.user.user;
    console.log("the location", location);
    const { latitude, longitude } = location;
    console.log(`the latittude ${latitude} and longitude ${longitude} `)
    return(
      <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style = {{flex:5, justifyContent: 'center'}} >
          <Text style={styles.infoText}>
            The Radius ensures that in how much km you gonna see your results.
          </Text>
          <Picker
            selectedValue={ this.state.selectedValue  }
            onValueChange={(itemValue, itemIndex) => {
              console.log("the item value", itemValue);
              this.setState(
                { choosenLabel: itemValue,
                  chooseIndex: itemIndex,
                  selectedValue: itemValue
                }
              )
            }}>
            <Picker.Item label="0.5" value = { 0.5 } />
            <Picker.Item label="1" value = { 1} />
            <Picker.Item label="1.5" value =  { 1.5}   />
            <Picker.Item label="2" value = { 2 }  />
            <Picker.Item label="2.5" value = { 2.5 }  />
            <Picker.Item label="3" value = { 3 }  />
            <Picker.Item label="3.1" value = {  3.1 }  />
            <Picker.Item label="3.5" value = { 3.5 }  />
            <Picker.Item label="4" value = { 4 }  />
           
          </Picker>
          <Text style={[styles.text, { fontWeight: '600' }]}>
            Your Radius:  {this.getMetersIntoMiles(radius)}  miles
          </Text>
          <Text style={[styles.text, {marginTop: '10%'}]}>
            Max Selection is 15 miles
          </Text>
        </View>
        <View style= {{flex:1}} >
          <TouchableOpacity 
            onPress = {async ()=>{
              this.setState({ spinner: true }) 
              const getRadius = await this.props.updateRadius( this.getMilesintoMeters(this.state.selectedValue) )
              console.log("the after update radius", getRadius)
              await this.props.emptyBusiness()
              await this.props.getNearLocationBusiness({ latitude: parseFloat(latitude), longitude: parseFloat(longitude)}, getRadius)
              await this.props.getfilteredBusiness(null, null, null);
              await this.props.getFavouritesBusinessAction();
              this.setState({ spinner: false })   
              navigation.navigate("Screen 1") 
            }}
          >
            <Text style = {{ alignSelf: 'center' , fontSize: 25, color: '#3fa1bf'}} >Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.spinnerContainer}>
          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />
        </View>
        {/*Text to show selected picker value*/}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    fontSize: 20,
    alignSelf: 'center',
  },
  infoText:{
    justifyContent: 'center',
    alignSelf: 'center',
    borderWidth: 0,
    maxWidth: '80%',
    fontSize: 20,
    textAlign: 'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  }
});

const mapStateToProps = (state) => {
  const { user } = state
  return { 
    user: user,
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateRadius,
    emptyBusiness,
    getfilteredBusiness,
    getFavouritesBusinessAction,
    getNearLocationBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(radiusScreen);
