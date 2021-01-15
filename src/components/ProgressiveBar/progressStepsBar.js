import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Style from "../CSS/ProgressiveBar";
import { ProgressSteps, ProgressStep } from 'react-native-progress-steps';
import Carousel from '../Carousels/vibeSelectionCarousel';
import {Entries} from '../Carousels/static/entries';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ProgressStepBar extends Component {
  static navigationOptions = {
    header: null
  };

  defaultScrollViewProps = {
    keyboardShouldPersistTaps: 'handled',
    contentContainerStyle: {
      flex: 1,
      justifyContent: 'center'
    }
  };

  onNextStep = () => {
    console.log('called next step');
  };

  onPaymentStepComplete = () => {
    // alert('Payment step completed!');
  };

  onPrevStep = () => {
    console.log('called previous step');
  };

  onSubmitSteps = () => {
    console.log('called on submit step.');
  };

  render() {
    const { category } = this.props.category.category;
  
    return (
      <View style={{ flex: 1, marginTop: 20 }}>
        <ProgressSteps
          labelFontSize = {14}
          progressBarColor = "gray"
          activeStepIconColor = "white"
          disabledStepIconColor = "#bbbdbf"
          disabledStepNumColor = "#4e4f4f"
          activeLabelFontSize = {26}
        >
          { Entries(category).map((entry)=>{
              return(
                <ProgressStep
                  label={entry.label}
                  labelFontSize = {12}
                  onNext={this.onPaymentStepComplete}
                  onPrevious={this.onPrevStep}
                  scrollViewProps={this.defaultScrollViewProps}
                  style = {Style.labelText}
                >
                  <Text style = {Style.questionText}>{entry.question}</Text>
                  <Carousel entries = {entry.data} />
                </ProgressStep>
              )
            })
          }
          {/* 
          <ProgressStep
            label="Age"
            onPrevious={this.onPrevStep}
            onSubmit={this.onSubmitSteps}
            scrollViewProps={this.defaultScrollViewProps}
          > 
            <Text style = {Style.questionText}>How hard are you trying to party?</Text>
            <Carousel />
          </ProgressStep> */}
        </ProgressSteps>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { category } = state
  return { 
    category
  }
};

export default connect(mapStateToProps, null)(ProgressStepBar);