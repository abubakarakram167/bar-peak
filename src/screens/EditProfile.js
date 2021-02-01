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
import NativeDatePicker from '../components/DatePicker/DatePicker';

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
      newEmail: null, 
      profilePic: null,
      disableButton: false
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
      console.log("before t", this.state)
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
        <ImageUploader 
          profilePic = {user.profilePic} 
          onUpload = {(url)=>{  
            console.log("before upload", url)
            this.setState({ profilePic: url, disableButton: false }, ()=> { 
              console.log("the profile", this.state) 
            })  
          }} 
          disable = { ()=>  this.setState({ disableButton: true })}
        />
        { this.state.showError && <AlertComponent 
            showError = {this.state.showError}  
            message = {this.state.message} 
            closeModal = { ()=> this.setState({ showError: false  }) }  
        />}
        <View style = {styles.inputForm} >
            <KeyboardAwareScrollView showsVerticalScrollIndicator={false} style ={{ flex:1 }} >  
              <Text style = {{ fontSize: 16, marginLeft: 2, fontWeight: '600' }} >First Name</Text>
              <View style={styles.inputView} >
                <TextInput
                  style={[styles.inputText]}
                  placeholder="First Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={val => this.onChangeText('firstName', val)}
                  value = {this.state.firstName}
                />
              </View>
              <Text style = {{ fontSize: 16, marginLeft: 2, fontWeight: '600', marginTop: 20 }} >Last Name</Text>
              <View style={[styles.inputView, { marginBottom:0 }]} >
                <TextInput
                  style={styles.inputText}
                  placeholder="Last Name"
                  placeholderTextColor="#003f5c"
                  onChangeText={val => this.onChangeText('lastName', val)}
                  value = {this.state.lastName}
                />
              </View>
              {/* <TouchableOpacity
                style = {{ marginTop: 20 }}
                onPress = {()=> this.setState({ showDatePicker: !this.state.showDatePicker }) }
              >
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
              <NativeDatePicker 
                show = {this.state.showDatePicker} 
                onClose = { ()=> { this.setState({ showDatePicker: false }) } }  
                date = {this.state.date}
                changeDate = { (date)=> this.changeDate(date) }
              />  */}

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
                      placeholder="Change Email"
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
                    { label: 'Please Select Your Gender (Optional)', value: null, color: 'black' }
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
              <TouchableOpacity 
                style={styles.updateButton} 
                onPress = { ()=>{this.updateUser()} }
                disabled = {this.state.disableButton}
              >
                <Text style={styles.SignUpText}>Update</Text>
              </TouchableOpacity>
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
  updateButton: {
    width: '40%',
    alignSelf: 'center' ,
    backgroundColor: 'black', 
    marginTop: '10%', 
    borderRadius: 10,
    marginBottom: 20 
  },
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
    flex: 2,
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

