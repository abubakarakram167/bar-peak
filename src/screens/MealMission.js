
import React from 'react';
import { View, Text } from 'react-native';

export default class MealMissionScreen extends React.Component{

  
  render(){    
    return(
      <View style = {{ flex: 1, alignItems: 'center',justifyContent: 'center',margin: 'auto' }} >
        <Text style = {{ textAlign: 'center', width: '80%', fontSize: 18 }} >“You will soon be able to select places to eat with friends based on what your preferences are. Check back soon!”</Text>
      </View>
    );
  }
}


