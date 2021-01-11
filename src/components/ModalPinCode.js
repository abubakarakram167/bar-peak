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
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import SmoothPinCodeInput  from 'react-native-smooth-pincode-input';
import axios from '../api/axios';
import * as firebase from 'firebase';

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
    user: {},
    showIncorrectErrorCode: false
  };

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
    const res = await axios.post(`graphql?`,body)
    console.log("the user data", res.data.data.getUserByPhoneNumber)
    if(res.data.data.getUserByPhoneNumber)
      this.setState({user: res.data.data.getUserByPhoneNumber})
  }

  verifyCode = async (code) => {
    const { phoneNumberPinData } = this.props;
    const verificationId = phoneNumberPinData.verificationId;
    const verificationCode = code;
    console.log(`the verification id ${verificationId} and verification code: ${verificationCode}`);
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId ,
        verificationCode
      );
      const getResult = await firebase.auth().signInWithCredential(credential);
      if(getResult){
        console.log("the user", this.state.user)
      }
      console.log("the getResult", getResult)
      // showMessage({ text: 'Phone authentication successful 👍' });
    } catch (err) {
      console.log("the error", err)
      this.setState({ showIncorrectErrorCode: true })
    }
  }

  render() {
    const {phoneNumberPinData} = this.props;
    console.log("the data", this.props)
    return (
      <View style={styles.centeredView}>
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
                  style = {{ flex: 1 }}
                >
                  <Text style = {styles.smsText} >Enter The Code We Sent Over SMS to {phoneNumberPinData.phoneNo}</Text>
                  <SmoothPinCodeInput
                    cellStyle={{
                      borderWidth: 1,
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

const mapStateToProps = (state) => {
  const {  vibe } = state
  return { 
    vibe: vibe.vibe.vibe
  }
};
export default connect(mapStateToProps)(ModalPinCode);;
