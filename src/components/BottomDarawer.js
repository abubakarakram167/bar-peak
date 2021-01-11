import React from 'react'
import {Text, View, Dimensions} from 'react-native'
import { Icon } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getfilteredBusiness} from '../../redux/actions/Business';
import Constants from 'expo-constants';
import _, { map } from 'underscore';

const { height, width } = Dimensions.get('window')

const styles = {
  container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    width: width
  },
  panel: {
    flex: 1,
    backgroundColor: 'white',
    position: 'relative',
    height: '100%'
  },
  panelHeader: {
    alignItems: 'center',
    justifyContent: 'start',
    borderBottom: 1,
    borderBottomWidth:0.3,
    width: '100%'
  },
  favoriteIcon: {
    position: 'absolute',
    top: -24,
    right: 24,
    backgroundColor: '#2b8a3e',
    width: 48,
    height: 48,
    padding: 8,
    borderRadius: 24,
    zIndex: 1
  },
  newContainer: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginSignUpHeading: {
    marginBottom: 20,
    fontSize: 16,
    color: 'black',
    fontWeight: "700"
  }
}

class BottomSheet extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      business: [],
      selectedItem: {},
      selectedBusiness: {}
    }
  }

  componentDidMount(){
    const { filterBusinesses } = this.props.business.business;
    this.setState({ business: filterBusinesses })
  }

  selectSpecificBusiness = (item) => {
    const { businesses } = this.props.business.business;
    const selectedBusiness = businesses.filter( (business) => business.placeId === item.place_id )[0]
    this.setState({ selectedItem: item, showProfileModal: true, selectedBusiness });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world</Text>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.2, bottom: 620}}
          animatedValue={this._draggedValue}
          showBackdrop={true}>
          {dragHandler => (
            <View style={styles.panel}>
              <View style={styles.dragHandler} {...dragHandler}>
                <View style={styles.panelHeader}>      
                  <Icon
                    name='ios-remove'
                    type = 'ionicon'
                    size = {70}
                    color = 'gray'
                    style = {{ width: 60, height: 60 }}
                  />
                  <Text style = { styles.loginSignUpHeading } >Log in or sign up</Text>         
                </View>
              </View>    
            </View> 
          )}
        </SlidingUpPanel>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const { business, vibe } = state
  return { 
    business: business, 
    vibe
  }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheet);
