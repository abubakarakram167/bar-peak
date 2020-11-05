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
        {/* <Text style={styles.text}>This is card {this.props.card.name}</Text> */}
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
    alignItems: 'center',
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: 'grey',
    backgroundColor: 'white',
    borderWidth: 0,
    elevation: 0,
  },
  thumbnail: {
    width: width * 1,
    height: height * 0.6,
  },
  noMoreCards: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})