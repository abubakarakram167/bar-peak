import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from "./src/screens/HomeScreen";
import userSettings from "./src/screens/userSettings";
import TestScreen from './src/screens/testScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import SplashScreen from './src/screens/SplashScreen';
import MyVibeScreen from './src/screens/MyVibe';
import Screen2 from "./screens/Screen2";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import vibeInfoComponent from "./src/screens/vibeInfoScreen";
import radiusScreen from "./src/screens/radiusScreen";
import editProfileScreen from "./src/screens/EditProfile";
import MyFavouritesScreen from "./src/screens/MyFavourites";
import SpecificCategoryScreen from "./src/screens/specificCategoryFavourite";
import { Icon } from 'react-native-elements'
import {Text, Image, StyleSheet} from 'react-native'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();  // creates object for Stack Navigator

const screenOptions = {
  headerStyle: {
    backgroundColor: '#2b3538',
    margin: 0,
    shadowColor: 'transparent'
  },
  tabBarVisible: false,
  headerShown: false,
  headerLeft: () => {return null}
}


function HomeApp() {
  return (
    <Tab.Navigator
      initialRouteName = "Screen 1"
      tabBarOptions = {{
        activeTintColor: 'red',
        inactiveTintColor: 'grey',
        style: {
          backgroundColor: 'white',
          borderTopWidth: 0,
          shadowOffset: { width: 5, height: 3 },
          shadowColor: 'black',
          shadowOpacity: 0.5,
          elevation: 5
        },
        
      }}
    >
    <Tab.Screen
      name="Screen 1"
      component={HomeTabScreen}  // Replaced Screen 1
      options  = { ({ navigation })=> {
        const currentRoute = navigation.state
        // const { routeName } = currentRoute;
        
        return{
          tabBarVisible: true,
          tabBarLabel: 'Home',
          unmountOnBlur: false,
          tabBarIcon: ( data) => {    
            const { focused } = data;   
            return (
              <Image 
                source = { focused ? require('./assets/icons/ativeHome.png') : require('./assets/icons/home.png')  }
                style = {{ width: 28, height: 28}}
              />
            )      
          },
          tabBarLabel: (data)=> {
            const { focused } = data;
            return <Text style = {  focused ? styles.activeButtonText  : styles.buttonText } >Home</Text>
          }
        }      
      }}
    />
    <Tab.Screen
      name="Screen 2"
      component={SecondScreenNavigator}  // Replaced Screen 2
      options = 
      {
        {
          tabBarLabel: 'My Favorites',
          unmountOnBlur: true,
          tabBarIcon: (data) => {    
            const { focused } = data;   
            return (
              <Image 
                source = { focused ? require('./assets/icons/activeHeart.png') : require('./assets/icons/heart.png')  }
                style = {{ width: 28, height: 28}}
              />
            )      
          },
          tabBarLabel: (data)=> {
            const { focused } = data;
            return <Text style = {  focused ? styles.activeButtonText  : styles.buttonText } >Favorites</Text>
          }
        }
      }
    />
    <Tab.Screen
      name="vibeTabNavigator"
      component={MyVibeTab}  // Replaced Screen 3
      options = 
      {
        {
          tabBarLabel: 'My Vibe',
          unmountOnBlur: true,
          tabBarIcon: (data) => {
            const { focused } = data;   
            return (
              <Image 
                source = { focused ? require('./assets/icons/activeThermometer.png') : require('./assets/icons/thermometer.png')  }
                style = {{ width: 28, height: 28}}
              />
            )  
          },
          tabBarLabel: (data)=> {
            const { focused } = data;
            return <Text style = {  focused ? styles.activeButtonText  : styles.buttonText } >My Vibe</Text>
          }
        }
      }
    />
     <Tab.Screen
      name="Screen 4"
      component={userProfile}  // Replaced Screen 3
      options = 
      {
        { 
          tabBarLabel: 'Profile',
          unmountOnBlur: true,
          tabBarIcon: (data) => {
            const { focused } = data;   
            return (
              <Image 
                source = { focused ? require('./assets/icons/activeProfile.png') : require('./assets/icons/profile.png')  }
                style = {{ width: 28, height: 28}}
              />
            )  
          },
          tabBarLabel: (data)=> {
            const { focused } = data;
            return <Text style = {  focused ? styles.activeButtonText  : styles.buttonText } >Profile</Text>
          }
        }
        
      }
    />
  </Tab.Navigator>
  );
}


const FirstScreenNavigator = () => {
  return (
    <Stack.Navigator 
      initialRouteName = "SplashScreen" 
    > 
      <Stack.Screen
        name="HomeApp"
        component={HomeApp}
        options = { ()=> {return screenOptions} }
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options = { ({ navigation })=> {
          return screenOptions} 
        }
      />
      <Stack.Screen
        name="SplashScreen"
        component={SplashScreen}
        options = { ()=> {return screenOptions} }
      />
      <Stack.Screen
        name="SignUpScreen"
        component={SignUpScreen}
        options = { ()=> {return screenOptions} }
      />
      <Stack.Screen
        name="TestScreen"
        component={TestScreen}
        options = { ()=> {return screenOptions} }
      />
    </Stack.Navigator>
  );
}

export {FirstScreenNavigator}; // Stack-Navigator for Screen 1 Tab

const SecondScreenNavigator = () => {
    return (
      <Stack.Navigator >
        <Stack.Screen
          name="My Favorites"
          component={MyFavouritesScreen}
          options = { ()=> {return screenOptions} }
        />
         <Stack.Screen
          name="SpecificCategoryFavourites"
          component={SpecificCategoryScreen}
          options = { 
            { title: "",
              unmountInactiveRoutes: true 
            }
          }
        />
      </Stack.Navigator>
    );
}

const HomeTabScreen = () => {
  return (
    <Stack.Navigator initialRouteName = "Home" >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options = { ()=> {return screenOptions} }
      />
    </Stack.Navigator>
  );
}

  
  export {SecondScreenNavigator}; // Stack-Navigator for Screen 2 Tab

  const MyVibeTab = () => {
    return (
      <Stack.Navigator >
        <Stack.Screen
          name="myVibe"
          component={MyVibeScreen}
          options = {
            { title: "Setting My Vibe",
              headerShown: true,
              headerLeft: () => {return null},
              unmountInactiveRoutes: true, 
              headerStyle: { backgroundColor: '#b3b5b4' },
              headerTitleStyle: {
                color: 'black'
              }
            }
          }
        />
      </Stack.Navigator>
    );
  }
  
  export {MyVibeTab}; 

  const userProfile = () => {
    return (
      <Stack.Navigator initialRouteName = "userSettingOptions" >
        <Stack.Screen
          name="userSettingOptions"
          component={userSettings}
          options = {
          { title: "Settings",
            headerShown: true,
            headerLeft: () => {return null} 
          }}
        />
        <Stack.Screen
          name="vibeInfo"
          component={vibeInfoComponent}
          options = {
          { title: "Your Vibe's",
            headerShown: true,
           
          }}
        />
        <Stack.Screen
          name="radiusScreen"
          component={radiusScreen}
          options = {{ 
            title: "Select Radius",
            headerShown: true,   
          }}
        />
        <Stack.Screen
          name="editProfileScreen"
          component={editProfileScreen}
          options = {
          { title: "Edit Profile",
            headerShown: true,
           
          }}
        />
      </Stack.Navigator>
    );
  }
  
  export {userProfile}; 

  const styles= StyleSheet.create({
    activeButtonText:{ 
      fontSize: 14, 
      fontWeight: '600', 
      color: 'black' 
    },
    buttonText: {
      fontSize: 12
    }
  })