import * as AppleAuthentication from 'expo-apple-authentication';
import React, { Component } from "react";
import * as SecureStore from 'expo-secure-store';
import axios from '../api/axios';
import {storeUserData} from '../components/localStorage';
import { useDispatch } from 'react-redux';

export default function AppleComponent(props){

  const{navigation, onCloseModalSignUp} = props;
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

  const loginUser = async (email) => {
    console.log("the email on getting", email)
    const body = {
        query:`
        query{
          login(email: "${email}")
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
        console.log("in login apple", res)
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
          console.log("the login error", err.response)
          alert("Invalid username or password") 
      })
    
  }

  const getUserByAppleIdandUpdateEmail = async (email, appleId) => {
    
    const body = {
      query: `mutation{ 
        getUserByAppleIdAndUpdateEmail(email: "${email}", appleId: "${appleId}" ){
          email
        }
      }`
    }

    try{  
      const res = await axios.post(`graphql?`,body)
      console.log("on response", res.data.data.getUserByAppleIdAndUpdateEmail)
      return res.data.data.getUserByAppleIdAndUpdateEmail;
    }catch(err){
      console.log("the err", err)
    }

  }
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.WHITE_OUTLINE}
      cornerRadius={5}
      style={{  height: 50,marginBottom: 70, borderRadius: 20 }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL,
            ],
          });
          const fetchUser =  await SecureStore.getItemAsync(credential.user)  
          if(! fetchUser){
            let user = {
              email: credential.email,
              fullName: credential.fullName
            }
            await SecureStore.setItemAsync(credential.user, JSON.stringify(user))
          }
          else{
            let parsedUserData = JSON.parse(fetchUser);
            if(parsedUserData.email !== credential.email  && credential.email){
              const getUpdatedUserData = await getUserByAppleIdandUpdateEmail(credential.email, credential.user)
              parsedUserData.email = getUpdatedUserData.email;
              await SecureStore.setItemAsync(credential.user, JSON.stringify(parsedUserData))
            }
          }
          
          const newlyFetchedUser = await SecureStore.getItemAsync(credential.user);
          const parsedUser = JSON.parse(newlyFetchedUser);
          console.log("the parsed User", parsedUser)
          const userFound = await checkUserExist(parsedUser.email);
          if(!userFound.data.data.checkUserAvailable){
            const { fullName } = parsedUser;
            const user = {
              email: parsedUser.email,
              firstName: fullName.givenName,
              lastName: fullName.familyName,
              socialSource: "Apple"
            }
            onCloseModalSignUp();
            navigation.navigate('SignUpScreen', { user })
          }  
          else  
            await loginUser(parsedUser.email)

        } catch (e) {
            console.log("the error", e)
          if (e.code === 'ERR_CANCELED') {
            // handle that the user canceled the sign-in flow
          } else {
            // handle other errors
          }
        }
      }}
    />
  );
}