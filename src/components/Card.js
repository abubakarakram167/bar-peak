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
  card: {
    justifyContent : "flex-start",
    alignSelf: 'flex-start',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 0,
    elevation: 0,
    width
  },
  thumbnail: {
    width: width,
    height: height * 0.6,
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