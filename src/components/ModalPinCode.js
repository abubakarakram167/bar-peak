import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import SmoothPinCodeInput  from 'react-native-smooth-pincode-input';
import axios from '../api/axios';
import * as firebase from 'firebase';
import {storeUserData} from './localStorage';
import { getUser } from '../../redux/actions/User';
import { bindActionCreators } from 'redux';
import AnimatedEllipsis from 'react-native-animated-ellipsis';

try {
  if (!firebase.apps.length) {
    firebase.initializeApp({
      apiKey: "AIzaSyAkqr6EVIOafD3OgZ4yJ61r7Xw9iatZXsQ",
      authDomain: "bar-peak.firebaseapp.com",
      projectId: "bar-peak",
      storageBucket: "bar-peak.appspot.com",
      messagingSenderId: "679573729418",
      appId: "1:679573729418:web:6f247e063bc33567aa7d73",
      measurementId: "G-640X1HCE70"
    }); 
  }
} catch (err) {
  console.log("the error", err)
}

const { width, height } = Dimensions.get("window");

class ModalPinCode extends Component {
  state = {
    modalVisible: true,
    allCountries: [],
    phoneNumber: '',
    currentcountry: '',
    user: null,
    showIncorrectErrorCode: false,
    spinner: false,
    pinCodeIconLoader: false
  };

  getLoginUser = async() => {
    
    this.setState({ spinner: true });
    const { navigation } = this.props;
    const body = {
      query:`
      query{
        login(email: "${this.state.user.email}")
        {
          token,
          user{
            _id
            firstName
            radius
            lastName
            email
            dob
            profilePic
            gender
            accountType,
            phoneNumber
          }
        }
      }
      `
    }

    
    axios.post(`graphql?`,body).then((res)=>{
      console.log("the reso login", res)
      if(res.data.data.login){
        console.log("the data in login", res.data.data.login)
        storeUserData(res.data.data.login).then(async() => {
          this.setState({ spinner: false });
          const user = await this.props.getUser();
          if(user === 'ok'){
            this.props.onCloseModalSignUp()
            this.props.onClose()
            navigation.navigate('HomeApp');
          }
            
        })
      }
    }).catch(err => {
        console.log('the error')
        const {errors} =  err.response.data; 
        const { message } = errors[0]; 
        this.setState({ spinner: false, message, showError: true })
    })

  }

  async componentDidMount(){
    console.log("this.props", this.props)
    const { phoneNumberPinData } = this.props;
    console.log("the props", this.props)
    const body = {
      query:`
        query{
          getUserByPhoneNumber(phoneNumber: "${phoneNumberPinData.phoneNo}" ){
            email
          }
        }
      `
    }
    try{
      const res = await axios.post(`graphql?`,body)
      console.log("theee resss");
      console.log("the user data", res.data.data.getUserByPhoneNumber)
      if(res.data.data.getUserByPhoneNumber)
        this.setState({user: res.data.data.getUserByPhoneNumber})
    }catch(err){
      console.log("..........")
      console.log("the error", err)
    }
  
  }

  verifyCode = async (code) => {
    this.setState({pinCodeIconLoader: true})
    const { phoneNumberPinData, navigation } = this.props;
    const verificationId = phoneNumberPinData.verificationId;
    const verificationCode = code;
  
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId ,
        verificationCode
      );
      const getResult = await firebase.auth().signInWithCredential(credential);
      
