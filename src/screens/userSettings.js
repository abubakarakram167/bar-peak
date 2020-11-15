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
    return(
      <View style={styles.container}>
        <Text style = {{ marginTop: 10, fontWeight: '500', marginLeft: 20 , fontSize: 14}} > Account Settings </Text>
        <View style = {{ marginTop: 50, marginLeft: 18}} >
          <View style ={{ flexDirection: 'row'}} >
            <View style = {{ flex: 5 }} >
              <Text> Personal Information </Text>
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
        <View style = {{ marginTop: 20, marginLeft: 18, flex:1 }} >
          <TouchableOpacity onPress = {()=> this.makeLogout()} >
            <Text style = {{ fontSize: 20, color: 'red' }} >
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  }
});

export default UserSettings;