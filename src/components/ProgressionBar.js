import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Button,
  Alert,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import ProgressBarAnimated from 'react-native-progress-bar-animated';
 
class ProgressionBar extends React.Component {
 
  state = {
    progress: 20,
    progressWithOnComplete: 0,
    progressCustomized: 0,
  }
 
  increase = (key, value) => {
    this.setState({
      [key]: this.state[key] + value,
    });
  }
 
  render() {
    const barWidth = Dimensions.get('screen').width - 30;
    const progressCustomStyles = {
      backgroundColor: 'red', 
      borderRadius: 0,
      borderColor: 'orange',
    };
    console.log("the progression", this.props.progressionBar)
    return (
      

      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonInner}>
            <Text style = {styles.completionText} >
              Completion: { this.props.progressionBar  }%
            </Text>
          </View>
        </View>
        <View>
          <ProgressBarAnimated
            width={barWidth}
            value={this.props.progressionBar}
            backgroundColorOnComplete="#6CC644"
          />
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { user } = state
  return { 
    progressionBar: user.user.progressBar
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    setProgressionBar,
  }, dispatch)
);

export default connect(mapStateToProps, null)(ProgressionBar);
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    marginTop: 50,
    padding: 15,
  },
  completionText:{ 
    textAlign: 'center', 
    fontSize: 18, color: '#2f97d4', 
    fontWeight: '500', marginBottom: 30 
  },
  buttonContainer: {
    marginTop: 15,
  },
  separator: {
    marginVertical: 30,
    borderWidth: 0.5,
    borderColor: '#DCDCDC',
  },
  label: {
    color: '#999',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 10,
  },
});