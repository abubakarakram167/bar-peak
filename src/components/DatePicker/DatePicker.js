import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default (props) => {
  
  const onChange = (event, selectedDate) => {
    props.changeDate(selectedDate)
  };

  return (
    <View style = {{ flex: 1 , marginTop: 20}} >
      {props.show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={ new Date(props.date)}
          mode='date'
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
    </View>
  );
};