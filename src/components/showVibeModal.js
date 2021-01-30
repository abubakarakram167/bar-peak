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
    const { vibe, navigation } = this.props;
    const { barOrNightClub } = vibe;
   
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
              <Text style={styles.modalText}>Your Current Vibe</Text>
              <Text style = {styles.vibeCategoryText} >{ vibe.vibeCategory }</Text>
              <Text style={styles.modalText} >Looking For  </Text>
              <Text style = {styles.vibeCategoryText} >{ barOrNightClub === 'nightClub' ? 'Night Club' : 'Bar' }</Text>

              <View
                style = {{ width: width * 0.7 }}
              >
                <TouchableHighlight
                  style={styles.vibeChangeButton}
                  onPress={() => {
                    this.props.onClose()
                  }}
                >
                  <Text style={styles.textStyle}>Change Vibe</Text>
                </TouchableHighlight>
                <TouchableHighlight
                  style={styles.vibeChangeButton}
                  onPress={() => {
                    this.props.onClose()
                    navigation.navigate('Screen 1')
                  }}
                >
                  <Text style={styles.textStyle}>No</Text>
                </TouchableHighlight>
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
    marginTop: 22
  },
  vibeChangeButton: {
    backgroundColor: "black",
    borderRadius: 8,
    padding: 5,
    paddingTop: 10,
    paddingBottom: 10,
    width: '50%',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 30
  },
  vibeCategoryText:{
    textAlign: 'center',
    fontSize: 20
  },
  bottomLine: {
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    marginTop: 10,
    width: width * 0.7
  },
  modalView: {
    margin: 20,
    backgroundColor: "#ededed",
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
    marginTop: 10,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: '700',
    fontSize: 24
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
