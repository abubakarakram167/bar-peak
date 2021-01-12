import React from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, AsyncStorage, ActivityIndicator, Modal, Button, Platform } from 'react-native';
import { withNavigation } from 'react-navigation';
import Spinner from 'react-native-loading-spinner-overlay';
import SignUpComponent from '../components/SignupComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

class SignUpScreen extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showModal: true,
      showIndicator: false,
      color: 'black'
    }
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didFocus", () => {
      this.setState({ showModal: true })
    })
  }

  ActivityIndicatorLoadingView() {
    this.setState({ showIndicator: true })
  }

  verifyPayment(data) {
    if (data.url === "https://safepayments.live/member/login")
      this.props.navigation.navigate("LoginScreen")
  }

  onMessage(data) {
    //Prints out data that was passed.
    console.log(data);
  }

  // static navigationOptions = ({ navigation, navigationOptions }) => {
  //   const { params } = navigation.state;

  //   return {
  //     title: 'A Nested Details Screen',
  //     /* These values are used instead of the shared configuration! */
  //     headerStyle: {
  //       backgroundColor: 'white',
  //     },
  //   };
  // };

  render() {
    const {params} = this.props.route;
  
    return (
      <View style={styles.container}>
        {this.state.showIndicator &&
          (<View style={[styles.activityContainer, styles.activityHorizontal]}>
            <ActivityIndicator size="large" color="#DCD5D3" style={{ zIndex: 10 }} />
          </View>)
        }
        <Modal
          visible={this.state.showModal}
          animationType="fade"
          presentationStyle="overFullScreen"
          transparent={true}
          startInLoadingState={true}
        >
          <View style={Platform.OS === 'ios' ? styles.iosModal : styles.androidModal}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('LoginScreen')}
              style={{ position: 'absolute', right: 5, top: 10, zIndex: 4 }} >
              <Icon name={'close'} color={'black'} size={30} />
            </TouchableOpacity>
            <View style={styles.modalContainer}>
              <SignUpComponent 
                user = {params && params.user}  
                navigation = {this.props.navigation} 
                closeModal = { ()=> this.setState({ showModal: false }) }
                phoneNumber = {params && params.phoneNumber} 
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

export default withNavigation(SignUpScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40
  },
  inputView: {
    width: "80%",
    backgroundColor: "#465881",
    borderRadius: 25,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    padding: 20
  },
  inputText: {
    height: 50,
    color: "white"
  },
  forgot: {
    color: "white",
    fontSize: 11
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    marginBottom: 10
  },
  SignUpBtn: {
    width: "80%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10
  },
  SignUpText: {
    color: 'white',
    fontSize: 20
  },
  ImageLogo: {
    width: '50%',
    height: '9%',
    marginBottom: "10%"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  androidModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: '13%'
  },
  iosModal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: '23%',
    width: "100%"
  }
  ,
  modalContainer: {
    backgroundColor: 'white',
    width: '100%',
    height: '100%'
  },
  ActivityIndicatorStyle: {
    flex: 1,
    justifyContent: 'center',
  },
  activityContainer: {
    flex: 1,
    justifyContent: "center"
  },
  activityHorizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  }

});