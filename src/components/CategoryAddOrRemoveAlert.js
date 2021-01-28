/*This is an Example to Align a View at the Bottom of Screen in React Native */
import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default class App extends Component {
  render() {
    return (
      <View style={styles.containerMain}>
        {
          this.props.show &&
         (<View style={styles.bottomView}>
            <Text style={styles.textStyle}>{ this.props.message }</Text>
          </View>)
        }
      </View>
    );
  }
}
const styles = StyleSheet.create({
  containerMain: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: "100%",
    marginBottom: 20,
    position: 'absolute', //Here is the trick
    top: 620, //Here is the trick

  },
  bottomView: {
    width: 300,
    height: 50,
    backgroundColor: '#fafafa',
    justifyContent: 'center',
    borderRadius: 30,
  },
  textStyle: {
    color: 'black',
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 20
  },
});