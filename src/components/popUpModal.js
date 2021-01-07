import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
 
import AwesomeAlert from 'react-native-awesome-alerts';
 
export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = { showAlert: true };
  };
 
  showAlert = () => {
    this.setState({
      showAlert: true
    });
  };
 
  hideAlert = () => {
    this.setState({
      showAlert: false
    });
  };

  componentDidMount(){
    console.log("the popup modal called")
    this.showAlert();
  }
 
  render() {
    const {showAlert} = this.state;
    const { navigation } = this.props;
    return (
      <View style={styles.container}> 
       <AwesomeAlert
          show={true}
          showProgress={false}
          title="Vibe Required"
          titleStyle ={{ fontWeight: '700', fontSize: 20 }}
          messageStyle = {{ textAlign: 'center', fontWeight: '500', fontSize: 16 }}
          message="Please set your vibe to access your app Completely"
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="Set Vibe"
          confirmButtonColor="#6bcacf"
          confirmButtonTextStyle = {{ fontSize: 15 }}
          onConfirmPressed={() => {
            this.props.closeModal()
            navigation.navigate("vibeTabNavigator")
          }}
        />
      </View>
    );
  };
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  button: {
    margin: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 5,
    backgroundColor: "#AEDEF4",
  },
  text: {
    color: '#fff',
    fontSize: 15
  }
});
 