import React, {Component} from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import searchScreen from './src/screens/searchScreen';
import resultScreenDetail from './src/screens/ResultDetailScreen';
import wowzaStreamingScreen from './src/screens/WowzaStreamingScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import LoginScreen from './src/screens/LoginScreen';
import SplashScreen from './src/screens/SplashScreen';
import { Button, Image, View, AsyncStorage , StyleSheet, Platform, Text} from "react-native";
import SignUpScreen from './src/screens/SignUpScreen';
import HeaderBar from './src/components/header';
import * as Facebook from 'expo-facebook';
import { removeStorageItem } from "./src/components/localStorage";


// import React from 'react';
// import { StyleSheet, Text, View, Image } from 'react-native';

// import {  createBottomTabNavigator } from 'react-navigation-stack'
// import Icon from 'react-native-vector-icons/Ionicons'
// import Explore from './screens/Explore'
// import Saved from './screens/Saved'
// import Inbox from './screens/Inbox'
// import Trips from './screens/Trips'




// export default  createBottomTabNavigator({
//   Explore: {
//     screen: Explore,
//     navigationOptions: {
//       tabBarLabel: 'EXPLORE',
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-search-outline" color={tintColor} size={24} />
//       )
//     }
//   },
//   Saved: {
//     screen: Saved,
//     navigationOptions: {
//       tabBarLabel: 'SAVED',
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-heart-outline" color={tintColor} size={24} />
//       )
//     }
//   },
//   Trips: {
//     screen: Trips,
//     navigationOptions: {
//       tabBarLabel: 'TRIPS',
//       tabBarIcon: ({ tintColor }) => (
//         <Image source={require('./assets/airbnb.png')} style={{ height: 24, width: 24, tintColor: tintColor }} />
//       )
//     }
//   },
//   Inbox: {
//     screen: Inbox,
//     navigationOptions: {
//       tabBarLabel: 'INBOX',
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-chatboxes-outline" color={tintColor} size={24} />
//       )
//     }
//   },
//   Profile: {
//     screen: Inbox,
//     navigationOptions: {
//       tabBarLabel: 'PROFILE',
//       tabBarIcon: ({ tintColor }) => (
//         <Icon name="ios-person-outline" color={tintColor} size={24} />
//       )
//     }
//   }
// }, {
//     tabBarOptions: {
//       activeTintColor: 'red',
//       inactiveTintColor: 'grey',
//       style: {
//         backgroundColor: 'white',
//         borderTopWidth: 0,
//         shadowOffset: { width: 5, height: 3 },
//         shadowColor: 'black',
//         shadowOpacity: 0.5,
//         elevation: 5
//       }
//     }
//   })

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });








// const removeStorageItem = (navigation) => {
//   AsyncStorage.setItem('UserId', JSON.stringify(null)).then((value)=>{
//     navigation.navigate('SplashScreen')
//   })
// }

