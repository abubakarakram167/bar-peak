import React, { Component } from 'react';
import { StyleSheet, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { SimpleSurvey } from 'react-native-simple-survey';
import { COLORS } from './validColors';
import {setProgressionBar} from '../../redux/actions/User'; 
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

const GREEN = 'rgba(141,196,63,1)';
const PURPLE = 'rgba(108,48,237,1)';

const survey = [
    {
        questionType: 'SelectionGroup',
        questionText:
            'Fun?',
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
      questionText:
          'Crowd Factor?',
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
    }
    ,
    {
        questionType: 'Info',
        questionText: 'That is all for the demo, tap finish to see your results!'
    },
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
        this.state = { backgroundColor: PURPLE, answersSoFar: '', questionText: '' };
    }

    onSurveyFinished(answers) {
        /** 
         *  By using the spread operator, array entries with no values, such as info questions, are removed.
         *  This is also where a final cleanup of values, making them ready to insert into your DB or pass along
         *  to the rest of your code, can be done.
         * 
         *  Answers are returned in an array, of the form 
         *  [
         *  {questionId: string, value: any},
         *  {questionId: string, value: any},
         *  ...
         *  ]
         *  Questions of type selection group are more flexible, the entirity of the 'options' object is returned
         *  to you.
         *  
         *  As an example
         *  { 
         *      questionId: "favoritePet", 
         *      value: { 
         *          optionText: "Dogs",
         *          value: "dog"
         *      }
         *  }
         *  This flexibility makes SelectionGroup an incredibly powerful component on its own. If needed it is a 
         *  separate NPM package, react-native-selection-group, which has additional features such as multi-selection.
         */

        const infoQuestionsRemoved = [...answers];

        // Convert from an array to a proper object. This won't work if you have duplicate questionIds
        const answersAsObj = {};
        for (const elem of infoQuestionsRemoved) { answersAsObj[elem.questionId] = elem.value; }

        this.props.navigation.navigate('SurveyCompleted', { surveyAnswers: answersAsObj });
    }

    /**
     *  After each answer is submitted this function is called. Here you can take additional steps in response to the 
     *  user's answers. From updating a 'correct answers' counter to exiting out of an onboarding flow if the user is 
     *  is restricted (age, geo-fencing) from your app.
     */
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
            style={{ marginTop: 5, marginBottom: 5, justifyContent: 'flex-start' }}
        >
          <Button
            title={data.optionText}
            onPress={onPress}
            color={isSelected ? GREEN : PURPLE}
            style={isSelected ? { fontWeight: 'bold' } : {}} 
            key={`button_${index}`}
          />
        </View>
      );
    }

    renderQuestionText= (questionText)=> {
      console.log("the question text", questionText)
      if(questionText === "Fun?")
        this.props.setProgressionBar(0)
      else if(questionText === "Crowd Factor?")
        this.props.setProgressionBar(20)
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
      console.log(" the valeu", value)
        return (<TextInput 
            style={styles.numericInput}
            onChangeText={text => { onChange(text); }}
            underlineColorAndroid={'white'}
            placeholderTextColor={'rgba(184,184,184,1)'}
            value={String(value)}
            placeholder={placeholder}
            keyboardType={'numeric'}
            onBlur={onBlur}
            maxLength={3}
        />);
    }

    renderInfoText(infoText) {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>
                <Text style={styles.infoText}>{infoText}</Text>
            </View>
        );
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
              </View>    
            </View>
        );
    }
}


const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setProgressionBar,
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
        minWidth: '90%',
        maxWidth: '90%',
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
        width: 'auto',
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
        fontSize: 24,
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