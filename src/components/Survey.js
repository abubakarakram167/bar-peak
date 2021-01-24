import React, { Component } from 'react';
import { StyleSheet, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { SimpleSurvey } from 'react-native-simple-survey';
import { COLORS } from './validColors';
import {setProgressionBar} from '../../redux/actions/User'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Spinner from 'react-native-loading-spinner-overlay';
import { getUserData } from './localStorage'; 
import axios  from '../api/axios';
import AlertComponent from './AlertComponent';
import { showRatingModal } from '../../redux/actions/Components';

const GREEN = 'rgba(32, 168, 68,1)';
const PURPLE = 'rgba(108,48,237,1)';

const survey = [
    {
        questionType: 'SelectionGroup',
        questionText:
            'What level of Fun you found?',
        questionId: 'fun',
        options: [
            {
                optionText: 'Not Fun',
                value: 1
            },
            {
                optionText: 'Sort of Fun',
                value: 2
            },
            {
                optionText: 'Decent',
                value: 3
            },
            {
                optionText: 'Very Fun',
                value: 4
            },
            {
                optionText: 'All Time',
                value: 5
            }
        ]
    },
    {
      questionType: 'SelectionGroup',
      questionText:'How much Crowd is present?',
      questionId: 'crowd',
      options: [
          {
              optionText: 'Dead',
              value: 1
          },
          {
              optionText: 'Some People',
              value: 2
          },
          {
              optionText: 'Decent Level of Crowd',
              value: 3
          },
          {
              optionText: 'Gettin Pretty Crowded',
              value: 4
          },
          {
              optionText: 'Packed-in Like Sardines',
              value: 5
          }
      ]
    },
    {
      questionType: 'SelectionGroup',
      questionText:'Do you find Difficulty Getting In?',
      questionId: 'difficultyGettingIn',
      options: [
        {
          optionText: 'No Problem',
          value: 1
        },
        {
          optionText: 'Less than 5-minute wait ',
          value: 2
        },
        {
          optionText: '5 - 15-Minute Wait',
          value: 3
        },
        {
          optionText: '15 - 30-Minute Wait',
          value: 4
        },
        {
          optionText: 'Over 30-Minute Wait ',
          value: 5
        }
      ]   
    },
    {
      questionType: 'SelectionGroup',
      questionText:'Which Gender composition you find Best?',
      questionId: 'genderComposition',
      options: [
        {
          optionText: 'Equal Girls and Guys ',
          value: 1
        },
        {
          optionText: 'More Guys than Girls',
          value: 2
        },
        {
          optionText: 'More Girls than Guys',
          value: 3
        }
      ]   
    },
    {
      questionType: 'SelectionGroup',
      questionText:' Do you find Difficulty Getting a Drink?',
      questionId: 'difficultyGettingADrink',
      options: [
        {
          optionText: 'No Problem',
          value: 1
        },
        {
          optionText: 'A Little Slow',
          value: 2
        },
        {
          optionText: 'Starting to Get Annoying',
          value: 3
        },
        {
          optionText: 'Forget About It',
          value: 4
        }
      ]   
    }
];

export class SurveyComponent extends Component {
    static navigationOptions = () => {
      return {
          headerStyle: {
              backgroundColor: GREEN,
              height: 40,
              elevation: 5,
          },
          headerTintColor: '#fff',
          headerTitle: 'Sample Survey',
          headerTitleStyle: {
              flex: 1,
          }
      };
    }


    constructor(props) {
        super(props);
        this.state = { 
          backgroundColor: PURPLE, 
          answersSoFar: '', 
          questionText: '', 
          spinner: false,
          showConfirmation: false 
        };
    }

    onSurveyFinished(answers) {
      console.log("the propertyyy")
      const infoQuestionsRemoved = [...answers];
      const answersAsObj = {};
      for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }
      this.saveRating(infoQuestionsRemoved)
    }
    onAnswerSubmitted(answer) {
      this.setState({ answersSoFar: JSON.stringify(this.surveyRef.getAnswers(), 2) });
      switch (answer.questionId) {
        case 'fun': {
          if (COLORS.includes(answer.value)) {
            this.setState({ backgroundColor: answer.value });
          }
          break;
        }
        default:
          break;
      }
    }

    renderPreviousButton(onPress, enabled) {
      return (
        <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
          <Button
            color={GREEN}
            onPress={onPress}
            disabled={!enabled}
            backgroundColor={GREEN}
            title={'Previous'}
          />
        </View>
      );
    }

    renderNextButton(onPress, enabled) {
      return (
        <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
          <Button
            color={GREEN}
            onPress={onPress}
            disabled={!enabled}
            backgroundColor={GREEN}
            title={'Next'}
          />
        </View>
      );
    }

    renderFinishedButton(onPress, enabled) {
        return (
          <View style={{ flexGrow: 1, maxWidth: 100, marginTop: 10, marginBottom: 10 }}>
            <Button
              title={'Finished'}
              onPress={onPress}
              disabled={!enabled}
              color={GREEN}
            />
          </View>
        );
    }

    renderButton(data, index, isSelected, onPress) {
      return (
        <View
            key={`selection_button_view_${index}`}
            style={{ marginTop: 5, marginBottom: 5,borderRadius: 10 ,justifyContent: 'flex-start', backgroundColor: PURPLE }}
        >
          <Button
            title={data.optionText}
            onPress={onPress}
            color={isSelected ? GREEN : 'white'}
            style={isSelected ? { fontWeight: 'bold', fontWeight: '700', backgroundColor: 'rgba(107, 115, 219, 1)' } : {}} 
            key={`button_${index}`}
          />
        </View>
      );
    }

    renderQuestionText= (questionText)=> {
      console.log("the question text", questionText)
      if(questionText === "What level of Fun you found?")
        this.props.setProgressionBar(20)
      else if(questionText === "How much Crowd is present?")
        this.props.setProgressionBar(40)
      else if(questionText === "Do you find Difficulty Getting In?")
        this.props.setProgressionBar(60)
      else if (questionText === "Which Gender composition you find Best?")
        this.props.setProgressionBar(80)
      else 
        this.props.setProgressionBar(100)
      return (
        <View style={{ marginLeft: 10, marginRight: 10 }}>
          <Text numLines={1} style={styles.questionText}>{questionText}</Text>
        </View>
      );
    }

    renderTextBox(onChange, value, placeholder, onBlur) {
      return (
        <View>
          <TextInput
            style={styles.textBox}
            onChangeText={text => onChange(text)}
            numberOfLines={1}
            underlineColorAndroid={'white'}
            placeholder={placeholder}
            placeholderTextColor={'rgba(184,184,184,1)'}
            value={value}
            multiline
            onBlur={onBlur}
            blurOnSubmit
            returnKeyType='done'
          />
        </View>
      );
    }

    renderNumericInput(onChange, value, placeholder, onBlur) {
      return (
        <TextInput 
          style={styles.numericInput}
          onChangeText={text => { onChange(text); }}
          underlineColorAndroid={'white'}
          placeholderTextColor={'rgba(184,184,184,1)'}
          value={String(value)}
          placeholder={placeholder}
          keyboardType={'numeric'}
          onBlur={onBlur}
          maxLength={3}
        />
      );
    }

    renderInfoText(infoText) {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text style={styles.infoText}>{infoText}</Text>
            </View>
        );
    }

    saveRating = async(answers) => {
      console.log("this.props.data", this.props.data);
      let FinalAnswers = answers.map((answer)=> answer.value )
      const rating = {
        fun: FinalAnswers[0].value,
        crowd: FinalAnswers[1].value,
        difficultyGettingIn: FinalAnswers[2].value,
        ratioInput: FinalAnswers[3].value,
        difficultyGettingADrink: FinalAnswers[4].value
      }
      this.setState({ spinner: true })
      const { token } = await getUserData();
      const { data } = this.props;
      const body = {
          query:`
          mutation{
            addRating(rating:{
              fun: ${rating.fun.toFixed(2)},
              crowd: ${rating.crowd.toFixed(2)},
              ratioInput: ${rating.ratioInput.toFixed(2)},
              difficultyGettingIn: ${rating.difficultyGettingIn.toFixed(2)},
              difficultyGettingDrink: ${rating.difficultyGettingADrink.toFixed(2)}    
            },
            businessId: "${data.markerId}"
            ){
              fun,
              crowd,
              ratioInput,
              difficultyGettingDrink,
              difficultyGettingIn
            }
          }
          `
      }
      try{  
        const res = await axios.post(`graphql?`,body,{ headers: {
          'Authorization': `Bearer ${token}`
        } });
    
        // this.props.updateRating(res.data.data.addRating);
        this.setState({ spinner: false, showConfirmation: true },()=>{
          setTimeout(()=>{  
            this.props.showRatingModal(false)
          }, 2000)
        })
      }catch(err){
        console.log("hte errorsss", err)
      }
  
    }

    render() {
      return (
        <View style={[styles.background, { backgroundColor: this.state.backgroundColor }]}>
          <View style={styles.container}>
            <SimpleSurvey
              ref={(s) => { this.surveyRef = s; }}
              survey={survey}
              renderSelector={this.renderButton.bind(this)}
              containerStyle={styles.surveyContainer}
              selectionGroupContainerStyle={styles.selectionGroupContainer}
              navButtonContainerStyle={{ flexDirection: 'row', justifyContent: 'space-around' }}
              renderPrevious={this.renderPreviousButton.bind(this)}
              renderNext={this.renderNextButton.bind(this)}
              renderFinished={this.renderFinishedButton.bind(this)}
              renderQuestionText={ (question)=> this.renderQuestionText(question)}
              onSurveyFinished={(answers) => this.onSurveyFinished(answers)}
              onAnswerSubmitted={(answer) => this.onAnswerSubmitted(answer)}
              renderTextInput={this.renderTextBox}
              renderNumericInput={this.renderNumericInput}
              renderInfo={this.renderInfoText}
            />
            <View style={styles.spinnerContainer}>
              <Spinner
                visible={this.state.spinner}
                textContent={'Loading...'}
                textStyle={styles.spinnerTextStyle}
              />
            </View>
            { 
              this.state.showConfirmation &&
                (<AlertComponent 
                  closeModal = {()=>{ 
                    this.setState({ showConfirmation: false }) 
                  }} 
                  rating = {false} 
                  showError = {this.state.showConfirmation} 
                  message = "Rating Succesffully Submitted" 
                />)
            }
          </View>    
        </View>
      );
    }
}


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setProgressionBar,
    showRatingModal 
  }, dispatch)
);



