import React from 'react'
import { StyleSheet, Text, View, Button, Dimensions, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native'
import SwipeCards from 'react-native-swipe-cards';
import { Card, NoMoreCards } from '../components/Card';
import Swiper from 'react-native-deck-swiper'
import {submitVibe} from '../../redux/actions/Vibe';
import {updateVibe} from '../../redux/actions/Vibe';
import { getAllCategories } from '../../redux/actions/Category';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon } from 'react-native-elements'
import _, { map } from 'underscore';
import {getfilteredBusiness, emptyBusiness} from '../../redux/actions/Business';
var {width, height} = Dimensions.get('window');
let count = 0;

class MyVibe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      cards: [
        {no: '1', image: require(`../../assets/vibeFor.png`) ,question: " How hard are you trying to Party? "},
        {no: '2', image: require(`../../assets/imageFour.png`) ,question: "What type of Partying are you looking for?"},
        {no: '3', image: require(`../../assets/imageThree.png`) ,question: "What is Crowd Vibe You are looking for?"},
        {no: '4', image: require(`../../assets/imageTwo.png`) ,question: "What age demographic?"},
        // {no: '5', image: require(`../../assets/imageTwo.png`) ,question: "Its a bar category"},
        {no: '6', image: require(`../../assets/settingVibeLogo.jpg`),question: "Setting your Vibe...."}
      ],
      cardIndex: 0,
      answers: [],
      swipeLeft: false,
      showIndicator: false,
      showLeftText: false,
      showRightText: true,
      showFirst: true,
      count: 0,
      showSwiper: true,
      images: [require(`../../assets/imageOne.png`), require(`../../assets/imageFour.png`)],
      selectedBar: ''
    };
    this.swiperRef = React.createRef();
  }

  makeDefaultState = () => {
    console.log("hereee")
    this.setState( {
      cardIndex: 0,
      answers: [],
      swipeLeft: false,
      showIndicator: false,
      showLeftText: false,
      showRightText: true
    },  ()=>{ this.setState({  showFirst: true }) })

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

  async componentDidMount(){
    this.props.navigation.addListener('focus', async () => {
      console.log("hrer");
      // RNRestart.Restart();
      await this.props.getAllCategories();
      this.makeDefaultState();
      this.setState({ showFirst :true })
    });
  }

  submitVibe = async() => {
    const {navigation} = this.props;
    
    let vibeData = {
      crowdedPlace: false,
      nightLife: false,
      ageInterval: '',
      barType: ''
    }

    if(this.state.answers[0].answer === "more"){
      console.log("inn")
      vibeData.nightLife = true;
    }
    else {
      console.log("out", this.state.answers[0])
      vibeData.nightLife = false;
    }      
    
    if(this.state.answers[1].answer === 'nightClub')
      vibeData.nightLife = true
    else 
      vibeData.nightLife = false;   

    if(this.state.answers[2].answer === 'crowdy')
      vibeData.crowdedPlace = true
    else
      vibeData.crowdedPlace = false
    
    if(vibeData.crowdedPlace && !vibeData.nightLife && this.state.answers[1].answer === 'nightClub')  // This check is for if user select more bu select quiet place
      vibeData.nightLife = true;  

    if(this.state.answers[3] === 'elder')
      vibeData.ageInterval = 'elder';
    else 
      vibeData.ageInterval = 'young';   
    
    console.log("the selected bar", this.state.selectedBar)

    if(this.state.selectedBar && !vibeData.nightLife)
      vibeData.barType = this.state.selectedBar;

    console.log("the vibe data update", vibeData);  
    const getVibe = this.props.vibe.vibe.vibe
    if(_.isEmpty(getVibe)){
      console.log("the new", getVibe)
      const submitVibe =  await this.props.submitVibe(vibeData)
      if(submitVibe){
        this.setState({ showIndicator: false })
        // navigation.navigate('Screen 1');
        navigation.popToTop()
      }
    }
    else{
      console.log("in updating vibe")
      const updateVibe = await this.props.updateVibe(vibeData);
        
        if(updateVibe){
          this.setState({ showIndicator: false })
        await this.props.emptyBusiness()
        this.props.getfilteredBusiness(null, null);  
        navigation.navigate('Screen 1');
        // navigation.popToTop()
      }
    }
    
  }

  getSwipeLableLeft = (index) => {
    console.log("the index", 0)
    if(index === 0)
      return "nightClub"
    else if(index === 1){
      return "UnCrowdy"
    }
    else if(index === 2){
      return "Young"
    }  
  }

  getSwipeLableRight = (index) => {
   
    if(index === 0)
      return "bar"
    else if(index === 1){
      return "Crowdy"
    }
    else if(index === 2){
      return "elder"
    }  
  }

  selectedBar = (category) =>{
    console.log("the category", category)
    this.setState({ 
      selectedBar: category.title, 
      showSwiper: true,
      cardIndex: 4 
    },()=>{
      this.setState({ 
        showIndicator: true
      })
      setTimeout(async()=>{
        this.submitVibe()
      }, 3000)
    })
    
  }

  wannaBar = () => {
    if(this.state.answers[1].answer !== 'nightClub')
      return true
    return false;  
  }

  render(){
    const { category } = this.props.category.category
    // console.log("the category", category)
    const barCategories = category.length>0 && category.filter((category)=> category.type === "sub_bar" );
    // console.log("the bar categories", barCategories)
    return (
      <View style={styles.screen}>
        {  this.state.showFirst  && 
        <View style = {{ flex: 1 }} >
          
        { this.state.showSwiper ?
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
               console.log("on swipe index", cardIndex);
              this.setState({  cardIndex })
              if(cardIndex === 3 && this.wannaBar() ){
                this.setState({ showSwiper: false })
              }
              else if(cardIndex === 3 && !this.wannaBar()){
                this.setState({ 
                  showIndicator: true
                })
                setTimeout(async()=>{
                  this.submitVibe()
                }, 3000)
              }
            }}
            onSwipedAll={() => {console.log('onSwipedAll', this.state.answers)}}
            cardIndex={this.state.cardIndex}
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
              console.log("the index in answer", currentCardIndex)
              let answer = {};
              answer.no = currentCardIndex + 1;
              if(currentCardIndex === 0)
                answer.answer = "more"
              else if(currentCardIndex === 1)
                answer.answer = "bar"
              else if(currentCardIndex === 2)
                answer.answer = "uncrowdy"
              else if(currentCardIndex === 3)
                answer.answer = "young"     
              
              let allAnswers = this.state.answers;
              allAnswers.push(answer)
              this.setState(allAnswers)
            }}
            onSwipedRight = {(currentCardIndex)=>{
              let answer = {};
              answer.no = currentCardIndex + 1;
              if(currentCardIndex === 0)
                answer.answer = "less"
              else if(currentCardIndex === 1)
                answer.answer = "nightClub"
              else if(currentCardIndex === 2)
                answer.answer = "crowdy"
              else if(currentCardIndex === 3)
                answer.answer = "elder"   

              let allAnswers = this.state.answers;
              allAnswers.push(answer)
              this.setState(allAnswers)
            }}
            overlayLabelStyle = {
              {
                fontSize: 20,
                fontWeight: 'bold',
                borderRadius: 10,
                padding: 10,
                overflow: 'hidden'
              }
            }
            overlayLabels = {
              {
                left: {
                  title:  this.getSwipeLableLeft(this.state.cardIndex),
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'black',
                      color: 'green',
                      marginTop: 30
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
                  title: this.getSwipeLableRight(this.state.cardIndex),
                  style: {
                    label: {
                      backgroundColor: 'transparent',
                      borderColor: 'black',
                      color: 'red',
                      marginTop: 30
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
          </Swiper> :  
            <View 
              style = {{ flex: 1 ,backgroundColor: '#f8f7f7', borderWidth: 0, justifyContent: 'center', marginTop: 0, position: 'relative', top: '20%'}}
            > 
              <Text style = {{ fontSize: 25, width: '80%',textAlign: 'center',alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }} >Which Bar type you gonna for?</Text>
              <ScrollView  horizontal = { true } showsHorizontalScrollIndicator = { false }>
                {barCategories && barCategories.map((category)=>{
                 return (
                  <View 
                    style = {{ flex:1 }} 
                  >
                    <View style = {{ flex:1, alignItems: 'center', justifyContent: 'flex-end' }} >
                      <Text style = {{ fontSize: 20, fontWeight: '700' }} >{ category.title }</Text>
                    </View>
                    <View style = {{ flex:4, padding: 5 }} >
                      <Image
                        source = {{ uri: category.imageUrl}}
                        style = {{ width: width * 0.5, height: height * 0.2 }}
                      />
                      <TouchableOpacity 
                        style = { styles.selectBar }
                        onPress = {()=>{  this.selectedBar(category)}} 
                      >
                        <Text style = {{ fontSize: 25 }} >Select</Text>
                      </TouchableOpacity>    
                    </View>
                  </View>
                 )
                })
                }
              </ScrollView>
            </View>           
          }
          
        </View> 
        }
        
       {/* { (!this.state.showIndicator && this.state.showSwiper )  &&  
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
          </View>  
        } */}
        
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
  const { vibe, category } = state
  return { 
    vibe: vibe, 
    category 
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    submitVibe,
    updateVibe,
    getAllCategories,
    getfilteredBusiness,
    emptyBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MyVibe);


const styles = StyleSheet.create({
    swipeButtons: {
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    selectBar:{
      position: 'absolute', 
      top: '28%',
      left: '40%', 
      borderRadius: 6, 
      backgroundColor: '#ffcccc' 
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
      bottom: '30%'
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