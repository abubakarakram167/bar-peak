import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';

class VibeInfo extends React.Component{

  constructor(props){
    super(props);
    
  }

  componentDidMount(){
    
  }

  render(){
    const { navigation } = this.props;
    const { vibe } = this.props.vibe.vibe;
    console.log("the vibe", vibe)
    return(
      <View style={styles.container}>
        <View style = { styles.wholeContainer } >
          <Text style = {styles.questions}  >Do you Like Crowdy Places? </Text>
          <Text style = {styles.answers} >{vibe.crowdedPlace ? "Yes" : "No" }</Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              marginTop: 10
            }}
          />
        </View>
        <View style = { styles.wholeContainer } >
          <Text style = {styles.questions}  >Do you like expensive places?</Text>
          <Text style = {styles.answers} >{vibe.expensivePlace ? "Yes" : "No" }</Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              marginTop: 10
            }}
          />
        </View>
        <View style = { styles.wholeContainer } >
          <Text style = {styles.questions}  >Are you want to go with a partner? </Text>
          <Text style = {styles.answers} >{vibe.isPartner ? "Yes" : "No" }</Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              marginTop: 10
            }}
          />
        </View>
        <View style = { styles.wholeContainer } >
          <Text style = {styles.questions}  >Are you want to go a Bar or Restaurant? </Text>
          <Text style = {styles.answers} >{vibe.barOrRestaurant === "bar" ? "Bar" : "Restaurant" }</Text>
          <View
            style={{
              borderBottomColor: 'gray',
              borderBottomWidth: 0.5,
              marginTop: 10
            }}
          />
        </View>
        <View style = {{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity
            style = { styles.buttons }
            onPress = {()=> { navigation.navigate("vibeTabNavigator") }}
          >
            <Text style =  {styles.resetVibe} >Reset Your's Vibe</Text>  
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3e3e3',
    alignItems: 'center',
  },
  questions: {
    fontSize: 25,
    borderWidth:0,
    padding: 0,
    fontWeight: '600',
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  answers: {
    fontSize: 20,
    borderWidth:0,
    paddingHorizontal: '2%',
    marginTop: 10,
    color: 'gray'
  },
  wholeContainer: {
    flex: 1,
    borderWidth: 0,
    justifyContent: 'center',
    borderWidth: 0,
    minWidth: 300,
    maxWidth: 300
  },
  resetVibe: { 
    fontSize: 20, 
    fontWeight: '500', 
    color: 'black'
  },
  buttons: {
    padding: 15,
    backgroundColor:'#9aeced',
    borderRadius:10,
    borderWidth: 1,
    borderColor: 'black'
  }
});

const mapStateToProps = (state) => {
  const {  vibe } = state
  return { 
    vibe: vibe
  }
};

export default connect(mapStateToProps)(VibeInfo);;