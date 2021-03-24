import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity,
  Linking
} from "react-native";
const { width, height } = Dimensions.get("window");

class App extends Component {
  
  render() {
    
    return (
      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.show}

          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style = {{ fontSize: 16 , textAlign: 'center'}} > { this.props.message } </Text>
              <View >
                <TouchableOpacity 
                  onPress = {()=> {
                    Linking.openURL('app-settings:')
                  }}
                  style = {{ marginTop: 50, backgroundColor: 'black', padding: 5,paddingVertical: 10 ,borderRadius: 10 }}
                >
                  <Text style = {{ fontSize: 16, color: 'white'}} > Go to Settings </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress = {()=> this.props.onClose() }
                  style = {{ marginTop: 20, backgroundColor: 'black', padding: 5,paddingVertical: 10 ,borderRadius: 10 }}
                >
                  <Text style = {{ fontSize: 16, color: 'white', textAlign: 'center'}} > Ok </Text>
                </TouchableOpacity>    
              </View>   
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#000",
    width: width * 0.9,
    height: 300,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 25
  }
});

export default App;