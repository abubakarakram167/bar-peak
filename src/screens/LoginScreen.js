import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Modal, Button } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FaceBookComponent from '../components/facebookComponent';
import {storeUserData} from '../components/localStorage';
import axios from '../api/axios';
import { getUser } from '../../redux/actions/User';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlertComponent from '../components/AlertComponent';
import * as Animatable from 'react-native-animatable';
import { KeyboardAwareView } from 'react-native-keyboard-aware-view'
import BottomDarawer from  "../components/BottomDarawer";
import LoginSignupModal from "../components/ModalLogInSignUp"; 


 class LoginScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username:"",
      password:"",
      spinner: false,
      showModal: true,
      showError: false,
      showAnimatedTextFadeIn: true,
      showAnimatedTextFadeOut: false,
      showSignUpModal: false
    }
  }

  ActivityIndicatorLoadingView() {
    return (
      <ActivityIndicator
         color="#009688"
         size="large"
         style={styles.ActivityIndicatorStyle}
      />
    );
  }

  authenticateUser = () =>{
    this.setState({ spinner: true })
    const {navigation} = this.props;
    
    const body = {
      query:`
      query{
        login(email: "${this.state.username}", password: "${this.state.password}")
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
            accountType
          }
        }
      }
      `
    }

    
    axios.post(`graphql?`,body).then((res)=>{
      if(res.data.data.login){
        console.log("the data", res.data.data.login)
        storeUserData(res.data.data.login).then(async() => {
          this.setState({ spinner: false });
          const user = await this.props.getUser();
          if(user === 'ok')
            navigation.navigate('HomeApp');
        })
      }
    }).catch(err => {
        const {errors} =  err.response.data; 
        const { message } = errors[0]; 
        this.setState({ spinner: false, message, showError: true })
    })
      
  }

  componentDidMount(){
    setTimeout(()=>{
      this.setState({ showAnimatedTextFadeIn: false },()=>{
        this.setState({ showAnimatedTextFadeOut: true }, ()=>{
          setTimeout(()=>{
            this.setState({ showModal: false }, ()=> {
              this.setState({ showSignUpModal: true })
            })
          }, 500)
        })
      })
    }, 1000)
  }

  static options = {
    tabBarVisible: false,
  }

  render(){
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        {/* <Modal
          visible={this.state.showModal}
          animationType="fade"
          presentationStyle="overFullScreen"
          transparent={true}
          startInLoadingState={true}
        >
          <View style={ styles.modal }>
            <View style={styles.modalContainer}>
              <View 
                style = {{ justifyContent: 'center', alignItems: 'center' }} 
              >
                { this.state.showAnimatedTextFadeIn && <Animatable.Text duration = {3000} style = {{ fontSize: 30,fontWeight: '700', color: "#3c6e55" }} animation="fadeInLeftBig">Welcome to BarPeak</Animatable.Text> }
                { this.state.showAnimatedTextFadeOut && <Animatable.Text duration = {3000} style = {{ fontSize: 30,fontWeight: '700', color: "#3c6e55" }}  animation="fadeOut">Welcome to BarPeak</Animatable.Text> }
              </View>
            </View>
          </View>
        </Modal>  */}
       
        <Image style = { styles.ImageLogo }  source = {require('../../assets/welcomeScreen.png') }  />
 
        <View style = {styles.loginContainer} >
          {/* <TouchableOpacity style={styles.SignUpBtn} onPress = { ()=>{ this.props.navigation.navigate("SignUpScreen") } } >
            <Text style={styles.SignUpText}>Signup Test</Text>
          </TouchableOpacity> */}
          <TouchableOpacity 
            style={styles.SignUpBtn} 
            onPress = { ()=> this.setState({ showSignUpModal: true })  } 
          >
            <Text style={styles.loginText}>Sign Up / Log In</Text>
          </TouchableOpacity>
        </View>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        />
        <AlertComponent 
          showError = {this.state.showError}  
          message = {this.state.message} 
          closeModal = { ()=> this.setState({ showError: false  }) }  
        />
        <LoginSignupModal 
          showModal = {this.state.showSignUpModal}  
          navigation = {this.props.navigation} 
          onCloseModalSignUp = {()=> this.setState({ showSignUpModal: false })}
          onNavigateSignUpScreen = {(phoneNumber)=> this.props.navigation.navigate("SignUpScreen", {phoneNumber}) }
        />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUser
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(LoginScreen);

const styles = StyleSheet.create({
  
  loginContainer:{ 
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
    flex:1
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '80%',
    height: 50,
    borderWidth: 1,
    marginTop: 20 
  },
  emailView:{
    justifyContent: 'center',
    alignItems: 'center'
  },
  sendEmailBtn:{
    width: '30%',
    height: '30%',
    backgroundColor:"#fb5b5a",
    borderRadius:25,
    marginTop:20,
    marginBottom:10,
    paddingTop: 5
  },
  loginText:{
    color: 'white',
    fontSize: 15
  },
  signUpText:{
    color: 'white',
    fontSize: 15
  },
  inputForgotPasswordView: {
    width:"80%",
    backgroundColor:"#465881",
    borderRadius:25,
    height:50,
    marginLeft: '10%',
    marginTop: '20%',
    justifyContent:"center",
    alignItems: 'center',
    padding:20
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0
  },
  logo:{
    fontWeight:"bold",
    fontSize:50,
    color:"#fb5b5a",
    marginBottom:40
  },
  inputView:{
    backgroundColor:"white",
    borderWidth: 1,
    marginBottom:10,
    borderColor: '#C5C3C2',
    justifyContent:"center",
    padding:10
  },
  inputText:{
    height:20,
    color:"black"
  },
  forgot:{
    color:"#D83F68",
    fontSize:17,
    marginTop: 10
  },
  loginBtn:{
    width:"80%",
    backgroundColor:"#5ED666",
    height:40,
    color:'white',
    alignItems:"center",
    justifyContent:"center",
    marginTop:10,
    marginBottom:10,
    borderRadius: 6
  },
  SignUpBtn: {
    width:"80%",
    alignItems:"center",
    justifyContent:"center",
    marginBottom:0,
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 40,
    color:'white',
    backgroundColor:"white",
    borderRadius: 6,
    backgroundColor:"#D83F68"
  },
  SignUpText: {
    color:"white",
    fontSize: 17
  },
  ImageLogo:{
    width: '100%',
    height: '45%',
    marginBottom: "10%",
    backgroundColor: 'white',
    marginTop: 0
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  modal : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: '23%'
  },
  modalContainer : {
    backgroundColor : 'white',
    width : '100%',
    height : '30%',
    justifyContent: 'center'
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  }

});
