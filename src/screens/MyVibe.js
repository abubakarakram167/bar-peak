import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions, ActivityIndicator, TouchableOpacity, Image } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import { Card, NoMoreCards } from '../components/Card';
import Swiper from 'react-native-deck-swiper'
import {submitVibe} from '../../redux/actions/Vibe';
import {updateVibe} from '../../redux/actions/Vibe';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements'
import _, { map } from 'underscore';
var {width} = Dimensions.get('window');

class MyVibe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cards: [
        {no: '1', image: 'https://cdn.vox-cdn.com/thumbor/Zo7vqyNk4ta12WZ_5MxfIqUTPE4=/0x0:1184x753/1200x900/filters:focal(498x283:686x471)/cdn.vox-cdn.com/uploads/chorus_image/image/56415715/ElbowRoom.6.jpg',question: " Do you like crowdy places ?"},
        {no: '2', image: 'https://www.sandiego.org/-/media/images/sdta-site/campaigns/sunny-7/rooftops/nolan-1233x860.jpg?bc=white&h=500&w=700&c=1',question: " Do you like expensive places?"},
        {no: '3', image: 'https://content.tripster.com/travelguide/wp-content/uploads/2016/08/Friends-at-Night-ThinkstockPhotos-505961864-750x450.jpg',question: "Are you want to go with a partner?"},
        {no: '4', image: 'https://static3.depositphotos.com/1003631/209/i/450/depositphotos_2099183-stock-photo-fine-table-setting-in-gourmet.jpg',question: "Are you want to go a Bar or Restaurant?"},
        {no: '5', image: 'https://media.timeout.com/images/105553441/image.jpg',question: "Setting your Vibe...."}
      ],
      currentCard: 0,
      answers: [],
      swipeLeft: false,
      showIndicator: false,
      showLeftText: false,
      showRightText: true
    };
    this.swiperRef = React.createRef();
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

  submitVibe = async() => {

    console.log("call");
    console.log("the answers", this.state.answers)
    const {navigation} = this.props;
    let vibeData = {
      crowdedPlace: this.state.answers[0].answer,
      expensivePlace: this.state.answers[1].answer,
      isPartner: this.state.answers[2].answer,
      barOrRestaurant: this.state.answers[3].answer
    }
     const getVibe = this.props.vibe.vibe.vibe
    if(_.isEmpty(getVibe)){
      const submitVibe =  await this.props.submitVibe(vibeData)
      if(submitVibe){
        this.setState({ showIndicator: false })
        navigation.navigate('Home');
      }
    }
    else{
      const updateVibe = await this.props.updateVibe(vibeData);
      
    }
    
  }

  render(){
    return (
      <View style={styles.screen}>
        <View style = {{ flex: 1 }} >
          <Swiper
            cards={ this.state.cards }
            ref={ref => { this.swiperRef = ref; }}
            renderCard={(card) => {
              return (  
                <Card 
                  card = {card} 
                  showLeftText = {this.state.showLeftText}
                  showRightText = {this.state.showRightText}         
                />
              )
            }}
            onSwiped={(cardIndex) => { 
              console.log("the answers", this.state.answers);
              this.setState({ currentCard: cardIndex })
              if(cardIndex === 3){
                this.setState({ 
                  showIndicator: true
                })
                setTimeout(async()=>{
                  this.submitVibe()
                }, 3000)
              }
            }}
            onSwipedAll={() => {console.log('onSwipedAll', this.state.answers)}}
            cardIndex={this.state.currentCard}
            backgroundColor={'#EAE9E9'}
            disableLeftSwipe = {this.state.swipeLeft}
            animateCardOpacity = {true}
            style = {{ backgroundColor: 'white', width: 100 }}
            goBackToPreviousCardOnSwipeRight = {false}
            stackSize= {3}
            showSecondCard={true}
            disableBottomSwipe = {true}
            disableTopSwipe = {true}
            animateCardOpacity = {true}
            onSwipedLeft = {(currentCardIndex)=>{
              let answer = {};
              answer.no = currentCardIndex + 1;
              if(currentCardIndex === 3)
                answer.answer = "restaurant"
              else  
                answer.answer = true;
              let allAnswers = this.state.answers;
              allAnswers.push(answer)
              this.setState(allAnswers)
            }}
            onSwipedRight = {(currentCardIndex)=>{
              let answer = {};
              answer.no = currentCardIndex + 1;
              if(currentCardIndex === 3)
                answer.answer = "bar"
              else
                answer.answer = false;
              let allAnswers = this.state.answers;
              allAnswers.push(answer)
              this.setState(allAnswers)
            }}
            overlayLabelStyle = {
              {
                fontSize: 45,
                fontWeight: 'bold',
                borderRadius: 10,
                padding: 10,
                overflow: 'hidden'
              }
            }
            overlayLabels = {
              {
                left: {
                  title:  this.state.currentCard === 2 ? 'Restaurant' : 'Yes',
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'black',
                      color: 'green',
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      justifyContent: 'flex-start',
                      marginTop: 30,
                      
                    }
                  }
                },
                right: {
                  title: this.state.currentCard === 2 ? 'Bar' : 'No',
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'black',
                      color: 'red'
                    },
                    wrapper: {
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      marginTop: 30,   
                    }
                  }
                }
              }
            }
            
            >  
          </Swiper>
        </View>
       { !this.state.showIndicator &&  
        <View style = {{ flex: 1, justifyContent: 'center',alignItems:'center',flexDirection: 'row',position: 'relative', top: '43%' }} >
          <View style = {styles.swipeButtons}>
            <TouchableOpacity
              style={styles.roundButton1}
              onPress = {()=>{ 
                this.swiperRef.swipeRight()
              }}
            >
              <Icon
                name='x'
                type = 'foundation'
                color = {"red"}
                size = {50}  
              />
            </TouchableOpacity>
          </View> 
          <View style = {styles.swipeButtons} >
            <TouchableOpacity
              style={styles.roundButton1}
              onPress = {()=>{ this.swiperRef.swipeLeft() }}
            >
              <Icon
                name='heart'
                type = 'foundation'
                color = {'#42f5e9'}
                size = {50}  
              />
            </TouchableOpacity>
          </View>
          <View style = {styles.swipeButtons} >
            <TouchableOpacity
              style={styles.roundButton1}>
              <Icon
                name='refresh'
                type = 'foundation'
                color = {"#f5d431"}
                size = {50}  
              />
            </TouchableOpacity>
          </View>
          </View>  
        }
        
        { this.state.showIndicator &&
          <View style={[styles.container, styles.horizontal]}>
            <ActivityIndicator
              size="large" 
              color="white" 
            />
          </View>
        }
      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const { vibe } = state
  return { vibe: vibe }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    submitVibe,
    updateVibe
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MyVibe);


const styles = StyleSheet.create({
    swipeButtons: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    screen:{
      flex:1,
      display:'flex',
      backgroundColor:'white',
      width,
      position: 'relative',
      bottom: '8%',
      padding: 0,
      margin: 0
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
      backgroundColor: "black"
    },
    text: {
      textAlign: "center",
      fontSize: 50,
      backgroundColor: "transparent"
    },
    container: {
      flex: 1,
      justifyContent: "center",
      position: 'relative',
      left: '4%'
    },
    horizontal: {
      flexDirection: "row",
      justifyContent: "space-around",
      padding: 10
    },
    roundButton1: {
      width: 70,
      height: 70,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: 'white',
    },
    roundButton2: {
      marginTop: 20,
      width: 150,
      height: 150,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 10,
      borderRadius: 100,
      backgroundColor: '#ccc',
    }
})