import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions, AsyncStorage } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { withNavigation } from 'react-navigation';
import { getUserData } from '../components/localStorage';
import { getUser } from '../../redux/actions/User';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

 class SplashedScreen extends Component {
  state = {
    appIsReady: false,
    usersData: []
  };

  async componentDidMount() {
    // Prevent native splash screen from autohiding
    // console.log("in splash")
    const { navigation } = this.props;
    // console.log("the navigation in splash", navigation)
    navigation.addListener("focus", async () => {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
      this.prepareResources()
    })
  }

  async performAPICalls() {
    const { navigation } = this.props;
    const { token, userId } =  await getUserData();
    const user = await this.props.getUser()
    if(token && userId && user === "ok" )
      navigation.navigate('HomeApp')
    else{
      console.log("in login Screen")
      navigation.navigate('LoginScreen')
    }
      
  }

  prepareResources = async () => {
    console.log("calling")
    await this.performAPICalls();
    
    this.setState({ appIsReady: true }, async () => {  
      await SplashScreen.hideAsync();
    });
    
  };

  render() {
    // if (!this.state.appIsReady) {
    //   return null;
    // }

    return (
      <View style={styles.container}>
        <Image
          style = { styles.imageStyle }
          resize = "contain"
          source = { require('../../assets/splashtest.png') }
        />
        <View >
          <ActivityIndicator size="large" color="#7D837D" />
        </View>
      </View>
    );
  }
}

// export default withNavigation(SplashedScreen);

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getUser
  }, dispatch)
);

export default connect(null, mapDispatchToProps)(SplashedScreen);


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2b3538',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
  },
  imageStyle:{
    width: '100%',
    height: '100%',
    marginBottom: "10%",
    resizeMode: "contain"
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }
});
