import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

class Category extends Component {
    render() {
        return (
            <View style={[styles.categoryItem, { width: this.props.width * 0.65, height: this.props.height * 0.32 }]}>
              <View style = {{ paddingHorizontal: 0 }}>
                  <Image 
                    source={ { uri: this.props.imageUri }}
                    style = {[styles.categoryImage, {width: this.props.width *0.65, height: this.props.height * 0.25 }]}
                  />
              </View>
              <View style={{ paddingLeft: 0, paddingTop: 10 }}>
                  <Text style = {{ fontWeight:'700' }} >{this.props.name}</Text>
              </View>
            </View>
        );
    }
}
export default Category;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center'
    },
    categoryItem: { 
      marginLeft: 10, 
      borderColor: '#dddddd'
    },
    categoryImage: { 
      resizeMode: 'cover',
      borderRadius:8,
      borderWidth:1 
    }
});