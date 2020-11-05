import React from 'react';
import { Text, StyleSheet, View, Image } from 'react-native';

const ResultDetail = ({ result }) => {  
  // console.log("the image url", result["image"]);
  return (  
    <View style = { styles.resultStyle }>
      <Image source = {{uri: result.image}} style = {styles.imageStyle} />
      {/* <Text style = {styles.nameStyle} >
        { result.name }
      </Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle:{
    width: 200,
    height: 200,
    borderWidth: 1
  },
  nameStyle:{
    fontWeight: 'bold'
  },
  resultStyle:{
    marginLeft: 10,
    marginBottom: 10
  }
}) 

export default ResultDetail;