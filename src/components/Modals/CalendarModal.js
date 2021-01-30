import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import NativeDatePicker from '../DatePicker/DatePicker'
import styles from '../CSS/VibeRequiredPopUpModal';
import Overlay from 'react-native-modal-overlay';

export default class OverlayExample extends React.Component {
  
  
  render() {
    return (
      <View style = {{ flex: 1 }} >
        
        {/* <NativeDatePicker
          onChange = {(date)=> { 
            console.log("the date parent", date)
            this.props.changeDate(date)
          }}
          dob = {null}
          value = { this.props.date }
          style = {styles.front}
       /> */}
      </View> 
    );
  }
}
