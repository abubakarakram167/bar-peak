import React, { Component } from 'react'
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment'; 

export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {date: new Date()}
  }
 
  render(){
    
    return (
      <DateTimePicker
        style={{width: 200, backgroundColor: "transparent"}}
        value={ this.props.dob ? new Date(this.props.dob) : new Date(this.props.value)}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="1960-05-01"
        maxDate="2030-06-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            left: 0,
            top: 4,
            marginLeft: 0
          },
          dateInput: {
            marginLeft: 36,
            border:0,
            borderWidth:0
          }
          // ... You can check the source to find the other keys.
        }}
        onChange={(event,date) => {
          console.log("on calling", date)
          this.setState({date: date}, ()=> {
            this.props.onChange( this.state.date)
          })
        }}
      />
    )
  }
}