import React from 'react';
import { StyleSheet, TextInput, View, Image, TouchableOpacity, Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Spinner from 'react-native-loading-spinner-overlay';
import axios from '../api/axios';
import {storeUserData} from '../components/localStorage';

const shadowOpt = {
  width:160,
  height:170,
  color:"rgba(0, 0, 0, 0.05)",
  border:2,
  inset: true,
  style:{marginVertical:5}
}

class SignUpComponent extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
      date : '', 
      showPicker: false,
      email: "",
      firstName: "",
      lastName: ""
    }
	}

	componentDidMount(){
    console.log("the passing data", this.props.user );

    if(this.props.user){
      const {email, name } = this.props.user;
      this.setState({ email, firstName: name.split(' ')[0], lastName: name.split(' ')[1] })
    }
  }
  
  onChangeText = (key, val) => {
    this.setState({ [key]: val })
  }

  changeDate = (date) => {
    this.setState({ date: moment(date).format("YYYY-MM-DD"), showPicker: false })
    console.log("the date", moment(date).format("YYYY-MM-DD"))
  }

  signUp = () => {
    this.setState({ spinner: true })
    const {navigation} = this.props;
    let password = this.props.user ? "asdfg" : this.state.password;
    let accountType = this.props.user ? 'social' : "app";
      
    const body = {
      query: `
      mutation{
        createUser(userInput: {email: "${this.state.email}",
        firstName: "${this.state.firstName}", lastName: "${this.state.lastName}", 
        password: "${password}", dob: "${this.state.date}", accountType: "${accountType}"})
        {
          token
          userId
        }
      }
      `
    }
    
    
    axios.post('graphql?',body).then((res)=>{
      console.log("after sign up", res);
      if(res.data.data.createUser){
        storeUserData(res.data.data.createUser)
        this.setState({ spinner: false })
        this.props.closeModal();
        navigation.navigate('HomeApp', { name:  "welcome abubakar" })
      }
      
    }).catch(err =>{
      console.log("the err", err)
      alert("Invalid username or password") 
      this.setState({ spinner: false })
    })
  }

  
	render(){
		return (
      <View style = {styles.container} >
        <Image style = { styles.ImageLogo }  source = {{ uri: "https://i.pinimg.com/originals/89/89/7a/89897a8a430fdc2ca10b14f579dc3551.png" }}  />
        <View style = {styles.inputForm} >   
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
            <DateTimePickerModal
              isVisible={this.state.showPicker}
              mode="date"
              onConfirm = {(date)=> this.changeDate(date)}
              onCancel = {()=>{ this.setState({ showPicker: false }) }}
              style = {{ backgroundColor: 'gray', color: 'gray' }}
            />
            <TextInput
              style={styles.inputText}
              placeholder="SelectBirtday (MM/DD/YYYY)"
              placeholderTextColor="#003f5c"
              onFocus = {()=> this.setState({ showPicker: true }) }
              onChange = {()=> this.setState({ showPicker: true })}
              defaultValue = "SelectBirday(MM/DD/YYYY)"
              value = { this.state.date && this.state.date }
            />
          </View>
          <View style={styles.inputView} >
            <TextInput
              style={styles.inputText, styles.disabledInputStyle, {fontWeight: '600'}}
              placeholder="Email"
              ref= "email"
              // placeholderTextColor="#003f5c"
              value = {this.state.email}
              onChangeText={val => this.onChangeText('email', val)}
            />
          </View>
          { this.props.user &&
            (<View > 
              <Text style = {{lineHeight: 14, marginTop: 10}} >This info came from facebook and not editable.</Text>
            </View>
            )
          }
          { !this.props.user &&(
            <View style = { styles.inputView } >
            <View  >
              <TextInput
                style={styles.inputText}
                placeholder="Password"
                placeholderTextColor="#003f5c"
                onChangeText={val => this.onChangeText('password', val)}
                secureTextEntry
              />
            </View>
            <View  > 
              <Text style = {{lineHeight: 14, marginTop: 10}} >Password must be atleast 5 key words</Text>
            </View>
            </View>
          )
          }
          <TouchableOpacity style={{ backgroundColor: 'black', marginTop: '10%' }} onPress = { ()=>{this.signUp()} } >
            <Text style={styles.SignUpText}>Signup</Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  SignUpText: {
    fontSize: 25,
    color: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  inputForm: {
    marginTop: 0,
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
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
    marginTop: '20%'
  },
  inputView: {
    width: "80%",
    //  backgroundColor: "#465881",
    borderRadius: 7,
    borderWidth: 1,
    height: 50,
    // marginTop: 50,
    marginTop: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "black"
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0
  }
}) 

export default SignUpComponent;