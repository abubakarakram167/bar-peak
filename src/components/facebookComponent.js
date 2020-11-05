import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Facebook from 'expo-facebook';
import { SocialIcon } from 'react-native-elements'
import axios from '../api/axios';
console.disableYellowBox = true;

export default function App(props) {

  const{navigation} = props;
  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);

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
      });

      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync('897285013968583', {
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,birthday,first_name,picture.height(500)`)
          .then(response => response.json())
          .then(async(data) => {
            const userFound = await checkUserExist(data.email);
            console.log("the user found", userFound)
            if(!userFound.data.data.checkUserAvailable)
              navigation.navigate('SignUpScreen', { user: data })
            else  
              navigation.navigate('NestedScreen', { name:  "welcome abubakar" });
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
    // isLoggedin ?
    //   userData ?
    //     <View style={styles.container}>
    //       <Image
    //         style={{ width: 200, height: 200, borderRadius: 50 }}
    //         source={{ uri: userData.picture.data.url }}
    //         onLoadEnd={() => setImageLoadStatus(true)} />
    //       <ActivityIndicator size="large" color="#0000ff" animating={!isImageLoading} style={{ position: "absolute" }} />
    //       <Text style={{ fontSize: 22, marginVertical: 10 }}>Hi {userData.name}!</Text>
    //       <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
    //         <Text style={{ color: "#fff" }}>Logout</Text>
    //       </TouchableOpacity>
    //     </View> :
    //     null
    //   :
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={facebookLogIn}  >
          <View style={styles.socialIcons}>
            <View style={{flex: 0, height: 15, marginLeft: '1%'}} >
              <SocialIcon
                type='facebook'
                style = {{ position: 'relative', bottom: '35%', height: 30, width: 30 }}
              />
            </View> 
            <View style={{flex: 1, height: 15 , marginLeft: '12%' }}  >
              <Text style = {{ color: "black" }}  > Continue With Facebook</Text>  
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
    width: '80%',
    height: 50,
    borderWidth: 1,
    marginTop: 20 
  }
});