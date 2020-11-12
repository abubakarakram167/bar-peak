import React, { Component } from 'react';
import { StyleSheet, View, Text , Image, Dimensions} from 'react-native';
var {width} = Dimensions.get('window');
var {height} = Dimensions.get('window');

export class Card extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.card}>
        <Image 
          resizeMode = 'cover' 
          style={styles.thumbnail} 
          source={{uri: this.props.card.image}} 
        />
        <Text style={styles.text}>{this.props.card.question}</Text>
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
    justifyContent : 'center',
    alignSelf: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 1,
    elevation: 0,
    width: width * 0.97 
  },
  thumbnail: {
    width: width,
    height: height * 0.65,
    position: 'relative'
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text:{
    position: 'absolute',
    color: 'white',
    top: '30%',
    left: '8%',
    fontSize: 30,
    width: '80%',
    textAlign: 'center',
    fontWeight: '700'
  }
}) 