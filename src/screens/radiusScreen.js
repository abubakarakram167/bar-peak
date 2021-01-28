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
    const { latitude, longitude } = location;
    
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
            <Picker.Item label="0.5" value = { 0.1 } />
            <Picker.Item label="0.5" value = { 0.3 } />  
            <Picker.Item label="0.5" value = { 0.5 } />
            <Picker.Item label="1" value = { 1} />
            <Picker.Item label="1.5" value =  { 1.5}   />
            <Picker.Item label="2" value = { 2 }  />
            <Picker.Item label="2.5" value = { 2.5 }  />
            <Picker.Item label="3" value = { 3 }  />
            <Picker.Item label="3.1" value = {  3.1 }  />
            <Picker.Item label="3.5" value = { 3.5 }  />
            <Picker.Item label="4.5" value = { 4.5 }  />
            <Picker.Item label="5" value = { 5 }  />
            <Picker.Item label="5.5" value = { 5.5 }  />
            <Picker.Item label="6" value = { 6 }  />
            <Picker.Item label="6.5" value = { 6.5 }  />
            <Picker.Item label="7" value = { 7 }  />
            <Picker.Item label="7.5" value = { 7.5 }  />
            <Picker.Item label="8" value = { 8 }  />
            <Picker.Item label="8.5" value = { 8.5 }  />
            <Picker.Item label="9" value = { 9 }  />
            <Picker.Item label="9.5" value = { 9.5 }  />
            <Picker.Item label="10" value = { 10 }  />
            <Picker.Item label="10.5" value = { 10.5 }  />
            <Picker.Item label="11" value = { 11 } />
            <Picker.Item label="11.5" value = { 11.5 } />
            <Picker.Item label="12" value = { 12 } />
            <Picker.Item label="12.5" value = { 12.5 } />
            <Picker.Item label="13" value = { 13 } />
            <Picker.Item label="13.5" value = { 13.5 } />
            <Picker.Item label="14" value = { 14 } />
            <Picker.Item label="14.5" value = { 14.5 } />
            <Picker.Item label="15" value = { 15 } />
            <Picker.Item label="15.5" value = { 15.5 } />
            <Picker.Item label="16" value = { 16 } />
            <Picker.Item label="16.5" value = { 16.5 } />
            <Picker.Item label="17" value = { 17 } />
            <Picker.Item label="17.5" value = { 17.5 } />
            <Picker.Item label="18" value = { 18 } />
            <Picker.Item label="18.5" value = { 18.5 } />
            <Picker.Item label="19" value = { 19 } />
            <Picker.Item label="19.5" value = { 19.5 } />
            <Picker.Item label="20" value = { 20 } />
            <Picker.Item label="20.5" value = { 20.5 } />
            <Picker.Item label="21" value = { 21 } />
            <Picker.Item label="21.5" value = { 21.5 } />
            <Picker.Item label="22" value = { 22 } />
            <Picker.Item label="22.5" value = { 22.5 } />
            <Picker.Item label="23" value = { 23 } />
            <Picker.Item label="23.5" value = { 23.5 } />
            <Picker.Item label="24" value = { 24 } />
            <Picker.Item label="24.5" value = { 24.5 } />
            <Picker.Item label="25" value = { 25 } />
            <Picker.Item label="25.5" value = { 25.5 } />
            <Picker.Item label="26" value = { 26 } />
            <Picker.Item label="26.5" value = { 26.5 } />
            <Picker.Item label="27" value = { 27 } />
            <Picker.Item label="27.5" value = { 27.5 } />
            <Picker.Item label="28.5" value = { 28.5 } />
            <Picker.Item label="29" value = { 29 } />
            <Picker.Item label="29.5" value = { 29.5 } />
            <Picker.Item label="30" value = { 30 } />
          </Picker>
          <Text style={[styles.text, { fontWeight: '600' }]}>
            Your Radius:  {this.getMetersIntoMiles(radius)}  miles
          </Text>
          <Text style={[styles.text, {marginTop: '10%'}]}>
            Max Selection is 30 miles
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
