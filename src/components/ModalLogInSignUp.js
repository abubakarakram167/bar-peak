import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TextInput,
  TouchableOpacity
} from "react-native";
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux';
import RNPickerSelect from 'react-native-picker-select/src'; 
import axiosApi from 'axios';
import { Ionicons } from '@expo/vector-icons';
import FaceBookComponent from './facebookComponent';
import ModalPinCode from './ModalPinCode';
import AppleComponent from './AppleComponent';
import VerificationComponent from "./VerificationComponent";

const { width, height } = Dimensions.get("window");

class showVibeModal extends Component {
  state = {
    modalSignUpVisible: true,
    allCountries: [],
    phoneNumber: '',
    currentcountry: '',
    showPinModal: false,
    showPhoneError: false,
    phoneNumberPinData: null
  };

  async componentDidMount(){
    const allCountries = await axiosApi.get("https://restcountries.eu/rest/v2/all") ; 
    const allCountriesCode = allCountries.data.map(country =>{
      return {
        label: country.name + '  +' + `(${country.callingCodes[0]})` ,
        value: country.callingCodes[0]
      }
    })
    const defaultCountry  = allCountriesCode.filter(country => country.value === "1" && country.label === "United States of America  +(1)" )[0]
    this.setState({allCountries: allCountriesCode, currentcountry: defaultCountry.value})
  }
  onChangePhoneNumber = (phoneNumber) => {
    this.setState({ phoneNumber })
  }

  renderPinModal= async(verificationId) =>{
    const phoneNo = "+" + this.state.currentcountry + this.state.phoneNumber;
    const data = {
      phoneNo,
      verificationId
    }
    
    if( verificationId){
      this.setState({ showPinModal: true, phoneNumberPinData: data })
    }
  }

  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.showModal}
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
                <View style = {{ flex:2 }} >   
                  <TouchableHighlight
                    style={styles.openButton}
                    onPress={() => {
                      this.props.onCloseModalSignUp()
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
                  style = {{ flex:4 }}
                >
                  <Text style={styles.modalText}>Login or Sign Up</Text>
                </View>
              </View>
              
              <View
                style = {{ width: width * 0.8, height: height * 0.75, borderWidth: 0 }}
              >
                <View
                  style = {{ flex: 1 }}
                >
                  <View
                    style = {{flex: 1, marginTop: 20}}
                  >
                  {  this.state.showPinModal &&
                    (<ModalPinCode 
                      showPinModal = {this.state.showPinModal} 
                      onClose = { ()=> this.setState( {showPinModal: false} ) }  
                      phoneNumberPinData = {this.state.phoneNumberPinData}
                      onSendPinAgain = {()=> this.sendVerificationCode()}
                      navigation = {this.props.navigation}
                      onCloseModalSignUp  = { () =>  this.props.onCloseModalSignUp() }
                      onNavigateSignUpScreen = {this.props.onNavigateSignUpScreen}
                    />)
                  }  
                    <RNPickerSelect      
                      placeholder = {
                        { label: "Unites States +(1)", value: this.state.currentcountry, color: 'black' }
                      }
                      items={ this.state.allCountries }
                      onValueChange={code => {
                        this.setState({ currentcountry: code })
                      }}
                      style={{
                        ...pickerSelectStyles,
                        iconContainer: {
                          top: 10,
                          right: 12,
                        }
                      }}
                      useNativeAndroidPickerStyle={false}
                      textInputProps={{ underlineColor: 'yellow' }}
                      Icon={() => {
                        return <Ionicons name="md-arrow-down" size={20} color="gray" />;
                      }}
                    />
                    <TextInput
                      style={styles.inputText}
                      placeholder="Phone Number Without Country Code"
                      keyboardType='numeric'
                      placeholderTextColor="gray"
                      onChangeText={val => this.onChangePhoneNumber(val)}
                    />
                    { this.state.showPhoneError &&
                    (<Text style = {styles.showError} > 
                      <Icon
                        name='info'
                        type = 'foundation'
                        size = {20}
                        color = 'red'
                        style = {styles.infoIcon}
                      />  
                         Your number is not correct! Please try again wihout country code
                      </Text>)
                    }
                    { !this.state.showPhoneError &&
                    <Text
                      style = {{marginTop: 10, lineHeight: 20, color: '#706f6f'}}
                    >
                      We text you to confirm your number. Pin Will be send to your number 
                    </Text>
                    }
                  </View>
                  <View 
                    style  = {{ flex: 2 }}
                  > 
                    <View style = {{ flex:2, marginTop: 0 }} >
                      <VerificationComponent 
                        currentcountry = {this.state.currentcountry}
                        phoneNumber = {this.state.phoneNumber }
                        onSendVerification = { (verificationId) => this.renderPinModal(verificationId)} 
                      />
                    </View>
                    <View 
                      style={styles.orComponent}
                    >
                      <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                      <View>
                        <Text style={{width: 50, textAlign: 'center'}}>or</Text>
                      </View>
                      <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
                    </View>
                    <View
                      style = {styles.socialButtons}
                    >
                      <FaceBookComponent 
                        onCloseModalSignUp = { this.props.onCloseModalSignUp } 
                        navigation = {navigation} 
                      />
                      <AppleComponent
                        onCloseModalSignUp = { this.props.onCloseModalSignUp } 
                        navigation = {navigation} 
                      /> 
                    </View>
                  </View>
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
  infoIcon: {
    marginRight: 5
  },
  showError: {
    color: "red",
    marginTop: 10
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
    backgroundColor: '#e33446',
    padding: 20,
    paddingTop: 17,
    paddingBottom: 17,
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

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 0.5,
    borderColor: 'gray',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    width: "100%",
    color: 'gray',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

const mapStateToProps = (state) => {
  const {  vibe } = state
  return { 
    vibe: vibe.vibe.vibe
  }
};
export default connect(mapStateToProps)(showVibeModal);;
