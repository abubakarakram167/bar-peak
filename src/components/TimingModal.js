import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from "react-native";

class TimingModal extends Component {
  
  render() {
    return (
      <View style={styles.centeredView}>
        <Modal  
          animationType="slide"
          transparent={true}
          visible={this.props.showTimings}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
            { this.props.timings && this.props.timings.map((timing)=>{
                return (
                  <Text style={styles.modalText}> On {timing.openName + " " + timing.open } - { timing.close }   </Text>
                );

              })
            }  
              <TouchableHighlight
                style={{ ...styles.openButton, backgroundColor: "#E56060", textAlign: 'center', width: 80 }}
                onPress={() => {
                  this.props.closeModal();
                }}
              >
                <Text style={styles.textStyle}>Close</Text>
              </TouchableHighlight>
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
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
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
    width: 200
  }
});

export default TimingModal;