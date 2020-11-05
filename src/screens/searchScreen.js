import React from 'react';
import { Text, StyleSheet, View, ScrollView, Alert } from 'react-native';
import { withNavigation } from 'react-navigation';
import SearchBar from '../components/searchBar';
import ResultList from '../components/ResultList';
import { isEmpty } from 'lodash';
var _ = require('lodash');


const styles = StyleSheet.create({
  viewStyle:{
    flex: 1,
    height: '100%',
    backgroundColor: 'rgb(23, 23, 22)'
  },
  flashMessage:{
    position:'absolute',
    backgroundColor: '#2d9c3a',
    width:'50%',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 5,
    height:40,
    left: '25%',
    top: '1.8%'
  }
});

class SearchScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      term: '',
      channels: {},
      searchChannels: [],
      flashMessage: false
    };
  }
  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus",  () => {
      this.setState({ term: '' , searchChannels: [ ]})
      if (navigation.getParam('name'))
        this.showFlashMessage()
      this.searchApi()
    })
  }

  showFlashMessage(){
    this.setState({
      flashMessage: true
    },()=>{setTimeout(() => this.closeFlashMessage(), 3000)})
  }

  closeFlashMessage(){
    this.setState({
      flashMessage: false
    })
  }

  searchApi =  () => {
  
  }

  setText = (text) => {
    if(text === '')
      this.setState({searchChannels: []})
    this.setState({term: text})
  }

  showAlert = () =>{
    Alert.alert(
      "No Results",
      "Try Another Words",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ],
      { cancelable: false }
    )
  }

  makeSearch(){
    Object
    .entries(this.state.channels)
    .map((categoryChannels) => {
      let searchChannels = {
        categoryTitle : categoryChannels[0],
        categoryChannels: []
      }
      categoryChannels[1].map((channel)=>{
        if(channel.title.toLocaleLowerCase().includes(this.state.term.toLocaleLowerCase()))
          searchChannels.categoryChannels.push(channel)
      })
      if(!this.state.searchChannels.length && searchChannels.categoryChannels.length && searchChannels.categoryTitle !== "wowza_live_stream_sports"){
        this.setState(prevState => ({
          searchChannels: [...prevState.searchChannels, searchChannels]
        }))
      }
    })
    setTimeout(()=>{
      console.log("the channel length",  this.state.searchChannels.length)
      if(this.state.searchChannels.length === 0)
        this.showAlert();
    }, 500)
  }

  render() {
    return (
      <ScrollView  style = { { backgroundColor: 'rgb(23, 23, 22)' } }>
        <View style = {styles.viewStyle} >
          <SearchBar
            term = {this.state.term}
            updateParentText = { (text)=>{ this.setText(text) } }
            onSubmitTerm = { ()=>{ this.makeSearch() } }
            style = {{marginBottom: 10}}
          />
          {/* { this.state.errorMessage !== '' ? <Text>{ this.state.errorMesssage }</Text> : null}
          { this.state.searchChannels.length ? this.state.searchChannels.map((channel)=> {
              return <ResultList  results = { channel.categoryChannels } title = { channel.categoryTitle } />
            }): !isEmpty(this.state.channels) ? Object.entries(this.state.channels).
                  map((categoryChannels) => {
                    if(categoryChannels[0] !== "wowza_live_stream_sports"){
                      return <ResultList  results = { categoryChannels[1] } title = {categoryChannels[0]} />
                    }
                  }):null
          }
          { this.state.flashMessage==true  &&  this.props.navigation.getParam('name') !== null ?
            <View style={styles.flashMessage}>
            <Text style={{color:'white'}}>Welcome  {this.props.navigation.getParam('name')}</Text>
            </View>
            :null
          } */}
        </View>
      </ScrollView>
    );
  }
}

export default withNavigation(SearchScreen);
