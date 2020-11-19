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


class radiusScreen extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      choosenLabel: 0,
      chooseIndex: 500
    }
  }

  render(){
    const { navigation } = this.props;
    const { user } = this.props.user.user;
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
            selectedValue={this.state.choosenLabel === 0 ? user.radius : this.state.choosenLabel }
            onValueChange={(itemValue, itemIndex) => {
              this.setState(
                { choosenLabel: itemValue,
                  chooseIndex: itemIndex
                }
              )
            }}>
            <Picker.Item label="1000" value = "1000" />
            <Picker.Item label="2000" value = "2000" />
            <Picker.Item label="3000" value = "3000" />
            <Picker.Item label="4000" value = "4000" />
            <Picker.Item label="5000" value = "5000" />
            <Picker.Item label="6000" value = "6000" />
            <Picker.Item label="7000" value = "7000" />
            <Picker.Item label="8000" value = "8000" />
            <Picker.Item label="9000" value = "9000" />
            <Picker.Item label="10000" value = "10000" />
            <Picker.Item label="11000" value = "11000" />
            <Picker.Item label="12000" value = "12000" />
            <Picker.Item label="13000" value = "13000" />
            <Picker.Item label="14000" value = "14000" />
            <Picker.Item label="15000" value = "15000" />
          </Picker>
          <Text style={[styles.text, { fontWeight: '600' }]}>
            Your Radius: {this.state.choosenLabel === 0 ? user.radius : this.state.choosenLabel }m
          </Text>
          <Text style={[styles.text, {marginTop: '10%'}]}>
            Max Selection is 15000 m
          </Text>
        </View>
        <View style= {{flex:1}} >
          <TouchableOpacity 
            onPress = {async ()=>{ 
              const data =   await this.props.updateRadius(this.state.choosenLabel)
              navigation.navigate("Screen 1") 
            }}
          >
            <Text style = {{ alignSelf: 'center' , fontSize: 25, color: '#3fa1bf'}} >Done</Text>
          </TouchableOpacity>
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
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(radiusScreen);
