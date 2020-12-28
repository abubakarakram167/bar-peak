import React, { Component } from 'react'
import DatePicker from 'react-native-datepicker'
import moment from 'moment'; 
export default class MyDatePicker extends Component {
  constructor(props){
    super(props)
    this.state = {date: moment().format('YYYY-MM-DD')}
  }
 
  render(){
    return (
      <DatePicker
        style={{width: 200}}
        date={this.state.date}
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
        onDateChange={(date) => {
          this.props.onChange(date)
          this.setState({date: date})
        }}
      />
    )
  }
}