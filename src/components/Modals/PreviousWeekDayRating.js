import React, { Component } from "react";
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Icon } from 'react-native-elements';
const { width, height } = Dimensions.get("window");

class App extends Component {

  getRatingCase = (ratingCase, value) => {
    console.log(`the rating case ${ratingCase} and value is ${value}`)
    if(ratingCase === "crowd"){
      if(value >= 0 && value <= 0.9)
        return "Dead";
      else if (value >= 1 && value <= 1.9)
        return "Some People";
      else if (value >= 2 && value <= 2.9)
        return "Decent Level of Crowd";
      else if(value >= 3 && value <= 3.9)
        return "Getting Pretty Crowded";
      else if(value >= 4 && value <= 5)
        return "Packed-in Like Sardines";
    }
    else if(ratingCase === "fun"){
      if(value >= 0 && value <= 0.9)
        return "Not Fun";
      else if (value >= 1 && value <= 1.9)
        return "Sort Of Fun";
      else if (value >= 2 && value <= 2.9)
        return "Decent";
      else if(value >= 3 && value <= 3.9)
        return "Very Fun";
      else if(value >= 4 && value <= 5)
        return "All Time";
    }
    else if(ratingCase === "difficultyGettingIn"){
      if(value >= 0 && value <= 0.9)
        return "No Problem ";
      else if (value >= 1 && value <= 1.9)
        return "Less than 5-minute wait";
      else if (value >= 2 && value <= 2.9)
        return "5 - 15-Minute Wait";
      else if(value >= 3 && value <= 3.9)
        return "15 - 30-Minute Wait";
      else if(value >= 4 && value <= 5)
        return "Over 30-Minute Wait ";
    }
    else if(ratingCase === 'genderBreakdown'){
      if(value >= 0 && value <= 0.9)
        return "Equal Girls and Guys";
      else if (value >= 1 && value <= 1.9)
        return "More Guys than Girls";
      else if (value >= 2 && value <= 3)
        return "More Girls than Guys";
    }
    else if(ratingCase === "difficultyGettingADrink"){
      if(value >= 0 && value <= 0.9)
        return "No Problem";
      else if (value >= 1 && value <= 1.9)
        return "A Little Slow";
      else if (value >= 2 && value <= 3)
        return "Starting to Get Annoying";
      else if (value >= 3.1 && value <= 4)
        return "Forget About It";
    }
  }

  getVibeCaseColor = (ratingCase, value) => {
    const vibe  = this.props.vibe;
    if(ratingCase === "crowdy"){
      if(vibe.crowdedPlace){
        if(value>=0 && value<=2)
          return "#ed4928"
        else if (value >=3 && value <= 5)
          return "#2bb552"  
      }
      else{
        if(value>=0 && value<=2)
          return "#14a843"
        else if (value >=3 && value <= 5)
          return "#ed4928" 
      }
      return "#d5db16";
    }
  }
  
  render() {
    const { ratingData } = this.props;
    const { rating } = ratingData 
    console.log("the rating data", rating)
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
              <Text style={styles.modalText}>  Rating!</Text>
                { rating && <Text style={styles.timeText}> This Time Last Week on. The last should be :</Text>}
               { rating ?
                <View 
                  style = {{ flex: 1 }} 
                >
                  <View style = {{ flex:2, borderWidth: 0, width: '100%', marginTop: 20}} >
                    <View 
                      style = {[styles.starComponent, { marginTop:0 }]} 
                    > 
                      <Text style = {styles.heading } >Crowd Factor</Text>
                      <TouchableOpacity
                        style = {[styles.ratingButtonToggle, { backgroundColor: this.getVibeCaseColor('crowdy', rating && rating.crowd)}]}
                      >
                        <Text style = {styles.ratingLabel} >{ this.getRatingCase("crowd", rating &&  rating.crowd) }</Text>
                      </TouchableOpacity>
                    </View>
                    <View 
                      style = {styles.starComponent} 
                    >
                      <Text style = {styles.heading } >Fun Factor</Text>
                      <TouchableOpacity
                        style = {[styles.ratingButtonToggle, { backgroundColor: '#5878d1'}]}
                      >
                        <Text style = {styles.ratingLabel} >{ this.getRatingCase("fun", rating && rating.fun) }</Text>
                      </TouchableOpacity>
                    </View>
                    <View 
                      style = {styles.starComponent} 
                    >
                      <Text style = {styles.heading }  >Gender Breakdown</Text>
                      <TouchableOpacity
                        style = {[styles.ratingButtonToggle, { backgroundColor: '#5878d1'}]}
                      >
                        <Text style = {styles.ratingLabel} >{ this.getRatingCase("genderBreakdown", rating && rating.ratioInput) }</Text>
                      </TouchableOpacity>
                    </View>
                    <View 
                      style = {styles.starComponent} 
                    >
                      <Text style = {styles.heading }  >Difficulty Getting in</Text>
                      <TouchableOpacity
                        style = {[styles.ratingButtonToggle, { backgroundColor: '#5878d1'}]}
                      >
                        <Text style = {styles.ratingLabel} >{ this.getRatingCase("difficultyGettingIn", rating && rating.difficultyGettingIn) }</Text>
                      </TouchableOpacity>
                    </View>
                    <View 
                      style = {styles.starComponent} 
                    > 
                      <Text style = {styles.heading } >Difficulty Getting Drink</Text>
                      <TouchableOpacity
                        style = {[styles.ratingButtonToggle, { backgroundColor: '#5878d1'}]}
                      >
                        <Text style = {styles.ratingLabel} >{ this.getRatingCase("difficultyGettingADrink",rating && rating.difficultyGettingDrink) }</Text>
                      </TouchableOpacity>
                    </View>        
                  </View>
               </View> : <Text style = {{ fontSize: 20, textAlign: 'center', marginTop: 30 }} >Previous week rating is not available. </Text>}
            </View>
            <View style = {{ position: 'absolute', top: '20%', left: '10%' }}  >
              <TouchableOpacity
                onPress = {()=> this.props.closeModal()}
              >
                <Icon 
                  name="x"
                  type = 'foundation'
                  size = {20}
                  color = "black"
                  style = {styles.sliderImageIcons}  
                />
              </TouchableOpacity>
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
  timeText: {
    fontSize: 15,
    fontWeight: "500"
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
    height: height * 0.6,
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
  },
  rateButtonStyling: { 
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    paddingTop: 15, 
    paddingBottom: 15 
  },
  sliderImageIcons:{ 
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding:3,
    paddingLeft: 5,
    paddingRight: 5 
  },
  ratingText: { 
    textAlign: 'center', 
    width: '30%',
    fontSize: 18,
    fontWeight: '600' 
  },
  heartIcon:{ 
    flex:1,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    top: "3%",
    right: "3%" 
  },
  surveyHeading: { 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "400",
    color: 'black',
    paddingLeft:10,
    paddingRight:10,
    marginTop: 30 
  },
  ratingLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: 'white'
  },
  ratingButtonToggle: {  
    padding: 10, 
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 150,
    minWidth: 150,
    minHeight: 40,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingComponent: {
    flex:1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  rateModal: {
    flex:3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  heading: {
    textAlign: 'left',
    width: '35%',
    fontSize: 14,
    fontWeight: '500'
  },
  starComponent: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15
  }
});

export default App;