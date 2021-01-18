import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Facebook from 'expo-facebook';
import { SocialIcon } from 'react-native-elements'
import { Icon } from 'react-native-elements'
import axios from '../api/axios';
import {storeUserData} from '../components/localStorage';
import { useDispatch } from 'react-redux';

console.disableYellowBox = true;

export default function App(props) {

  console.log("the props", props)
  const{navigation, onCloseModalSignUp} = props;
  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  const dispatch = useDispatch();

  const checkUserExist = async(email) => {
    const body = {
      query: `
      query{
        checkUserAvailable(email: "${email}") 
      }
      `
    }
    try{
     
      const userAvailable = await axios.post('graphql?', body);
      return userAvailable;
    }catch(err){
      console.log("the error", err)
    }
  }

  const facebookLogIn = async () => {
    try {

      await Facebook.initializeAsync({
        appId: '402918750725114',
        appName: "Bar Peak"
      });

      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,birthday,first_name,picture.height(500)`)
          .then(response => response.json())
          .then(async(data) => {
            const { email, name } = data;
            const userFound = await checkUserExist(email);
            // console.log("the user found", userFound)
            if(!userFound.data.data.checkUserAvailable){
              onCloseModalSignUp();
              let userData = { 
                email, 
                firstName: name.split(' ')[0], 
                lastName: name.split(' ')[1],
                socialSource: "facebook"
              }
              
              navigation.navigate('SignUpScreen', { user: userData })
            }
            else{
              const body = {
                query:`
                query{
                  login(email: "${data.email}")
                  {
                    token,
                    user{
                      _id
                      firstName
                      radius
                      lastName
                      email
                      dob
                      gender
                      accountType,
                      phoneNumber
                    }
                  }
                }
                `
              }
              axios.post(`graphql?`,body).then((res)=>{
                console.log("in login facebook", res)
                if(res.data.data.login){
                  storeUserData(res.data.data.login).then( async () => {
                    dispatch({
                      type: 'Fetch_User',
                      payload: res.data.data.login.user
                    })
                    onCloseModalSignUp();
                    navigation.navigate('HomeApp');
                  })
                }
              }).catch(err => {
                  console.log("the login error", err)
                  alert("Invalid username or password") 
              })
            }  
              
            setLoggedinStatus(true);
            setUserData(data);
          })
          .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      console.log("the message", message)
      alert(`Facebook Login Error: ${message}`);
    }
  }

  const logout = () => {
    setLoggedinStatus(false);
    setUserData(null);
    setImageLoadStatus(false);
  }

  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity onPress={facebookLogIn}  >
        <View style={styles.socialIcons}>
          {/* <View style={{flex: 0, height: 10, marginLeft: '1%'}} >
            <SocialIcon
              type='facebook'
              style = {{ position: 'relative', bottom: '35%', height: 20, width: 20 }}
            />
            
          </View>  */}
          <View style={{flex: 1 , marginLeft: '12%', borderRadius: 10, flexDirection: "row" }}  >
            {/* <SocialIcon
              type='facebook'
              style = {{ position: 'relative', bottom: '35%', height: 10, width: 10 }}
            /> */}
            <Icon
              name='social-facebook'
              type = 'foundation'
              size = {21}
              color = 'blue'
              
            />
            <Text style = {{ color: "black", fontWeight: "600", fontSize: 17 }}  > Continue With Facebook</Text>  
          </View> 
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    margin: 0
  },
  container: {
    flex: 1,
    backgroundColor: '#e9ebee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginBtn: {
    backgroundColor: '#4267b2',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  logoutBtn: {
    backgroundColor: 'grey',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    position: "absolute",
    bottom: 0
  },
  socialIcons: {
    flexDirection: 'row',
    justifyContent: 'center', 
    alignItems: 'center',
    width: '100%',
    height: 50,
    borderWidth: 0.5,
    marginTop: 20 ,
    borderRadius: 7
  }
});