import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from "./src/screens/HomeScreen";
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen';
import SplashScreen from './src/screens/SplashScreen';
import MyVibeScreen from './src/screens/MyVibe';
import Screen2 from "./screens/Screen2";
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
// import Icon from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements'
import { Image } from 'react-native'
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
          tabBarIcon: ({ tintColor }) => (
            <Icon
             name='ios-home'
             type = 'ionicon'
             color = {tintColor}  
            />
            // <Icon name="heart"  color = {tintColor} size = {24} ></Icon>
          )
        }      
      }}
    />
    <Tab.Screen
      name="Screen 2"
      component={SecondScreenNavigator}  // Replaced Screen 2
      options = 
      {
        {
          tabBarLabel: 'SAVED',
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-heart"
              type = 'ionicon'  
              color = {tintColor} 
            />
          )
        }
      }
    />
    <Tab.Screen
      name="Screen 3"
      component={MyVibeTab}  // Replaced Screen 3
      options = 
      {
        {
          tabBarLabel: 'My Vibe',
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-settings"
              type = 'ionicon'  
              color = {tintColor} 
            />
          )
        }
      }
    />
     <Tab.Screen
      name="Screen 4"
      component={MyVibeTab}  // Replaced Screen 3
      options = 
      {
        {
          tabBarLabel: 'Profile',
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-person"
              type = 'ionicon'  
              color = {tintColor} 
            />
          )
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
    </Stack.Navigator>
  );
}

export {FirstScreenNavigator}; // Stack-Navigator for Screen 1 Tab

const SecondScreenNavigator = () => {
    return (
      <Stack.Navigator >
        <Stack.Screen
          name="Screen 2"
          component={Screen2}
        />
         <Stack.Screen
          name="NestedScreen2"
          component={HomeScreen}
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
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}

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
          { title: " Setting My Vibe ",
            headerShown: true,
            headerLeft: () => {return null} 
          }}
        />
      </Stack.Navigator>
    );
  }
  
  export {MyVibeTab}; 