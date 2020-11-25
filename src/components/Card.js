import React, { Component } from 'react';
import { StyleSheet, View, Text , Image, Dimensions} from 'react-native';
var {width} = Dimensions.get('window');
var {height} = Dimensions.get('window');

export class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log("the props", this.props.card)
    return (
      <View style={styles.card}>
        <Text style={styles.text}>{this.props.card.question}</Text>
        <Image 
          resizeMode = 'stretch' 
          style={styles.thumbnail} 
          source={this.props.card.image} 
        />
      </View>
    )
  }
}

export class NoMoreCards extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.noMoreCards}>
        <Text>No more cards</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  leftText: {
    position: 'absolute',
    color: 'red',
    top: '10%',
    right: '45%'
    ,
    fontSize: 40,
    width: '80%',
    textAlign: 'center',
    fontWeight: '700'
  },
  rightText: {
    position: 'absolute',
    color: 'green',
    top: '10%',
    right: '10%',
    fontSize: 40,
    width: '80%',
    textAlign: 'center',
    fontWeight: '700'
  }
  ,
  card: {
    justifyContent : 'flex-end',
    alignSelf: 'center',
    borderRadius: 15,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: '#EEEEEE',
    borderWidth: 0,
    borderTopWidth: 0,
    elevation: 0,
    width: width * 0.97 ,
    marginTop: 50
  },
  thumbnail: {
    width: width,
    height: height * 0.35,
    position: 'relative'
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    // position: 'absolute',
    color: 'black',
    // top: 0,
    // left: 0,
    fontSize: 20,
    alignSelf: 'center',
    width: '80%',
    textAlign: 'center',
    fontWeight: '700'
  }
}) 