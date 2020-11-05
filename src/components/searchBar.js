import React from 'react';
import { Text, StyleSheet, View, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';

const SearchBar = ({ term, updateParentText, onSubmitTerm }) => {
  return (
    <View style = {styles.background} >
      <Feather style = { styles.iconStyle } name = "search" size ={25} />
      <TextInput
        value = {term}
        style = {styles.inputStyle}
        placeholder = "Search"
        onChangeText = {(newTerm) => { updateParentText(newTerm) }}
        onEndEditing = {() => { onSubmitTerm() }}
      >
      </TextInput>
    </View>
  );
}

const styles = StyleSheet.create({
  background :{
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: '#F0EEEE',
    height: 50,
    marginHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row'
  },
  inputStyle:{
    flex: 1
  },
  iconStyle:{
    alignSelf: 'center',
    marginHorizontal: 15
  }
});

export default SearchBar;
