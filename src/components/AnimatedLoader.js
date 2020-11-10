import React from 'react';
import { StyleSheet } from 'react-native';
import AnimatedLoader from "react-native-animated-loader";

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        visible: !this.state.visible
      });
    }, 2000);
  }

  render() {
    const { visible } = this.state;
    return (
      <AnimatedLoader
        visible={this.state.visible}
        overlayColor="rgba(255,255,255,0.75)"
        source={{ uri: "https://assets5.lottiefiles.com/private_files/lf30_5af5pwcg.json" }}
        animationStyle={styles.lottie}
        speed={1}
      />
    );
  }
}

const styles = StyleSheet.create({
  lottie: {
    width: 100,
    height: 100
  }
});