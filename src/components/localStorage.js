 import {AsyncStorage} from 'react-native';


export const storeUserData = async({ token, user }) => {
   console.log("the user ID in local storage", user._id)
  try {
    await AsyncStorage.setItem(
    'UserId', JSON.stringify(user._id)
    );
  } catch (error) {
    console.log("thee error on saving", error)
  }
  try {
    await AsyncStorage.setItem(
    'Token', JSON.stringify(token)
    );
  } catch (error) {
    console.log("thee error on saving", error)
  }
  return;
};

export const getUserData = async () => {
  const userId = await AsyncStorage.getItem('UserId')  
  const token = await AsyncStorage.getItem('Token')
  return {
    userId,
    token:  token && token.replace(/^"(.+(?="$))"$/, '$1')
  }
};

export const removeStorageItem = (navigation) => {
  AsyncStorage.clear().then(()=>{
    console.log("in under func", navigation)
    navigation.navigate('SplashScreen')
  });
}