export default connect(null, mapDispatchToProps)(SurveyComponent);

const styles = StyleSheet.create({
    button: {
      margin: 10,
      height: 30,
      width: 140,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center'
    },
    container: {
        minWidth: '95%',
        maxWidth: '95%',
        alignItems: 'stretch',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 10,
        flex: 1, 
    },
    answersContainer: {
        width: '90%',
        maxHeight: '20%',
        marginTop: 50,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginBottom: 20,
        backgroundColor: 'white',
        elevation: 20,
        borderRadius: 10,
    },
    surveyContainer: {
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        alignContent: 'center',
        padding: 5,
        flexGrow: 0,
        elevation: 20,
    },
    selectionGroupContainer: {
        flexDirection: 'column',
        backgroundColor: '#edebeb',
        alignContent: 'flex-end',
        minWidth: '80%'
    },
    navButtonText: {
        margin: 10,
        fontSize: 20,
        color: 'white',    
        width: 'auto'
    },
    answers: {
        alignSelf: 'center',
        marginBottom: 10,
    },
    navigationButton: {    
      minHeight: 40,
      backgroundColor: GREEN,
      padding: 0,
      borderRadius: 100,
      marginTop: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    background: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    questionText: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center'
    },
    textBox: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        backgroundColor: 'white',
        borderRadius: 10,
        
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10
    },
    numericInput: {
        borderWidth: 1,
        borderColor: 'rgba(204,204,204,1)',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        marginLeft: 10,
        marginRight: 10
    },
    infoText: {
        marginBottom: 20,
        fontSize: 20,
        marginLeft: 10
    },
});