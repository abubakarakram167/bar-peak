import React from 'react';
import { Text, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import { withNavigation } from 'react-navigation';
import ResultDetail from './ResultDetail';

const ResultList = ({ title, results, navigation }) => {

  return (
    <View>
      <Text style = {styles.titleStyle} >
        {title}
      </Text>
      <FlatList
        showsHorizontalScrollIndicator = {false}
        horizontal = {true}
        data= {results}
        style = {{ marginBottom: 5 }}
        keyExtractor = { (item, index)=> index.toString() }
        renderItem = { ({item})=>{
          return (
            <TouchableOpacity onPress = { ()=>{ navigation.navigate('resultScreenDetail',
             { id: item.id, image: item.image, channelName: item.title, categoryName: item.category_name })}}>
              <ResultDetail result = {item} />
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: 'white',
    marginBottom: 10
  }
});

export default withNavigation(ResultList);
