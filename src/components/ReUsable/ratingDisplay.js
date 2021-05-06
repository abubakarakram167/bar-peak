import React from 'react'                                       
import { Text, View } from 'react-native';
import styles from './CSS/ratingDisplay';
import { LinearGradient } from 'expo-linear-gradient';

const Red = '#ff0000';
const Green = '#1dbf73';
const Orange =  '#f7a600';
const Blue = '#1DA1F2';
const Pink = '#eb3498';


export default (props) => {

  const getRatingCase = (ratingCase, value) => {
    if(ratingCase === "crowd"){
      if(value >= 0 && value <= 1)
        return "Dead";
      else if (value > 1 && value <= 2)
        return "Some People";
      else if (value > 2 && value <= 3)
        return "Decent Level of Crowd";
      else if(value >= 3 && value <=4)
        return "Getting Pretty Crowded";
      else if(value >= 4 && value <= 5)
        return "Packed-in Like Sardines";
    }
    else if(ratingCase === "fun"){
      if(value >= 0 && value <= 1)
        return "Not Fun";
      else if (value > 1 && value <= 2)
        return "Sort Of Fun";
      else if (value >= 2.1 && value <= 3)
        return "Decent";
      else if(value >= 3.1 && value <= 4)
        return "Very Fun";
      else if(value >= 4.1 && value <= 5)
        return "All Time";
    }
    else if(ratingCase === "difficultyGettingIn"){
      if(value >= 0 && value <= 1)
        return "No Problem ";
      else if (value > 1 && value <= 2)
        return "Less than 5-minute wait";
      else if (value > 2 && value <= 3 )
        return "5 - 15-Minute Wait";
      else if(value > 3 && value <= 4)
        return "15 - 30-Minute Wait";
      else if(value > 4 && value <= 5)
        return "Over 30-Minute Wait ";
    }
    else if(ratingCase === 'genderBreakdown'){
      if(value >= 0 && value <= 1)
        return "Equal Girls and Guys";
      else if (value > 1 && value <= 2)
        return "More Guys than Girls";
      else if (true || value >= 2.1 && value <= 3)
        return "More Girls than Guys";
    }
    else if(ratingCase === "difficultyGettingADrink"){
      if(value >= 0 && value <= 1)
        return "No Problem";
      else if (value >= 1 && value <= 2)
        return "A Little Slow";
      else if (value > 2 && value <= 3)
        return "Starting to Get Annoying";
      else if (value > 3 && value <= 4)
        return "Forget About It";
      
    }
  }
  
  const getVibeBaseColor = () => {
    const ratingCase = props.ratingCase
    const ratingOptions = getRatingCase(props.ratingCase, props.defaultRating);
    let currentColor = ''
    let currentVibe = props.currentVibe.vibeCategory;

    if(ratingCase === "crowd"){
      if(ratingOptions === "Dead"){
        if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Red;
        else if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else if("Netflix and Chill")
          currentColor = Green    
      }
      else if(ratingOptions === 'Some People'){ 
        if( ["Professional Party Time", "Moderate Party Time, Netflix and Chill"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Green;     
      }
      else if(ratingOptions === 'Decent Level of Crowd'){
        if( ["Baby Party Time"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Professional Party Time", "Moderate Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Green;
        else
          currentColor = Red       
      }
      else if(ratingOptions === 'Getting Pretty Crowded'){
        if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Green;
        else
          currentColor = Red  
      }
      else{
        if( ["Moderate Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange
        else if( ["Professional Party Time"].includes(currentVibe) )
          currentColor = Green;
        else
          currentColor = Red  
      }
    
      return [currentColor, currentColor, currentColor];
    }
    else if(ratingCase === "fun"){

      if(ratingOptions === "Not Fun"){
        if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Red;
        else if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else if("Netflix and Chill")
          currentColor = Green    
      }
      else if(ratingOptions === 'Sort Of Fun'){ 
        if( ["Professional Party Time", "Moderate Party Time, Netflix and Chill"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Green;     
      }
      else if(ratingOptions === 'Decent'){
        if( ["Baby Party Time"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Professional Party Time", "Moderate Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Green;
        else
          currentColor = Red       
      }
      else if(ratingOptions === 'Very Fun'){
        if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Green;
        else
        currentColor = Red    
      }
      else{
        if( ["Moderate Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange
        else if( ["Professional Party Time"].includes(currentVibe) )
          currentColor = Green;
        else
          currentColor = Red  
      }
      
      return [currentColor, currentColor, currentColor];

    }
    else if(ratingCase === "difficultyGettingIn"){
      
      if(ratingOptions === "No Problem ")
        currentColor = Green    
      else if(ratingOptions === 'Less than 5-minute wait'){ 
        if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Green;
        else if( ["Baby Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else
          currentColor = Red;       
      }
      else if(ratingOptions === '5 - 15-Minute Wait'){
        if( ["Moderate Party Time", "Social Drinking"].includes(currentVibe) )
          currentColor = Orange;
        else if( "Professional Party Time" === currentVibe )
          currentColor = Green;
        else if( ["Baby Party Time", "Netflix and Chill"].includes(currentVibe) )
          currentColor = Red       
      
      }
      else if(ratingOptions === '15 - 30-Minute Wait'){
        if( ["Baby Party Time", "Netflix and Chill"].includes(currentVibe) )
          currentColor = Green;
        else if( ["Social Drinking", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Orange;
        else if(currentVibe === "Professional Party Time")
          currentVibe = Green  
      }
      else{
        if( [ "Social Drinking","Baby Party Time","Netflix and Chill"].includes(currentVibe) )
          currentColor = Orange
        else if( ["Professional Party Time", "Moderate Party Time"].includes(currentVibe) )
          currentColor = Orange;
      }
      
      return [currentColor, currentColor, currentColor];

    }
    else if(ratingCase === 'genderBreakdown'){
      if(ratingOptions === "Equal Girls and Guys")
        currentColor = Green
      else if(ratingOptions === "More Guys than Girls")
        currentColor = Blue
      else
        currentColor = Pink

      return [currentColor, currentColor, currentColor]       
    }
    else{
      if( ratingOptions === "No Problem")
        currentColor = Green
      else if( ["A Little Slow", "Starting to Get Annoying"].includes(ratingOptions))
        currentColor = Orange
      else
        currentColor = Red    

        return [currentColor, currentColor, currentColor]   
    }
  
  }


  return (
    <View 
      style = {[styles.starComponent, { marginTop:20 }]} 
    >
      <Text style = {styles.heading } >{ props.ratingHeading }</Text> 
      <View
        style = { styles.testing }
      >
        <LinearGradient
          colors={getVibeBaseColor() || ['#eb3498', '#eb3498','#eb3498']}
          style={styles.ratingCircle}
        >
          <Text 
            style={styles.ratingCaseText}
          >
            {getRatingCase(props.ratingCase, props.defaultRating)   }
          </Text> 
        </LinearGradient>
      </View>   
    </View>
  )
}