import React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text, KeyboardAvoidingView , ScrollView, Alert, Dimensions} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import RNPickerSelect from 'react-native-picker-select';  
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlertComponent from '../components/AlertComponent';
import { removeStorageItem } from '../components/localStorage';
import { updateUser } from '../../redux/actions/User';
import ImageUploader from '../components/ImageUploader';
import DatePicker from '../components/DatePicker';

const { height, width } = Dimensions.get('window')

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

const keyboardVerticalOffset = Platform.OS === 'ios' ? 200 : 0

class SignUpComponent extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
      date : null, 
      showPicker: false,
      email: "",
      firstName: "",
      lastName: "",
      showAlert: true,
      message: "",
      showError: false,
      gender: "",
      password: "",
      newEmail: null
    }
	}

	componentDidMount(){
    const { user } = this.props.user.user;
    console.log("the user", user);
    this.setState({
      date: user.dob,
      existingEmail: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      gender: user.gender
    })
  }
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  makeLogout = () => {
    const { navigation } = this.props
    removeStorageItem(navigation);
  }

  changeDate = (date) => {
    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false })
    setTimeout(()=>  this.setState({ showPicker: false }) , 1300)
    console.log("the date", moment(date).format("YYYY-MM-DD"))
  }

  updateUser = async() => {
    this.setState({ spinner: true })
    const {navigation} = this.props;    
  
    try{
      const isSameEmail=  await this.props.updateUser(this.state)
      console.log("is Email Change", isSameEmail)
      if(!isSameEmail)
        this.makeLogout()
      else{
        navigation.navigate('Screen 1')  
      }
      
    }catch(err){
      console.log("the eroorrr", err)
      this.setState({ spinner: false, message: err, showError: true })
    }
  }

  changeDate = (date) => {
    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false })
    setTimeout(()=>  this.setState({ showPicker: false }) , 1300)
  
  }
  
	render(){
    const { user } = this.props.user.user;
		return (
      <View style = {styles.container} >
        <ImageUploader profilePic = {user.profilePic} onUpload = {(url)=>{  this.setState({ profilePic: url })  }} />
        { this.state.showError && <AlertComponent 
            showError = {this.state.showError}  
            message = {this.state.message} 
            closeModal = { ()=> this.setState({ showError: false  }) }  
        />}
        <View style = {styles.inputForm} >
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style ={{ flex:1 }} >  
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
                  dob = { this.state.date && this.state.date }
                  onChange = { (date)=> { 
                    this.changeDate(date)
                  }} 
                />
              </View>
            { user.accountType === "app" &&
              <View>
                <View>
                  <View style={styles.inputView} >
                    <TextInput
                      style={ styles.inputText }
                      placeholder="Email"
                      ref= "email"
                      placeholderTextColor="#003f5c"
                      value = {this.state.existingEmail}
                      onChangeText={val => this.onChangeText('existingEmail', val)}
                    />
                  </View>         
                </View>
                <View>
                  <View style={styles.inputView} >
                    <TextInput
                      style={ styles.inputText }
                      placeholder="New Email"
                      placeholderTextColor="#003f5c"
                      value = {this.state.newEmail}
                      onChangeText={val => this.onChangeText('newEmail', val)}
                    />
                  </View>         
                </View>
              </View>
            }
              <View style = { [styles.inputView, { padding: 0, paddingLeft: 20 }] } >
                <RNPickerSelect
                  style={[styles.inputText ]}
                  placeholderTextColor="black"
                  value = {this.state.gender}
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
              <TouchableOpacity style={{ width: '40%',alignSelf: 'center' ,backgroundColor: 'black', marginTop: '10%', borderRadius: '10%' }} onPress = { ()=>{this.updateUser()} } >
                <Text style={styles.SignUpText}>Update</Text>
              </TouchableOpacity>
            {/* </KeyboardAvoidingView>
          </ScrollView> */} 
          </KeyboardAwareScrollView>   
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

const mapStateToProps = (state) => {
  const { user} = state
  return { 
    user
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    updateUser
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(SignUpComponent);

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
    color: "black",
    width: width * 0.7
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0,
    width: "100%"
  }
}) 

