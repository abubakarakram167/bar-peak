import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, AsyncStorage, ActivityIndicator, Modal, Button } from 'react-native';
import { withNavigation } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FaceBookComponent from '../components/facebookComponent';
import {storeUserData} from '../components/localStorage';
import axios from '../api/axios';
import { getUser } from '../../redux/actions/User';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import AlertComponent from '../components/AlertComponent';

 class LoginScreen extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      username:"",
      password:"",
      spinner: false,
      showModal: false,
      showError: false
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
          }
        }
      }
      `
    }

    
    axios.post(`graphql?`,body).then((res)=>{
      if(res.data.data.login){
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

  static options = {
    tabBarVisible: false,
  }

  render(){
    const {navigation} = this.props;
    return (
      <View style={styles.container}>
        <Modal
          visible={this.state.showModal}
          animationType="fade"
          presentationStyle="overFullScreen"
          transparent={true}
          startInLoadingState={true}
        >
          <View style={ styles.modal }>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                onPress={() => this.setState({  showModal: false  })}
                style={{ position: 'absolute', right: 5, top: 10, zIndex: 4 }} >
                <Icon
                  name={'close'}
                  color={'black'}
                  size={30}
                />
              </TouchableOpacity>
              <View style={styles.inputForgotPasswordView} >
                <TextInput
                  style={styles.inputText }
                  placeholder="Email or Username"
                  placeholderTextColor="#003f5c"
                  onChangeText={username => this.setState({username: username})}
                />
              </View>
              <View style = {styles.emailView} >
                <TouchableOpacity style={styles.sendEmailBtn} onPress={() => this.sendEmail() } >
                  <Text style = {{ textAlign: 'center' }}>Send Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal> 
       
        <Image style = { styles.ImageLogo }  source = {{ uri: "https://i.pinimg.com/originals/89/89/7a/89897a8a430fdc2ca10b14f579dc3551.png" }}  />
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Email or Username"
            placeholderTextColor="#003f5c"
            onChangeText={username => this.setState({username: username})}
          />
        </View>
        <View style={styles.inputView} >
          <TextInput
            style={styles.inputText}
            placeholder="Password..."
            placeholderTextColor="#003f5c"
            onChangeText={password => this.setState({password: password})}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress = {()=>{ this.authenticateUser() } } >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress = { ()=>{ this.sendEmail() } } >
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.SignUpBtn} onPress = { ()=>{ this.props.navigation.navigate("SignUpScreen") } } >
          <Text style={styles.SignUpText}>Signup</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '80%'}}>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
          <View>
            <Text style={{width: 50, textAlign: 'center'}}>or</Text>
          </View>
          <View style={{flex: 1, height: 1, backgroundColor: 'black'}} />
        </View>
  
        <FaceBookComponent navigation = {navigation} />
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
    width:"80%",
    backgroundColor:"white",
    borderWidth: 1,
    height:'6%',
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
    backgroundColor:"#D83F68",
    height:40,
    color:'white',
    alignItems:"center",
    justifyContent:"center",
    marginTop:20,
    marginBottom:10,
    borderRadius: 6
  },
  SignUpBtn: {
    width:"80%",
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginBottom:10,
    backgroundColor:"white",
    borderRadius: 6
  },
  SignUpText: {
    color:"#D83F68",
    fontSize: 17
  },
  ImageLogo:{
    width: '100%',
    height: '35%',
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
    height : '30%'
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  }

});
