import React, { useState } from "react";
import { View, Switch, StyleSheet } from "react-native";


const App = (props) => {
  const { isActiveToggle } = props;
  return (
    <View style={styles.container}>
      <Switch
        trackColor={{ false: "#767577", true: "#d2d4d6" }}
        thumbColor={isActiveToggle ? "#1c8dc9" : "#d2d4d6"}
        style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
        ios_backgroundColor="#3e3e3e"
        onValueChange={() => props.onChange( !isActiveToggle )  }
        value={isActiveToggle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;