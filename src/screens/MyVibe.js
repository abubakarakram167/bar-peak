import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import { Card, NoMoreCards } from '../components/Card';
import Swiper from 'react-native-deck-swiper'

class MyVibe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cards: [
        {name: '1', image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80'},
        {name: '2', image: 'https://images.pexels.com/photos/941864/pexels-photo-941864.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500'},
        {name: '3', image: 'https://static3.depositphotos.com/1003631/209/i/450/depositphotos_2099183-stock-photo-fine-table-setting-in-gourmet.jpg'}
      ],
      currentCard: 0,
      swipeLeft: false
    };
  }

  handleYup (card) {
    console.log(`Yup for ${card.text}`)
  }
  handleNope (card) {
    console.log(`Nope for ${card.text}`)
  }
  handleMaybe (card) {
    console.log(`Maybe for ${card.text}`)
  }

  componentDidMount(){
  
  }

  render(){
    return (
      <View style={styles.screen}>
        <Swiper
          cards={ this.state.cards }
          renderCard={(card) => {
            return (  
              <Card 
                card = {card}  
              />
            )
          }}
          onSwiped={(cardIndex) => { this.setState({ currentCard: cardIndex }) }}
          onSwipedAll={() => {console.log('onSwipedAll')}}
          cardIndex={this.state.currentCard}
          backgroundColor={'#EAE9E9'}
          disableLeftSwipe = {this.state.swipeLeft}
          animateCardOpacity = {true}
          style = {{ backgroundColor: 'white' }}
          goBackToPreviousCardOnSwipeRight = {true}
          stackSize= {3}
          showSecondCard={false}
          disableBottomSwipe = {true}
          disableTopSwipe = {false}
          
          >  
        </Swiper>
      </View>
    );
  }

}

export default MyVibe

const styles = StyleSheet.create({
    screen:{
        flex:1,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'white',
    },
    text:{
        color:'#000',
        fontWeight:'700',
        fontSize:30
    },
    card: {
      flex: 1,
      borderRadius: 4,
      borderWidth: 2,
      borderColor: "#E8E8E8",
      justifyContent: "center",
      backgroundColor: "white"
    },
    text: {
      textAlign: "center",
      fontSize: 50,
      backgroundColor: "transparent"
    }
})