import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { removeStorageItem } from '../components/localStorage';

class UserSettings extends React.Component{

  constructor(props){
    super(props);
    
  }

  makeLogout = () => {
    const { navigation } = this.props
    // console.log("the navigation", navigation)
    removeStorageItem(navigation);
    
  }

  componentDidMount(){
    
  }

  render(){
    const {navigation} = this.props;
    return(
      <View style={styles.container}>
        <View style = {{ marginTop: 50}} >
          <View style ={{ flexDirection: 'row'}} >
            <View style = {{ flex: 5 }} >
              <Text style = {styles.headingText} > Personal Information </Text>
            </View>
            <View style ={{ flex:1 }} >
              <Icon 
                name="torso"
                type = 'foundation'
              />
            </View>
          </View>  
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 0.5,
                width: 340,
                marginTop: 20
              }}
            />
        </View>
        <View style = {{ marginTop: 50}} >
          <View style ={{ flexDirection: 'row'}} >
            <View style = {{ flex: 5 }} >
              <TouchableOpacity onPress = {()=> { navigation.navigate('vibeInfo') }} >
                <Text style = {styles.headingText} > Vibe Info </Text>
              </TouchableOpacity> 
            </View>
            <View style ={{ flex:1 }} >
              <Icon 
                name="heart"
                type = 'foundation'
              />
            </View>
          </View>  
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                width: 340,
                marginTop: 20
              }}
            />
        </View>
        <View style = {{ marginTop: 50}} >
          <View style ={{ flexDirection: 'row'}} >
            <View style = {{ flex: 5 }} >
              <TouchableOpacity onPress = {()=> { navigation.navigate('radiusScreen') }} >
                <Text style = {styles.headingText} >Your Radius</Text>
                <Text style = {{ fontSize: 12, fontWeight: '500', color: 'gray' }} >This option ensures in how much distance in m you gonna see your results. </Text>
              </TouchableOpacity> 
            </View>
            <View style ={{ flex:1 }} >
              <Icon 
                name="compass"
                type = 'foundation'
              />
            </View>
          </View>  
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                width: 340,
                marginTop: 20
              }}
            />
        </View>
        <View style = {{ marginTop: 20, alignSelf: 'flex-start' }} >
          <TouchableOpacity onPress = {()=> this.makeLogout()} >
            <Text style = {{ fontSize: 20, color: 'red', textAlign: 'center', marginLeft: 35, marginTop: 20 }} >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headingText: {
    fontSize: 25,
    position: 'relative',
    bottom: 5
  },
  descriptionText: {
    fontSize: 20
  }
});

export default UserSettings;