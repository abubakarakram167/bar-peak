// Screen1.js
import React from 'react'                                       
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'              
const Screen1 = ({navigation}) => {
  return (
      <View style={styles.screen}>
          <Text style={styles.text}>I am screen2</Text>
        
          <TouchableOpacity 
              onPress={()=>navigation.navigate('NestedScreen2',{msg:"From Screen 2"})} 
              style={styles.button}
          >
              <Text style={styles.buttonText}>Click Me!</Text>
          </TouchableOpacity>
      </View>
  )
}
export default Screen1
const styles = StyleSheet.create({  
  screen:{ 
    flex:1, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center', 
    backgroundColor: '#00000025',
  },
  text:{                                                         
    color:'#000',                                                  
    fontWeight:'700',
    fontSize:30                                                                 
  }                                                                  
})