import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
 
import AwesomeAlert from 'react-native-awesome-alerts';
 
export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = { showAlert: false };
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
    console.log("the props", this.props.showError)
    return (
      <View style={styles.container}>
 
        {/* <Text>I'm AwesomeAlert</Text>
        <TouchableOpacity onPress={() => {
          this.showAlert();
        }}>
          <View style={styles.button}>
            <Text style={styles.text}>Try me!</Text>
          </View>
        </TouchableOpacity> */}
 
        <AwesomeAlert
          show={this.props.showError}
          title="Error"
          titleStyle ={{ fontWeight: '700', fontSize: 20 }}
          messageStyle = {{ textAlign: 'center', fontWeight: '500', fontSize: 16, color: '#f0357c' }}
          message= {this.props.message ? this.props.message : "This is testing error messag etext"}
          closeOnTouchOutside={false}
          contentContainerStyle = {{ minWidth: 250, maxWidth: 250 }}
          closeOnHardwareBackPress={false}
          showCancelButton={false}
          showConfirmButton={true}
          confirmText="ok"
          confirmButtonColor="#29adc4"
          confirmButtonStyle = {{ minWidth: 100, maxWidth: 100 , textAlign: 'center'}}
          confirmButtonTextStyle = {{ fontSize: 25 , textAlign: 'center'}}
          onConfirmPressed={() => {
            this.props.closeModal()
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
 