import React from 'react'
import { Text, View, Button, Dimensions, ActivityIndicator, TouchableOpacity, Image, ScrollView } from 'react-native'
import {submitVibe} from '../../redux/actions/Vibe';
import {updateVibe} from '../../redux/actions/Vibe';
import { getAllCategories } from '../../redux/actions/Category';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Style from './css/myVibe';
import _, { map } from 'underscore';
import {getfilteredBusiness, emptyBusiness} from '../../redux/actions/Business';
import ProgressiveBar from "../components/ProgressiveBar/progressStepsBar";

class MyVibe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      
    };
 
  }

  async componentDidMount(){     
    await this.props.getAllCategories();
  }

  render(){
    const { navigation } = this.props;
    return (
      <View style={Style.screen}>
        <View 
          style = {Style.ProgressiveBar}
        >
          <ProgressiveBar navigation = {navigation} />
        </View>

      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const { vibe, category } = state
  return { 
    vibe: vibe, 
    category 
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    submitVibe,
    updateVibe,
    getAllCategories,
    getfilteredBusiness,
    emptyBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(MyVibe);


