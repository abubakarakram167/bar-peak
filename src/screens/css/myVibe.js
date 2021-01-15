import { StyleSheet, Dimensions } from "react-native"
const { width, height } = Dimensions.get('window');

export default StyleSheet.create({
  screen:{
    flex:1,
    backgroundColor:'black',
    width,
    padding: 0,
    margin: 0
  },
  ProgressiveBar: {
    flex: 1
  }
})