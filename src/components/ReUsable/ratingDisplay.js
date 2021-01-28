import React from 'react'                                       
import { Text, View } from 'react-native';
import styles from './CSS/ratingDisplay';
import { LinearGradient } from 'expo-linear-gradient';



export default (props) => {


  const getOriginalOrDefaultRating = (defaultRating, originalRating) => {
    console.log(`default rating ${defaultRating} and original rating: ${ originalRating } `)
    const { businessData } = props;
    const { noOfUsersUntilShowDefault: defaultRatingUsers , isRunning} = props;
    if(businessData.totalUserCountRating >= defaultRatingUsers && isRunning )
      return defaultRating
    return originalRating;  
  }

  const getRatingCase = (ratingCase, value) => {
    console.log(`the rating case ${ratingCase} and value is ${value}`)
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


  return (
    <View 
      style = {[styles.starComponent, { marginTop:20 }]} 
    >
      <Text style = {styles.heading } >{ props.ratingHeading }</Text>   
      <LinearGradient
        colors={['#1dbf73', '#1dbf73', '#1db333']}
        style={styles.ratingCircle}
      >
        <Text 
          style={styles.ratingCaseText}
        >
          {getRatingCase(props.ratingCase, getOriginalOrDefaultRating(props.defaultRating, props.rating))   }
        </Text> 
      </LinearGradient>
    </View>
  )
}