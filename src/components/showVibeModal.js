import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions
} from "react-native";
import { connect } from 'react-redux';
const { width, height } = Dimensions.get("window");

class showVibeModal extends Component {
  state = {
    modalVisible: true
  };

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  render() {
    const { vibe } = this.props;
    console.log("the vibe", vibe);
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
              <Text style={styles.modalText}>Your's Current Vibe</Text>
              <View
                style = {{ width: width * 0.7, height: height * 0.5 }}
              >
                <View style = { styles.wholeContainer } >
                  <Text style = {styles.questions}> Night Clubs or Bar </Text>
                  <Text style = {styles.answers} >{vibe.nightLife ? "Night Clubs": "Bar" }</Text>
                  <View
                    style={ styles.bottomLine }
                  />
                </View>
                { ! vibe.nightLife &&
                    (<View style = { styles.wholeContainer } >
                      <Text style = {styles.questions}> Bar Category </Text>
                      <Text style = {styles.answers} >{vibe.barType}</Text>
                      <View
                        style={ styles.bottomLine }
                      />
                    </View>)
                }
                <View style = { styles.wholeContainer } >
                  <Text style = {styles.questions}  > Crowdy Places </Text>
                  <Text style = {styles.answers} >{vibe.crowdedPlace ? "Crowdy": "Quiet" }</Text>
                  <View
                    style={ styles.bottomLine }
                  />
                </View>
                <View style = { styles.wholeContainer } >
                  <Text style = {styles.questions}  > Age Range</Text>
                  <Text style = {styles.answers} > { vibe.ageInterval } </Text>
                  <View
                    style={ styles.bottomLine }
                  />
                </View>
              </View>
            </View>
            <TouchableHighlight
              style={styles.openButton}
              onPress={() => {
                this.props.onClose()
              }}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableHighlight>
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
  bottomLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 10,
    width: width * 0.7
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
    backgroundColor: "black",
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
    fontWeight: '700',
    fontSize: 25
  },
  wholeContainer: {
    flex: 1,
    borderWidth: 0,
    justifyContent: 'center',
    borderWidth: 0,
    minWidth: 300,
    maxWidth: 300
  },
  questions: {
    fontSize: 20,
    borderWidth:0,
    padding: 0,
    fontWeight: '500',
    textAlign: 'left',
    alignSelf: 'flex-start'
  },
  answers: {
    fontSize: 20,
    borderWidth:0,
    paddingHorizontal: '2%',
    marginTop: 10,
    color: 'gray'
  },
});

const mapStateToProps = (state) => {
  const {  vibe } = state
  return { 
    vibe: vibe.vibe.vibe
  }
};
export default connect(mapStateToProps)(showVibeModal);;