      if(this.state.user){
        this.getLoginUser();
      }
      else{
        this.props.onCloseModalSignUp()
        this.props.onClose()
        this.props.onNavigateSignUpScreen(phoneNumberPinData.phoneNo) 
      }
       
      
      console.log("the getResult", getResult)
      // showMessage({ text: 'Phone authentication successful 👍' });
    } catch (err) {
      console.log("the error", err)
      this.setState({ showIncorrectErrorCode: true, pinCodeIconLoader: false })
    }
  }

  render() {
    const {phoneNumberPinData} = this.props;
    console.log("the data", this.props)
    return (
      <View style={styles.centeredView}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={ this.props.showPinModal }
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Icon
                name='ios-remove'
                type = 'ionicon'
                size = {70}
                color = 'gray'
                style = {{ width: 60, height: 40, borderWidth: 0, justifyContent: 'flex-start', position: 'relative', bottom: 20 }}
              />
              <View
                style = {{ flexDirection: 'row', maxHeight: 40, borderBottomWidth: 0.3 }}
              > 
                <View style = {{ flex:1 }} >   
                  <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                      this.props.onClose()
                    }}
                  >
                    <Icon
                      name='x'
                      type = 'foundation'
                      size = {20}
                      color = 'gray'
                      style = {styles.closeIcon}
                    />
                  </TouchableHighlight>
                </View> 
                <View
                  style = {{ flex:3 }}
                >
                  <Text style={styles.modalText}>Confirm Your Number</Text>
                </View>
              </View>
              
              <View
                style = {{ width: width * 0.8, height: height * 0.75, borderWidth: 0 }}
              >
                <View
                  style = {{ flex: 1,  }}
                >
                  <Text style = {styles.smsText} >Enter The Code We Sent Over SMS to {phoneNumberPinData && phoneNumberPinData.phoneNo}</Text>
                  <View
                    opacity = { this.state.pinCodeIconLoader ? 0.3 : 1}
                  >
                    <SmoothPinCodeInput
                      cellStyle={{
                        borderWidth: 1.2,
                        borderColor: 'gray',
                        borderRadius: 10,
                        marginLeft: 5
                      }}
                      codeLength={6}
                      cellSize = {48}
                      cellStyleFocused={{
                        borderColor: 'black',
                        borderWidth: 2
                      }}
                      value = {this.state.code}  
                      onTextChange={code => this.setState({ code })}
                      containerStyle = {{ marginTop: 20 }}
                      onFulfill = {(code)=> this.verifyCode(code) }
                    />
                  </View>
                  { this.state.pinCodeIconLoader &&
                   (<Text style = {{  alignSelf: "center" }} >
                    <AnimatedEllipsis 
                      numberOfDots={4}
                      style={{
                        color: 'black',
                        fontSize: 90,
                        letterSpacing: -10,
                        position: "relative",
                        bottom: 50
                      }}
                      minOpacity={0.2}
                    />
                  </Text>)
                  }
                  { this.state.showIncorrectErrorCode &&
                    (<Text style = {styles.showError} >You've enter the wrong Pin!.Please Try Again. </Text>)
                  }    
                  <Text style = {{ marginTop: "10%", fontSize: 16 }} > 
                    Didn't get an SMS? 
                    <TouchableOpacity
                      onPress = {()=> this.props.onSendPinAgain()  }
                    >
                    <Text
                      style = {styles.sendAgainText}
                    >Send Again</Text>
                    </TouchableOpacity>    
                  </Text>
                </View>
                
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  showError: {
    color: "red",
    marginTop: 10,
    fontSize: 16
  },
  sendAgainText:{ 
    color: 'black', 
    fontWeight: "600", 
    position: 'relative', 
    top: 2, 
    left: 5, 
    textDecorationLine: "underline" 
  },
  smsText: {
    marginTop: 20,
    fontSize: 15,
    lineHeight: 22 
  },
  continueText:{ 
    textAlign: "center", 
    color: "white", 
    fontSize: 18
  },
  socialButtons: {
    flex:4
  },
  orComponent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    flex: 1
  },
  continueButton: {
    backgroundColor: '#ed53ab',
    padding: 20,
    borderRadius: 10
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 0,
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "left",
    fontWeight: '700',
    fontSize: 16
  },
  closeIcon: { 
    width: 20, 
    fontWeight: "200",
    marginLeft: 10 
  },
  inputText: {
    color: "gray",
    borderWidth:0.5, paddingLeft: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    padding: 17
  }
  
});

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUser
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(ModalPinCode);
