import React, {Component} from 'react';
var _ = require('lodash');
import { StyleSheet, View, Text, TouchableOpacity, Alert, Image, ScrollView, Button, Picker, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Table, TableWrapper, Row, Cell } from 'react-native-table-component';
import RNPickerSelect from 'react-native-picker-select';
import Spinner from 'react-native-loading-spinner-overlay';
var moment = require('moment');

export class ScheduleScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Sports', 'Match', 'Date', 'Time', 'Link1'],
      tableData: [],
      selectedSport: 'soccer-league-schedule',
      spinner: true,
      showButton: false
    }
  }

  _alertIndex(index) {
    Alert.alert(`This is row ${index + 1}`);
  }

  playLiveStream(){

  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
   
    })
  }

  getMatchDay(date){
    var  days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var newDate = moment(date);
    var dayName = days[newDate.day()];

    return dayName + ', ' + moment(date).format('DD') + ' ' + moment(date).format('MMM');
  }

  changeSportSchedule(sport){
    this.setState({ spinner: true })
    setTimeout(()=>{
      this.setState({ spinner: false, selectedSport: sport })
    }, 1000)
  }

  getButtonStatus(channelId, team1, team2, startTime, scheduleId){
    var now = moment();
    var start = moment((startTime));
    var duration = moment.duration(start.diff(now));
    var minutes = Math.floor(duration.asMinutes());
    const params = this.props.navigation

    if(channelId && params.getParam('showButton')){
      if(minutes > 30){
        return(<TouchableOpacity style={{height:50}} onPress = {()=>{ params.navigate('wowzaStreamingScreen', {channelId, matchStartingTimeMinutes: minutes}) }} >
                <Text style={{fontSize: 14, color: '#365BCF'}}>Before 30 Minutes</Text>
              </TouchableOpacity>
        );
      }
      else{
        return(<TouchableOpacity style={{height:50, marginTop: 30}} onPress = {()=>{ params.navigate('wowzaStreamingScreen', {channelId, matchStartingTimeMinutes: minutes}) }} >
                <Text style={{fontSize: 14, color: '#EC4231'}}>Live Link</Text>
               </TouchableOpacity>
        );
      }
    }
  }


  render() {
    let selectionSport;
    const state = this.state;
    const showButton = this.props.navigation.getParam('showButton')
  
    const getImage = (imageLogo) =>{
      if (imageLogo === null)
        return '';
      return(
        <Image source = {{uri: imageLogo}} style={styles.imageStyle} />
      );
    }
    return (
      <View style={styles.container}>

          <Spinner
            visible={this.state.spinner}
            textContent={'Loading...'}
            textStyle={styles.spinnerTextStyle}
          />

        <View  style = {styles.selectedPicker }>
        <Text style = {{flex: 1 , color: 'white', paddingTop: 12}} >SelectSchedule:</Text>
          { Platform.OS === 'ios' ?
            <RNPickerSelect
              style={pickerStyle}
              placeholder = {{}}
              onValueChange={(sport) =>  selectionSport = sport }
              onDonePress = { () => this.changeSportSchedule(selectionSport) }
              items={[
                  { label: 'Soccer', value: 'soccer-league-schedule' },
                  { label: 'NFL', value: 'nfl-league-schedule' },
                  { label: 'UFC', value: 'ufc-league-schedule' },
                  { label: 'MotoGp', value: 'motogp-league-schedule' }
              ]}
            /> :
            <Picker
              selectedValue={this.state.selectedSport}
              style ={{ backgroundColor: 'white', flex: 1 }}
              onValueChange={ (sport) => this.changeSportSchedule(sport) }
              mode = "dropdown"
            >
              <Picker.Item label="Soccer" value="soccer-league-schedule" />
              <Picker.Item label="NFL" value="nfl-league-schedule" />
              <Picker.Item label="UFC" value="ufc-league-schedule" />
              <Picker.Item label="MotoGp" value="motogp-league-schedule" />
            </Picker>
          }

        </View>
        <ScrollView >
          <View>
            <Table borderStyle={{borderColor: 'transparent'}}>
              <Row data={state.tableHead} style={styles.head} textStyle={styles.text}/>
              {
                state.tableData && state.tableData.filter((data)=> data.sports_type === this.state.selectedSport).map((rowData, index) => {
                  return (<TableWrapper key={index} style={styles.row}>
                            <Cell data = { getImage(rowData.sports_logo) } />
                            <Cell data = { <Text style = {styles.textAlignment}>{rowData.team1} vs { rowData.team2 }</Text> } />
                            <Cell data = { <Text style = {styles.textAlignment}>{this.getMatchDay(rowData.start_time[0])}</Text> } />
                            <Cell data = { <Text style = {styles.textAlignment}>{ moment(rowData.start_time[0]).format("HH:mm:ss") }</Text> } />
                            <Cell data = { this.getButtonStatus(rowData.channel1_id, rowData.team1, rowData.team2, rowData.start_time[0], rowData.id) } />
                          </TableWrapper>
                  );
                })
              }
            </Table>
          </View>
        </ScrollView>
      </View>
    )
  }
}

export default withNavigation(ScheduleScreen)

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#323231' },
  head: { height: 40, backgroundColor: '#808B97' },
  text: { margin: 6 },
  row: { flexDirection: 'row', marginBottom: 10, marginTop: 5 },
  btn: { width: 58, height: 18, backgroundColor: '#78B7BB',  borderRadius: 2 },
  btnText: { textAlign: 'center', color: '#fff' },
  imageStyle: { height: 60, width: 60, paddingBottom: 5, paddingTop: 5 },
  textAlignment: { textAlign: 'left', color: 'white', padding: 5, fontSize: 11 },
  selectedPicker: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 50
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});

const pickerStyle = {
	inputIOS: {
		color: 'black',
    paddingHorizontal: 10,
    paddingTop: 9,
    paddingBottom: 10,
    borderWidth: 0.5,
    borderRadius: 4,
    backgroundColor: 'white'
	},
	inputAndroid: {
		color: 'white',
	},
	placeholderColor: 'white',
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
};
