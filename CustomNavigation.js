import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from "./src/screens/HomeScreen";
import userSettings from "./src/screens/userSettings";
import SignUpScreen from './src/screens/SignUpScreen';
import MapScreen from './src/screens/MapScreen';
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
import {Text} from 'react-native'

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
          tabBarIcon: ({ tintColor }) => (
            <Icon
             name='ios-home'
             type = 'ionicon'
             size={35}
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
          tabBarLabel: 'My Favorites',
          unmountOnBlur: true,
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-heart"
              type = 'ionicon'
              size = {35}  
              color = {tintColor} 
            />
          )
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
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-thermometer"
              type = 'ionicon'  
              color = {tintColor} 
              size = {35}
            />
          )
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
          tabBarIcon: ({ tintColor }) => (
            <Icon 
              name="ios-person"
              type = 'ionicon'  
              color = {tintColor}
              size = {35} 
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
          name="MyFavourites"
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