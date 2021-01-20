import React, { Component } from "react";
import {
  Alert,
  Modal,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import styles from '../CSS/VibeRequiredPopUpModal';
class App extends Component {  
  render() {
    const { navigation } = this.props;
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.show}
          presentationStyle = "overFullScreen"

          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}> Vibe Required!</Text>
                <View 
                  style = {{ flex: 1, alignItems: 'center', justifyContent: 'center' }} 
                >
                  <Text style = {styles.modalMessage} > Please set your vibe to continue. </Text>
                  <TouchableOpacity
                    onPress = {() =>  {
                      this.props.closeModal()
                      navigation.navigate("vibeTabNavigator")
                    }}
                    style = {styles.setVibeButton}
                  >
                    <Text style = {{ color: 'white', fontSize: 18 }} >Set Vibe</Text>
                  </TouchableOpacity>
                </View> 
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}



export default App;