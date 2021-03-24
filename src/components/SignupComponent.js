import React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, KeyboardAvoidingView , ScrollView, Alert, Modal, Dimensions, Keyboard} from 'react-native';
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
import CalendarModal from './Modals/CalendarModal';
import NativeDatePicker from './DatePicker/DatePicker';
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
      date : moment().format("YYYY-MM-DD"), 
      showPicker: false,
      email: null,
      firstName: null,
      lastName: null,
      showAlert: true,
      message: "",
      showError: false,
      gender: null,
      errors: {},
      showDatePicker: false,
      isDateChange: false
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
    console.log("theee date from picker", date)
    console.log("after date apply", moment(date).format("YYYY-MM-DD"))

    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false, isDateChange: true })
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
  
    if(!this.state.firstName){
      isValid = false;
      errors["firstName"] = "Please input First Name"
    }
    if(!this.state.lastName){
      isValid = false;
      errors["lastName"] = "Please input Last Name"
    }
    if(!this.state.date || !this.state.isDateChange ){
      isValid = false;
      errors["date"] = "Please Select Your Birthday"
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
            rating = {true}
          />
        }
        <Text style = {{ color: "black", fontSize: 20, marginBottom: 20, fontWeight: "500" }} >Finish Signing Up </Text>
        <View style = {styles.inputForm} >
          
          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle = {{justifyContent: "flex-end"}}
            style = {{ backgroundColor: 'white', width: '80%'}}>
           
            <KeyboardAwareScrollView  
              style ={{ flex:1}} 
            > 
               <Text 
                style = {{ fontSize: 16, marginBottom: 5 }} 
              > 
                First Name 
              </Text> 
              <TextInput
                style={[ pickerSelectStyles.inputIOS, {marginBottom: 5}]}
                placeholder="Please Select Your First Name."
                placeholderTextColor="#c2c0be"
                onChangeText={val => this.onChangeText('firstName', val)}
                value = {this.state.firstName}
              /> 
               <Text style = {styles.errorText} >{  errors && !this.state.firstName  && errors.firstName }</Text>
              <Text 
                style = {{ fontSize: 16, marginBottom: 5 }} 
              > 
                Last Name
              </Text>      
              <TextInput
                style={[styles.customInputText]}
                placeholder="Please Select Your Last Name."
                placeholderTextColor="#c2c0be"
                onChangeText={val => this.onChangeText('lastName', val)}
                value = {this.state.lastName}
              />
              <Text style = {styles.errorText} >{  errors &&  !this.state.lastName &&  errors.lastName  }</Text>
              <TouchableOpacity
                onPress = {()=> this.setState({ showDatePicker: !this.state.showDatePicker }) }
              >
              <Text style = {{ fontSize: 16, marginBottom: 5 }} > Date of Birth </Text>  
              <View
                style = {{ flex:1, flexDirection: 'row' }}
              >
                <Text style = {[{ fontSize: 16 }, this.state.showDatePicker && { color: 'red', fontWeight: '600' } ]} > {moment(this.state.date).format('MMM Do YYYY').toString() } </Text>
                <Image  
                  source = { this.state.showDatePicker? require('../../assets/icons/closeArrow.png') :require('../../assets/icons/downArrow.png') } 
                  style = {{ width: 20, height: 20 }}
                />
              </View>
              </TouchableOpacity>
              <Text style = {[styles.errorText, { marginBottom: 0 }]} >{  errors  && errors.date }</Text>
              <NativeDatePicker 
                show = {this.state.showDatePicker} 
                onClose = { ()=> { this.setState({ showDatePicker: false }) } }  
                date = {this.state.date}
                changeDate = { (date)=> this.changeDate(date) }
              />    
              
              <Text style = {styles.ageInfoText} >
                Your birthday won't be shared with other people who use Bar Peak
              </Text>
              <Text style = {{ fontSize: 16, marginBottom: 5, marginTop:10 }} >Email </Text> 
              <View style={[styles.inputView, {marginTop: 5}]} >  
                <TextInput
                  style={ styles.inputText }
                  placeholder="Please Select Your Email."
                  ref= "email"
                  placeholderTextColor="#c2c0be"
                  value = {this.state.email}
                  onChangeText={val => this.onChangeText('email', val)}
                  editable={ this.props.user ? false : true   }
                  onFocus = { () => this.setState({ showDatePicker: false })}
                />
              </View>
              <Text style = {styles.errorText} >{  errors && !this.state.email  && errors.email }</Text>
              { this.props.user &&
                (<View > 
                  <Text style = {{lineHeight: 14, marginTop: 10}} >This info came from {this.props.user &&  this.props.user.socialSource} and not editable.</Text>
                </View>
                )
              }
              <Text 
                style = {{ fontSize: 16, marginBottom: 5 }} 
              > 
                Gender 
              </Text> 
              <View style = { [styles.inputView, { padding: 0, paddingLeft: 20, marginTop: 5 }] } >
                <RNPickerSelect
                  style={[styles.inputText, { inputIOS:{ placeholder: {  color: 'black' }  } } ]}
                  onValueChange={(value) => console.log(value)}

                  placeholder = {
                    { label: 'Please Select Your Gender (Optional)', value: null, color: 'black' }
                  }
                  items={[
                      { label: 'Female', value: 'female', color: 'black' },
                      { label: 'Male', value: 'male' },
                      { label: 'Other', value: 'other' },
                  ]}
                  value = {this.state.gender}
                  onValueChange={(value) => {
                    this.setState({ gender: value })
                  }}
                />
              </View>
              <TouchableOpacity style={styles.acceptButton} onPress = { ()=>{this.signUp()} } >
                <Text style={styles.SignUpText}>Sign Up</Text>
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
    marginTop: 0, 
    color: '#818282',
    fontWeight: '500',
    fontSize: 12,
    fontWeight: "300"
  },
  acceptButton: { 
    alignSelf: 'center' ,
    backgroundColor: 'black', 
    marginTop: '10%', 
    borderRadius: 10,
    width: "50%",
    paddingVertical: 0
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
    paddingTop: 16,
    paddingBottom: 16,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: "center",
    margin: 0,
    borderWidth: 0,
    zIndex: 1
  },
  errorText: {
    color: 'red', 
    fontSize: 14, 
    marginTop: 3,
    marginBottom: 10 
  }
}) 

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 16,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    width: "100%",
    color: 'gray',
    paddingRight: 0, // to ensure the text is never behind the icon
  }
});