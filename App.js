import React from 'react';
import { registerRootComponent } from 'expo';
import Icon from 'react-native-vector-icons/Ionicons'
import {NavigationContainer} from '@react-navigation/native'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import businessReducer from './redux/reducers/Business';
import {FirstScreenNavigator, SecondScreenNavigator, MyVibeTab} from './CustomNavigation'
import {useRoute} from '@react-navigation/native';
import { Image } from 'react-native';
const Tab = createBottomTabNavigator();

import store from './redux/store';

const App = () => {
  return (
    <>
      <Provider store={store}>  
        <NavigationContainer>
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
              component={FirstScreenNavigator}  // Replaced Screen 1
              options  = { ({ navigation })=> {
                const currentRoute = navigation.state
                // const { routeName } = currentRoute;
                
                return{
                  tabBarVisible: false,
                  tabBarLabel: 'Home',
                  tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-list-box" color={tintColor} size={24} />
                  )
                }      
              }}
            />
            {/* <Tab.Screen
              name="Screen 2"
              component={SecondScreenNavigator}  // Replaced Screen 2
              options = 
              {
                {
                  tabBarLabel: 'SAVED',
                  tabBarIcon: ({ tintColor }) => (
                    <Icon name="ios-heart-outline" color={tintColor} size={24} />
                  )
                }
              }
            />
            <Tab.Screen
              name="Screen 3"
              component={ThirdScreenNavigator}  // Replaced Screen 3
              options = 
              {
                {
                  tabBarLabel: 'My Vibe',
                  tabBarIcon: ({ tintColor }) => (
                    <Image source={require('./assets/airbnb.png')} style={{ height: 24, width: 24, tintColor: tintColor }} />
                  )
                }
              }
            />
            <Tab.Screen
              name="Screen 4"
              component={ThirdScreenNavigator}  // Replaced Screen 3
              options = 
              {
                {
                  tabBarLabel: 'Profile',
                  tabBarIcon: ({ tintColor }) => (
                    <Image source={require('./assets/airbnb.png')} style={{ height: 24, width: 24, tintColor: tintColor }} />
                  )
                }
              }
            /> */}
          </Tab.Navigator>
        </NavigationContainer>
      </Provider>  
    </>
  );
};


export default App