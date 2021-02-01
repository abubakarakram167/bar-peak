import React from 'react'
import { View } from 'react-native'
import {submitVibe, getVibe} from '../../redux/actions/Vibe';
import {updateVibe} from '../../redux/actions/Vibe';
import { getAllCategories } from '../../redux/actions/Category';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Style from './css/myVibe';
import _, { map } from 'underscore';
import {getfilteredBusiness, emptyBusiness} from '../../redux/actions/Business';
import ProgressiveBar from "../components/ProgressiveBar/progressStepsBar";
import ShowVibeModal from "../components/showVibeModal";

class MyVibe extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      showVibeModal: true,
      isVibeEmpty: false
    };
 
  }

  async componentDidMount(){ 
    const { vibe } = this.props;
    setTimeout(()=> {
      this.setState({
        showVibeModal: true,
        isVibeEmpty: _.isEmpty(vibe)
      }, ()=> console.log("the stae", this.state))
    }, 500)    
    await this.props.getAllCategories();
  }

  render(){
    const { navigation, vibe } = this.props;
    
    return (
      <View style={Style.screen}>
        <View 
          style = {Style.ProgressiveBar}
        > 
          { (this.state.showVibeModal && !this.state.isVibeEmpty) &&
            (<ShowVibeModal 
              show = {this.state.showVibeModal}
              onClose = {() => { this.setState({ showVibeModal: false }) }}
              navigation = {navigation}
            />)
          } 
          <ProgressiveBar 
            navigation = {navigation} 
          />
        </View>

      </View>
    );
  }

}

const mapStateToProps = (state) => {
  const { vibe, category } = state
  return { 
    vibe: vibe.vibe.vibe, 
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


