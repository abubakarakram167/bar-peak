import React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, KeyboardAvoidingView , ScrollView, Alert, Modal} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from '../api/axios';
import {storeUserData} from '../components/localStorage';
import { showMessage, hideMessage } from "react-native-flash-message";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import RNPickerSelect from 'react-native-picker-select/src';  
import { getUser } from '../../redux/actions/User';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlertComponent from '../components/AlertComponent';
import DatePicker from './DatePicker';

const shadowOpt = {
  width:160,
  height:170,
  color:"rgba(0, 0, 0, 0.05)",
  border:2,
  inset: true,
  style:{marginVertical:5}
}

const createTwoButtonAlert = (message) =>
  Alert.alert(
    "Error",
    message,
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => console.log("OK Pressed") }
    ],
    { cancelable: true }
);

// const keyboardVerticalOffset = Platform.OS === 'ios' ? 200 : 0

class SignUpComponent extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
      date : '', 
      showPicker: false,
      email: "",
      firstName: "",
      lastName: "",
      showAlert: true,
      message: "",
      showError: false
    }
	}

	componentDidMount(){
    console.log("the passing data", this.props );

    if(this.props.user){
      const {email, firstName, lastName } = this.props.user;
      this.setState({ email, firstName, lastName  })
    }
  }
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  changeDate = (date) => {
    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false })
    setTimeout(()=>  this.setState({ showPicker: false }) , 1300)
    console.log("the date in component", moment(date).format("YYYY-MM-DD"))
  }

  signUp = () => {
    this.setState({ spinner: true })
    const {navigation, phoneNumber} = this.props;
    let accountType = this.props.user ? 'social' : "app";
    let finalPhoneNumber = accountType === "app" ? phoneNumber : null
    console.log("on sigunup", this.state);
    console.log("the phone Number", finalPhoneNumber)
    
    const body = {
      query: `
      mutation{
        createUser(userInput: {email: "${this.state.email}",
        firstName: "${this.state.firstName}", lastName: "${this.state.lastName}", 
        dob: "${this.state.date}", accountType: "${accountType}", phoneNumber: "${finalPhoneNumber}"})
        {
          token
          user{
            _id
            firstName
            radius
            lastName
            email
            dob
            phoneNumber
          }
        }
      }
      `
    }
    
    axios.post('graphql?',body).then( async (res)=>{
      console.log("after sign up", res.data.data);
      if(res.data.data.createUser){
        storeUserData(res.data.data.createUser)
        this.setState({ spinner: false })
        this.props.closeModal();
        const user = await this.props.getUser();
        if(user === 'ok')
          navigation.navigate('HomeApp');
      }
      
    }).catch(err =>{
      const { errors } = err.response.data;
      const { message } = errors[0]; 
      this.setState({ spinner: false, message, showError: true })
    })
  }

  
	render(){
		return (
      <View style = {styles.container} >
        <Image style = { styles.ImageLogo }  source = {{ uri: "https://i.pinimg.com/originals/89/89/7a/89897a8a430fdc2ca10b14f579dc3551.png" }}  />
        { this.state.showError && <AlertComponent 
            showError = {this.state.showError}  
            message = {this.state.message} 
            closeModal = { ()=> this.setState({ showError: false  }) }  
        />}
        <View style = {styles.inputForm} >
          
          <ScrollView   style = {{flex:1, backgroundColor: 'white', width: '80%'}}>
           
            <KeyboardAwareScrollView style ={{ flex:1 }} >  
              <View style={styles.inputView} >
                <TextInput
                  style={[styles.inputText]}
                  placeholder="First Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={val => this.onChangeText('firstName', val)}
                  value = {this.state.firstName}
                />
              </View>
              <View style={styles.inputView} >
                <TextInput
                  style={styles.inputText}
                  placeholder="Last Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={val => this.onChangeText('lastName', val)}
                  value = {this.state.lastName}
                />
              </View>
              <View style={styles.inputView} >
                <DatePicker 
                  onChange = { (date)=> { 
                    this.changeDate(date)
                  }} 
                />
                
              </View>
              <Text style = {{lineHeight: 14, marginTop: 5, color: 'gray', alignSelf: 'center'}} >Age must be 21 or greater.</Text>
              <View style={styles.inputView} >
                <TextInput
                  style={ styles.inputText }
                  placeholder="Email"
                  ref= "email"
                  placeholderTextColor="#003f5c"
                  value = {this.state.email}
                  onChangeText={val => this.onChangeText('email', val)}
                  editable={ this.props.user ? false : true   }
                />
              </View>
              { this.props.user &&
                (<View > 
                  <Text style = {{lineHeight: 14, marginTop: 10}} >This info came from facebook and not editable.</Text>
                </View>
                )
              }
              {/* { !this.props.user &&(
                <View style = {[ styles.inputView, { marginBottom: 20 }] } >
                  <View  >
                    <TextInput
                      style={styles.inputText}
                      placeholder="Password"
                      placeholderTextColor="#003f5c"
                      onChangeText={val => this.onChangeText('password', val)}
                      secureTextEntry
                    />
                   <Text style = {{lineHeight: 14, marginTop: 15, color: 'gray'}} >Password must be atleast 5 key words</Text>
                  </View>
                </View>
                
              )
              } */}
              <View style = { [styles.inputView, { padding: 0, paddingLeft: 20 }] } >
                <RNPickerSelect
                  style={[styles.inputText ]}
                  onValueChange={(value) => console.log(value)}
                  placeholderTextColor="black"

                  placeholder = {
                    { label: 'Female', value: 'female', color: 'black' }
                  }
                  items={[
                      { label: 'Male', value: 'male' },
                      { label: 'Other', value: 'other' },
                  ]}
                  onValueChange={(value) => {
                    this.setState({ gender: value })
                  }}
                />
              </View>
              <TouchableOpacity style={{ width: '40%',alignSelf: 'center' ,backgroundColor: 'black', marginTop: '10%', borderRadius: '10%' }} onPress = { ()=>{this.signUp()} } >
                <Text style={styles.SignUpText}>Signup</Text>
              </TouchableOpacity>
            </KeyboardAwareScrollView>
           </ScrollView>     
        </View>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
      </View>
    )
	}
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUser
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(SignUpComponent);

const styles = StyleSheet.create({
  SignUpText: {
    fontSize: 25,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textAlign: 'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  inputForm: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    borderWidth: 0,
    width: '100%',
    height: '53%'
    
  },
  // disabledInputStyle:
  // {  shadowOpacity: 1,
  //   fontSize: 14,
  //   shadowRadius: 1,
  //   shadowColor: 'gray',
  //   shadowOffset: { height: 0, width: 0 },
  // },
  ImageLogo:{
    width: '35%',
    height: '15%',
    marginBottom: "5%",
    backgroundColor: 'white',
    marginTop: '15%'
  },
  inputView: {
    width: "100%",
    //  backgroundColor: "#465881",
    borderRadius: 7,
    borderWidth: 1,
    height: 50,
    // marginTop: 50,
    marginTop: 20,
    marginLeft: 0,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    margin: 0
  }
}) 

