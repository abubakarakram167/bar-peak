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
import {getfilteredBusiness, emptyBusiness} from '../../redux/actions/Business';
const milesArray = [0,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5,5.5,6,6.5,7,7.5,8];

class radiusScreen extends React.Component{

  
  constructor(props){
    super(props);
    this.state = {
      choosenLabel: 0,
      chooseIndex: 500,
      spinner: false
    }
  }

  getMilesintoMeters = (miles)=>{
    return miles * 1609.344;
  }
  getMetersIntoMiles(meters){
    return meters/1609.344;
  }

  render(){
    const { navigation } = this.props;
    const { user, radius } = this.props.user.user;
    console.log("the radius", radius)
    return(
      <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/*Picker with multiple chose to choose*/}
        {/*selectedValue to set the preselected value if any*/}
        {/*onValueChange will help to handle the changes*/}
        <View style = {{flex:5, justifyContent: 'center'}} >
          <Text style={styles.infoText}>
            The Radius ensures that in how much km you gonna see your results.
          </Text>
          <Picker
            selectedValue={this.state.choosenLabel === 0 ? radius : this.state.choosenLabel }
            onValueChange={(itemValue, itemIndex) => {
              console.log("the item value", itemValue);
              this.setState(
                { choosenLabel: itemValue,
                  chooseIndex: itemIndex
                }
              )
            }}>
            <Picker.Item label="0.5" value = { this.getMilesintoMeters(0.5) } />
            <Picker.Item label="1" value = { this.getMilesintoMeters(1)} />
            <Picker.Item label="1.5" value =  { this.getMilesintoMeters(1.5)}   />
            <Picker.Item label="2" value = { this.getMilesintoMeters(2)}  />
            <Picker.Item label="2.5" value = { this.getMilesintoMeters(2.5)}  />
            <Picker.Item label="3" value = { this.getMilesintoMeters(3)}  />
            <Picker.Item label="3.5" value = { this.getMilesintoMeters(3.5)}  />
            <Picker.Item label="4" value = { this.getMilesintoMeters(4)}  />
            <Picker.Item label="4.5" value = { this.getMilesintoMeters(4.5)}  />
            <Picker.Item label="5" value = { this.getMilesintoMeters(5)}  />
            <Picker.Item label="5.5" value = { this.getMilesintoMeters(5.5)}  />
            <Picker.Item label="6" value = { this.getMilesintoMeters(6)}  />
            <Picker.Item label="6.5" value = { this.getMilesintoMeters(6.5)}  />
            <Picker.Item label="7" value = { this.getMilesintoMeters(7)}  />
            <Picker.Item label="7.5" value = { this.getMilesintoMeters(7.5)}  />
            <Picker.Item label="8" value = { this.getMilesintoMeters(8)}  />
            <Picker.Item label="8.5" value = { this.getMilesintoMeters(8.5)}  />
            <Picker.Item label="9" value = { this.getMilesintoMeters(9)}  />
            <Picker.Item label="9.5" value = { this.getMilesintoMeters(9.5)}  />
            <Picker.Item label="10" value = { this.getMilesintoMeters(10)}  />
            <Picker.Item label="10.5" value = { this.getMilesintoMeters(10.5)}  />
            <Picker.Item label="11" value = { this.getMilesintoMeters(11)}  />
            <Picker.Item label="11.5" value = { this.getMilesintoMeters(11.5)}  />
            <Picker.Item label="12" value = { this.getMilesintoMeters(12)}  />
            <Picker.Item label="12.5" value = { this.getMilesintoMeters(12.5)}  />
            <Picker.Item label="13" value = { this.getMilesintoMeters(13)}  />
            <Picker.Item label="13.5" value = { this.getMilesintoMeters(13.5)}  />
            <Picker.Item label="14" value = { this.getMilesintoMeters(14)}  />
            <Picker.Item label="14.5" value = { this.getMilesintoMeters(14.5)}  />
            <Picker.Item label="15" value = { this.getMilesintoMeters(15)}  />
          </Picker>
          <Text style={[styles.text, { fontWeight: '600' }]}>
            Your Radius: {this.state.choosenLabel === 0 ?  this.getMetersIntoMiles(radius).toFixed(2) : this.getMetersIntoMiles(this.state.choosenLabel) } miles
          </Text>
          <Text style={[styles.text, {marginTop: '10%'}]}>
            Max Selection is 7.5 miles
          </Text>
        </View>
        <View style= {{flex:1}} >
          <TouchableOpacity 
            onPress = {async ()=>{
              this.setState({ spinner: true }) 
              await this.props.updateRadius(this.state.choosenLabel)
              await this.props.emptyBusiness()
              this.setState({ spinner: false }) 
              navigation.navigate("Screen 1") 
              this.props.getfilteredBusiness(null);  
              
              // navigation.popToTop()
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




// const radiusScreen = () => {

//   const [choosenLabel, setChoosenLabel] = useState('');
//   const [choosenIndex, setChoosenIndex] = useState('500');

//   return (
//     <SafeAreaView style={{flex: 1}}>
//       <View style={styles.container}>
//         {/*Picker with multiple chose to choose*/}
//         {/*selectedValue to set the preselected value if any*/}
//         {/*onValueChange will help to handle the changes*/}
//         <View style = {{flex:5, justifyContent: 'center'}} >
//           <Text style={styles.infoText}>
//             The Radius ensures that in how much km you gonna see your results.
//           </Text>
//           <Picker
//             selectedValue={choosenLabel}
//             onValueChange={(itemValue, itemIndex) => {
//               setChoosenLabel(itemValue);
//               setChoosenIndex(itemIndex);
//             }}>
//             <Picker.Item label="1000" value = "1000" />
//             <Picker.Item label="2000" value = "2000" />
//             <Picker.Item label="3000" value = "3000" />
//             <Picker.Item label="4000" value = "4000" />
//             <Picker.Item label="5000" value = "5000" />
//             <Picker.Item label="6000" value = "6000" />
//             <Picker.Item label="7000" value = "7000" />
//             <Picker.Item label="8000" value = "8000" />
//             <Picker.Item label="9000" value = "9000" />
//             <Picker.Item label="10000" value = "10000" />
//             <Picker.Item label="11000" value = "11000" />
//             <Picker.Item label="12000" value = "12000" />
//             <Picker.Item label="13000" value = "13000" />
//             <Picker.Item label="14000" value = "14000" />
//             <Picker.Item label="15000" value = "15000" />
//           </Picker>
//           <Text style={[styles.text, { fontWeight: '600' }]}>
//             You Selected: {choosenLabel}
//           </Text>
//           <Text style={[styles.text, {marginTop: '10%'}]}>
//             Max Selection is 15000 m
//           </Text>
//         </View>
//         <View style= {{flex:1}} >
//           <TouchableOpacity 
//             onPress = {()=>{ navigation.navigate("HomeApp") }}
//           >
//             <Text style = {{ alignSelf: 'center' , fontSize: 25, color: '#3fa1bf'}} >Done</Text>
//           </TouchableOpacity>
//         </View>
//         {/*Text to show selected picker value*/}
//       </View>
//     </SafeAreaView>
//   );
// };

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
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(radiusScreen);