const styles = StyleSheet.create({
  androidButton: {
    flex: 1
  },
  iosButton: {
    flex: 1
  }
})

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const navigator = createStackNavigator(
  { searchScreen: {
    screen: searchScreen,
    navigationOptions: ({navigation}) => ({
      title: `SearchScreen`,
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: 'white'
      },
      animation: 'spring',
      options:  {
        transitionSpec: {
          open: config,
          close: config,
        },
        gestureDirection: {
        vertical : true
        }

      },
      headerRight: () => {
        return (
          <View style = {{flexDirection : 'row'}}>
            {/* <Button
              onPress={() => navigation.navigate('searchScreen')}
              title="Home"
              color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
              style={{ flex: 1 }}
              transparent
            />
            <Button
              onPress={() => navigation.navigate('ScheduleScreen', {
                navigation,
                showButton: true
              })}
              title="Schedule"
              color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
              style = {{flex: 1}}
            /> */}
            <Button
              onPress={() => removeStorageItem(navigation)}
              title="Logout"
              color="#E45217"
              style = {{flex: 1}}
            />
          </View>
        )
        return null;
      },
      headerTitle : props => {
        // return (<Image style = {{width: 100, height: 27}} source = {{ uri: "https://ultrastreaming.tv/wp-content/uploads/2020/06/logo-1.png"}}/>)
        return null;
      },
      headerTitleAlign: 'left',
      headerRightContainerStyle: { marginRight: '5%' },
      headerTransparent: false,
      headerLeft: () => {return <Text style ={{ fontSize: 20, marginLeft: 20 }} >Bar peak</Text>}
    })
  },
    resultScreenDetail: {
      screen: resultScreenDetail,
      navigationOptions: ({navigation}) => ({
        title: `SearchScreen`,
        headerBackTitle: null,
        headerStyle: {
          backgroundColor: '#111314'
        },
        headerRight: () => {
          return (
            <View style = {{flexDirection : 'row'}}>
              <Button
                onPress={() => navigation.navigate('searchScreen')}
                title="Home"
                color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
                style = {{flex: 1 }}
              />
              <Button
                onPress={() => navigation.navigate('ScheduleScreen',{showButton: true})
                }
                title="Schedule"
                color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
                style = {{flex: 1}}
              />
              <Button
                onPress={() => removeStorageItem(navigation)}
                title="Logout"
                color="#E45217"
                style = {{flex: 1}}
              />
            </View>
          )
        },

        headerTitle : props => {
          return (<Image style = {{width: 100, height: 27}} source = {{ uri: "https://ultrastreaming.tv/wp-content/uploads/2020/06/logo-1.png"}}/>)
        },
        headerTitleAlign: 'left',
        headerRightContainerStyle: { marginRight: '5%'},
        headerLeft: () => {return null}
      })
    },
    ScheduleScreen: {
      screen: ScheduleScreen,
      navigationOptions: ({navigation}) => ({
        title: `ScheduleScreen`,
        headerBackTitle: null,
        headerMode: 'screen',
        headerStyle: {
          backgroundColor: '#111314'
        },
        header: ({ navigation })=>{ return <HeaderBar show = {false} navigation = { navigation } />  }
      })
    },
    wowzaStreamingScreen: {
      screen: wowzaStreamingScreen,
      navigationOptions: ({navigation}) => ({
        title: `ScheduleScreen`,
        headerBackTitle: null,
        headerStyle: {
          backgroundColor: '#111314'
        },
        headerRight: () => {
          return (
            <View style = {{flexDirection : 'row'}}>
              <Button
                onPress={() => navigation.navigate('searchScreen')}
                title="Home"
                 color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
                style = {{flex: 1}}
              />
              <Button
                onPress={() => navigation.navigate('ScheduleScreen', { showButton: true })}
                title="Schedule"
                color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
                style = {{flex: 1}}
              />
              <Button
                onPress={() => removeStorageItem(navigation)}
                title="Logout"
                color="#E45217"
                style = {{flex: 1}}
              />
            </View>
          )
        },

        headerTitle : props => {
          return (<Image style = {{width: 100, height: 27}} source = {{ uri: "https://ultrastreaming.tv/wp-content/uploads/2020/06/logo-1.png"}}/>)
        },
        headerTitleAlign: 'left',
        headerRightContainerStyle: { marginRight:  '5%' },
        headerLeft: () => {return null}
      })
    },
    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: ({navigation}) => ({
        headerStyle: {
          backgroundColor: '#2b3538',
          margin: 0,
          shadowColor: 'transparent'
        },
        headerShown: false,
        headerLeft: () => {return null}
      })
    },
    SplashScreen: {
      screen: SplashScreen,
      navigationOptions: ({navigation}) => ({
        headerShown: false
      })
    },
    SignUpScreen: {
      screen: SignUpScreen,
      navigationOptions: ( ) => ({
        title: 'Finish Signing Up',
        headerTitle : props => {
          return (
            <View style = {{ borderBottomWidth: 1, borderBottomColor:'black', paddingTop: 10 }} >
              <Text 
                style = 
                {{ 
                  textAlign: 'center', 
                  fontSize: 15, 
                  fontWeight: '600',
                  marginBottom: 10
                }} >
                  Finish Signing up
              </Text>
            </View>
          )
          // return null;
        },
        headerTitleAlign: 'left',
        headerMode: 'screen',
        headerLeft: () => {return null},
        headerBackTitle: null,
        // headerStyle: {
        //   backgroundColor: '#111314'
        // }
      })
    }
  },
  {
    // initialRouteName: 'SplashScreen',
    initialRouteName: 'SplashScreen',
    defaultNavigationOptions: {
      title: '',
    }
  })


 export default createAppContainer(navigator);
