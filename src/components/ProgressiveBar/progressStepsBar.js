import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import Style from "../CSS/ProgressiveBar";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Carousel from '../Carousels/vibeSelectionCarousel';
import {Entries} from '../Carousels/static/entries';
import { connect } from 'react-redux';
import OrientationLoadingOverlay from 'react-native-orientation-loading-overlay'
import { bindActionCreators } from 'redux';
import {getfilteredBusiness, emptyBusiness} from '../../../redux/actions/Business';
import {submitVibe, updateVibe} from '../../../redux/actions/Vibe';
import _, { map } from 'underscore';
import RestartVibeModal from '../Modals/VibeRestart';

class ProgressStepBar extends Component {
  static navigationOptions = {
    header: null
  };
  state = {
    question1: null,
    question2: null,
    question3: [],
    question4: null,
    question5: null,
    currentStep: 1,
    showIndicator: false,
    restartVibeModal: false
  }

  defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };

  onNextStep = ( ) => {
    let stepTokSkips = 0;
    console.log("the state question 2", this.state.question2);
    if(this.state.question2 !== 'Night Clubs')
      stepTokSkips = 1;
    else
      stepTokSkips = 2
    console.log("step to skips", stepTokSkips) 

    setTimeout(()=>{
      this.setState({ currentStep: this.state.currentStep + stepTokSkips },
        () => {
          console.log("the current step", this.state.currentStep)
        }
      )
    }, 100)
  
  };

  componentDidMount(){
    // setTimeout(()=>{
    //   console.log("its here")
    //   this.setState({ currentStep: 3 })
    // }, 2000)
    
  }

  onPaymentStepComplete = () => {
    // alert('Payment step completed!');
  };

  onPrevStep = () => {
    let stepTokSkips = 0;
    console.log("the state question 2", this.state.question2);
    if(this.state.question2 !== 'Night Clubs')
      stepTokSkips = 1;
    else
      stepTokSkips = 2
    console.log("step to skips", stepTokSkips) 

    setTimeout(()=>{
      this.setState({ currentStep: this.state.currentStep - stepTokSkips },
        () => {
          console.log("the current step", this.state.currentStep)
        }
      )
    }, 100)
  };

  getSelectedCategories = (barOrNightClub) => {
    const { category } = this.props.category.category;
    let selectedCategory;
  
    if(barOrNightClub === "nightClub"){
      selectedCategory = category.filter(category => category.title === 'Night Clubs')
    }
    else{
      const barCategories = this.state.question3;
      console.log("the bar categories", barCategories);
      selectedCategory = category.filter((category)=>  barCategories.includes(category._id))
     
    }
    let mapData = selectedCategory.map(category => category._id)
    console.log("after the map", mapData)
    return mapData;
  }

  onSubmitSteps = () => {
    const { category } = this.props.category.category;
    const {
      question1,
      question2,
      question3,
      question4,
      question5
    } = this.state;
    let vibeCategory = '';
    let submit = true
    const vibe = {
      fun: question1,
      party: question2,
      barOrNightClub: question2 === "Night Clubs" ? 'nightClub' : 'bar',
      crowdLevel: question4,
      ageDemographic: question5,
      vibeCategory: '',
      selectedCategories: []
    };
    let onlyDiveBar = category.filter(category => category.title ===  "Dive Bar" ).map(category => category._id)[0];
    const { barOrNightClub, fun, crowdLevel } = vibe;
    if(fun === "Hard" && crowdLevel === "Crowded" )
      vibeCategory = "Professional Party Time";
    else if(fun === "Moderate" && crowdLevel === "Crowded")
      vibeCategory = "Moderate Party Time";
    else if(fun === "Mellow" && barOrNightClub === 'bar' && this.getSelectedCategories(barOrNightClub).includes(onlyDiveBar) && crowdLevel === "Uncrowded" )
    vibeCategory = "Netflix and Chill";    
    else if(["Moderate"].includes(fun) && barOrNightClub === 'bar' && crowdLevel === "Uncrowded")
      vibeCategory = "Social Drinking";
    else if(fun === "Mellow" && barOrNightClub === 'bar' && crowdLevel === "Uncrowded"  )
      vibeCategory = "Baby Party Time";  
    else{
      this.setState({ restartVibeModal: true })
      submit = false
    }
    vibe.vibeCategory = vibeCategory;
    vibe.selectedCategories = this.getSelectedCategories(barOrNightClub).toString()
    
    if(submit)
      this.setVibe(vibe)
  }


  setVibe = async(vibeData) => {
    this.setState({ showIndicator: true })
    const {navigation} = this.props;  
    const getVibe = this.props.vibe.vibe.vibe
    if(_.isEmpty(getVibe)){
      const submitVibe =  await this.props.submitVibe(vibeData)
      if(submitVibe){
        this.props.getfilteredBusiness(null, null, null);
        setTimeout(()=> {
          this.setState({ showIndicator: false }, ()=> {
            navigation.navigate('Screen 1'); 
          })
        }, 1000) 
       
      }
    }
    else{
      const updateVibe = await this.props.updateVibe(vibeData);      
      if(updateVibe){
        await this.props.emptyBusiness()
        this.props.getfilteredBusiness(null, null, null); 
        this.setState({ showIndicator: false }) 
        navigation.navigate('Screen 1'); 
      }
    }
  }

  getSelectedBars = (barId) => {
    const { category } = this.props.category.category;
    let getAllBars = this.state.question3.length > 0 ? this.state.question3 : []
    if(barId === "AllBarsId"){
      if (getAllBars.includes("AllBarsId"))
        getAllBars = [];
      else{  
        getAllBars = category.filter((category) =>  category.type === 'sub_bar').map(category => category._id)
        getAllBars.push("AllBarsId")
      }
    }
    else{
      if(getAllBars.includes(barId))
        getAllBars = getAllBars.filter((bar) =>  bar !== barId  )
      else
        getAllBars.push(barId)
    }
    return getAllBars;   
  }

  getSelectedChoice = (choiceName, number) => {
    const stateQuestion = this.state;
    if(stateQuestion['question' + number ] === choiceName)
      return null;
    return choiceName
  }

  selectChoice = (choice, number) => {
    const allQuestions = {};
    if(number !== 3)
      allQuestions['question' + number] = this.getSelectedChoice(choice, number);
    else if(number === 3)
      allQuestions['question' + number] = this.getSelectedBars(choice)

    console.log("the all questions", allQuestions)
    this.setState(allQuestions);  
  }

  restartVibeProcess = () => {
    this.setState({ 
      restartVibeModal: false,
      question1: null,
      question2: null,
      question3: [],
      question4: null,
      question5: null,
      currentStep: 1, 
    })
  }

  getButtonDisableOrNot = () => {
    if(this.state.currentStep !== 3)
      return !this.state[`question${this.state.currentStep}`]
    else
      return this.state[`question${this.state.currentStep}`].length> 0 ? false : true
  }

  getNextButtonStylerOrNot = () => {
    if(this.state.currentStep !== 3)
      return this.state[`question${this.state.currentStep}`] ? Style.nextButton: {}
    else
      return this.state[`question${this.state.currentStep}`].length> 0 ? Style.nextButton: {}
  }
 

  render() {
    const { category } = this.props.category.category;
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <OrientationLoadingOverlay
          visible={this.state.showIndicator}
          message = "Loading..."
          color="white"
          indicatorSize="large"
          messageFontSize={24}
        >
          <View>
            <Image
              source={require('../../../assets/loadingIndicator.gif')}
            />
          </View>
        </OrientationLoadingOverlay>  
        <ProgressSteps
          labelFontSize = {14}
          progressBarColor = "gray"
          activeStepIconColor = "white"
          disabledStepIconColor = "#bbbdbf"
          disabledStepNumColor = "#4e4f4f"
          activeLabelFontSize = {26}
          finishBtnText = "Set Vibe"
          activeStep = { this.state.currentStep - 1}
        >
          { 
            Entries(category).map((entry, index)=>{
              return(
                entry.label !== "Age Range" ? 
                <ProgressStep
                  key = {index}
                  label={entry.label}
                  labelFontSize = {12}
                  onNext={()=> this.onNextStep(this.state.currentStep ) }
                  onPrevious={ ()=> this.onPrevStep( this.state.currentStep ) }
                  scrollViewProps={this.defaultScrollViewProps}
                  style = {Style.labelText}
                  nextBtnDisabled = { this.getButtonDisableOrNot() }
                  nextBtnStyle = { this.getNextButtonStylerOrNot() }
                  nextBtnTextStyle = {{ color: 'white', fontSize: 15, fontWeight: '700' }}
                >
                  <Text style = {Style.questionText}>{entry.question}</Text>
                  <Carousel 
                    entries = {entry.data} 
                    currentStep = {this.state.currentStep}
                    value = { this.state[`question${this.state.currentStep}`] }  
                    selectChoice = { (choice, number)=> { this.selectChoice(choice, number)   } } 
                />
                </ProgressStep> :
                <ProgressStep
                  label="Age"
                  onPrevious={ ()=> this.onPrevStep( this.state.currentStep ) }
                  onSubmit={this.onSubmitSteps}
                  style = {Style.labelText}
                  scrollViewProps={this.defaultScrollViewProps}
                  nextBtnDisabled = { this.getButtonDisableOrNot() }
                  nextBtnStyle = { this.getNextButtonStylerOrNot() }
                  finishBtnText = "Set Vibe"
                > 
                  <Text style = {Style.questionText}> { entry.question } </Text>
                  <Carousel 
                    entries = {entry.data} 
                    currentStep = {this.state.currentStep}  
                    value = { this.state[`question${this.state.currentStep}`] }  
                    selectChoice = { (choice, number)=> { this.selectChoice(choice, number)   } } 
                  />
                </ProgressStep>
              )
            })
          }
        
        </ProgressSteps>
       { this.state.restartVibeModal && 
          <RestartVibeModal  
            show = {this.state.restartVibeModal} 
            onRestart = {()=> this.restartVibeProcess()} 
          />
        }
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { category, vibe } = state
  return { 
    category,
    vibe
  }
};

const mapDispatchToProps = dispatch => (
  bindActionCreators({
    submitVibe,
    updateVibe,
    emptyBusiness,
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(ProgressStepBar);