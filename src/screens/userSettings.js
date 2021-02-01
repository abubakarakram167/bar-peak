import React from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { Icon } from 'react-native-elements'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { removeStorageItem } from '../components/localStorage';
import { connect } from 'react-redux';

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
    const { user } = this.props.user.user;
    const image = user.profilePic ? user.profilePic : "https://res.cloudinary.com/developer-inn/image/upload/v1607354990/Account-512_rmc3wq.png" 
    return(
      <View style={styles.container}>
        <View style = {{ marginTop: 50}} >
          <View style = {{  flexDirection: 'row' }} >
            <Image
              source={{ uri: image }} 
              resizeMode = "cover" 
              style={{  width: 60,borderWidth: 1 ,height: 60 , borderRadius: 60/ 2, marginBottom: 10}} 
            />
            <TouchableOpacity 
              style = {{ marginLeft: 20, marginTop: 10 }}
              onPress = {()=> { navigation.navigate('editProfileScreen') }} 
            >
              <Text style = {{ fontSize: 18, fontWeight: '600' }} >{user.firstName}</Text>
              <Text style = {{ marginTop: 5, color: '#3ba1b3', fontWeight: '600' }} >Show Profile</Text>
            </TouchableOpacity> 
          </View>
          <View>
            
          </View>
        <View/>
        <View
          style={{
            borderBottomColor: 'gray',
            borderBottomWidth: 0.2,
            width: 340,
            marginTop: 20,
            marginBottom: 50
          }} 
        />
          <View style ={{ flexDirection: 'row'}} >
            <View style = {{ flex: 6 }} >
              <TouchableOpacity onPress = {()=> { navigation.navigate('editProfileScreen') }} >
                <Text style = {styles.headingText} >Edit Profile </Text>
              </TouchableOpacity> 
            </View>
            <View style ={{ flex:1 }} >
              <Image 
                source = { require('../../assets/icons/profile.png')  }
                style = {{ width: 28, height: 28}}
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
            <View style = {{ flex: 6 }} >
              <TouchableOpacity onPress = {()=> { navigation.navigate('radiusScreen') }} >
                <Text style = {styles.headingText} >Your Radius</Text>
                <Text style = {{ fontSize: 12, fontWeight: '500', color: 'gray' }} >This option ensures in how much distance in m you gonna see your results. </Text>
              </TouchableOpacity> 
            </View>
            <View style ={{ flex:1 }} >
              <Image 
                source = { require('../../assets/icons/radiusIcon.png')  }
                style = {{ width: 28, height: 28}}
              />
            </View>
          </View>  
            <View
              style={{
                borderBottomColor: 'gray',
                borderBottomWidth: 0.2,
                width: 340,
                marginTop: 20
              }}
            />
        </View>
        <View style = {{ marginTop: 20, alignSelf: 'flex-start' }} >
          <TouchableOpacity onPress = {()=> this.makeLogout()} >
            <Text style = {{ fontSize: 20, color: 'red', textAlign: 'center', marginLeft: 20, marginTop: 20 }} >
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

}

const mapStateToProps = (state) => {
  const { user} = state
  return { 
    user
  }
};
export default connect(mapStateToProps, null)(UserSettings);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  headingText: {
    fontSize: 23,
    position: 'relative',
    bottom: 5
  },
  descriptionText: {
    fontSize: 20
  }
});
