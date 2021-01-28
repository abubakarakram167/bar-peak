import React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, KeyboardAvoidingView , ScrollView, Alert, Modal, Dimensions} from 'react-native';
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
import NativeDatePicker from '../components/DatePicker/DatePicker'

const { width, height } = Dimensions.get("window");

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
      date : new Date(), 
      showPicker: false,
      email: null,
      firstName: null,
      lastName: null,
      showAlert: true,
      message: "",
      showError: false,
      gender: null,
      errors: {}
    }
	}

	componentDidMount(){
    console.log("the passing data", this.props );

    if(this.props.user){
      const {email, firstName, lastName} = this.props.user;
      this.setState({ email, firstName, lastName  })
    }
  }
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  changeDate = (date) => {
    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false })
    setTimeout(()=>  this.setState({ showPicker: false }) , 1300)
  }

  sendEmail = async(userId) => {
    const body = {
      userId
    }
    console.log("the body", body)
    try{
      const sendEmail = await axios.post('sendEmailVerification', body);
      return sendEmail
    }catch(err){
      console.log("the error", err)
    }
  }

  validate = () => {
    let errors = {}
    let isValid = true;
   
    if(!this.state.gender){
      isValid = false;
      errors["gender"] = "Please input gender"
    }
    if(!this.state.firstName){
      isValid = false;
      errors["firstName"] = "Please input first Name"
    }
    if(!this.state.lastName){
      isValid = false;
      errors["lastName"] = "Please input last Name"
    }
    if(!this.state.date){
      isValid = false;
      errors["date"] = "Please input you Birthday"
    }
    if(!this.state.email){
      isValid = false;
      errors["email"] = "Please input your email"
    }
    
    if(isValid){
      return true
    }
    this.setState({ errors })
    return false
  }

  signUp = () => {
    if(this.validate()){
      this.setState({ spinner: true })
      const {navigation, phoneNumber} = this.props;
      let accountType = this.props.user ? 'social' : "app";
      let finalPhoneNumber = accountType === "app" ? phoneNumber : null
      const body = {
        query: `
        mutation{
          createUser(userInput: {email: "${this.state.email}",
          firstName: "${this.state.firstName}", lastName: "${this.state.lastName}",
          gender: "${this.state.gender}", 
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
      if(res.data.data.createUser){
        storeUserData(res.data.data.createUser)
        this.props.closeModal();
        const user = await this.props.getUser();
        const getEmail = await this.sendEmail(res.data.data.createUser.user._id)
        this.setState({ spinner: false })
        if(user === 'ok')
          navigation.navigate('HomeApp');
      }
        
      }).catch(err =>{
        console.log("the error in sign up", err);
        const { errors } = err.response.data;
        const { message } = errors[0];
        console.log("the error", errors) 
        this.setState({ spinner: false, message, showError: true })
      })
    }
  }

  
	render(){
    const { errors } = this.state;

		return (
      <View style = {styles.container} >
       
        { this.state.showError && 
          <AlertComponent 
            showError = {this.state.showError}  
            message = {this.state.message} 
            closeModal = { ()=> this.setState({ showError: false  }) }  
          />
        }
        <Text style = {{ color: "black", fontSize: 20, marginBottom: 20, fontWeight: "500" }} >Finish Signing Up </Text>
        <View style = {styles.inputForm} >
          
          <ScrollView  
            contentContainerStyle = {{justifyContent: "flex-end"}}
            style = {{ backgroundColor: 'white', width: '80%'}}>
           
            <KeyboardAwareScrollView  
              style ={{ flex:1}} 
            >       
              <TextInput
                style={[ pickerSelectStyles.inputIOS]}
                placeholder="First Name"
                placeholderTextColor="#003f5c"
                onChangeText={val => this.onChangeText('firstName', val)}
                value = {this.state.firstName}
              />      
              <TextInput
                style={styles.customInputText}
                placeholder="Last Name"
                placeholderTextColor="#003f5c"
                onChangeText={val => this.onChangeText('lastName', val)}
                value = {this.state.lastName}
              />
              <Text style = {{ color: 'red', fontSize: 16, marginTop: 3 }} >{  errors && errors.firstName }</Text>
              <Text style = {{ color: 'red', fontSize: 16, marginTop: 3 }} >{  errors && errors.lastName }</Text>
              <View style={styles.inputView} >
                {/* <NativeDatePicker 
                /> */}
                <DatePicker 
                  onChange = { (date)=> { 
                    this.changeDate(date)
                  }}
                  dob = {null}
                  value = { this.state.date  } 
                />    
              </View>
              <Text style = {{ color: 'red', fontSize: 16, marginTop: 3 }} >{  errors && errors.date }</Text>
              <Text style = {styles.ageInfoText} >
                To Sign up, you need to be atleast 21.Your birthday won't be shared with other people who use Bar Peak
              </Text>
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
              <Text style = {{ color: 'red', fontSize: 16, marginTop: 3 }} >{  errors && errors.email }</Text>
              { this.props.user &&
                (<View > 
                  <Text style = {{lineHeight: 14, marginTop: 10}} >This info came from {this.props.user &&  this.props.user.socialSource} and not editable.</Text>
                </View>
                )
              }
              <View style = { [styles.inputView, { padding: 0, paddingLeft: 20 }] } >
                <RNPickerSelect
                  style={[styles.inputText ]}
                  onValueChange={(value) => console.log(value)}
                  placeholderTextColor="black"

                  placeholder = {
                    { label: 'Please Select Your Gender', value: 'female', color: 'black' }
                  }
                  items={[
                      { label: 'Female', value: 'female', color: 'black' },
                      { label: 'Male', value: 'male' },
                      { label: 'Other', value: 'other' },
                  ]}
                  onValueChange={(value) => {
                    this.setState({ gender: value })
                  }}
                />
              </View>
              <Text style = {{ color: 'red', fontSize: 16, marginTop: 3 }} >{  errors && errors.gender }</Text>
              <TouchableOpacity style={styles.acceptButton} onPress = { ()=>{this.signUp()} } >
                <Text style={styles.SignUpText}>Accept and Continue</Text>
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
  ageInfoText: {
    lineHeight: 16, 
    marginTop: 10, 
    color: 'gray',
    fontSize: 12,
    fontWeight: "300"
  },
  acceptButton: { 
    alignSelf: 'center' ,
    backgroundColor: 'black', 
    marginTop: '10%', 
    borderRadius: 10,
    width: "100%",
    paddingTop: 5,
    paddingBottom: 5
  },
  SignUpText: {
    fontSize: 18,
    color: 'white',
    paddingTop: 15,
    paddingBottom: 15,
    textAlign: 'center'
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  inputForm: {
    
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0,
    borderWidth: 0,
    width: '100%',
    height: height * 0.8
  },
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
    borderWidth: 0.5,
    height: 50,
    // marginTop: 50,
    marginTop: height * 0.04,
    marginLeft: 0,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  customInputText: {
    color: "gray",
    borderWidth:0.5, 
    paddingLeft: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingTop: 20,
    paddingBottom: 20
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    margin: 0,
    borderWidth: 0
  }
}) 

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderBottomWidth:0.2,
    borderColor: 'gray',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: "100%",
    color: 'gray',
    paddingRight: 0, // to ensure the text is never behind the icon
  }
});