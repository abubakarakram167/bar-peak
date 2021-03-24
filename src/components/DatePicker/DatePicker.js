import React, {useState} from 'react';
import {View, Button, Platform} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default (props) => {
  
  const onChange = (event, selectedDate) => {
    setDate(selectedDate)
    props.changeDate(selectedDate)
  };

  const [date, setDate] = useState( new Date() )

  return (
    <View style = {{ flex: 1 , marginTop: 20}} >
      {props.show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={ date }
          mode='date'
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
    </View>
  );
};