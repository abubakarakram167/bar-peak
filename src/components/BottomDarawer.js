import React from 'react'
import {Text, View, Dimensions, FlatList,ScrollView, SafeAreaView} from 'react-native'
import { Icon } from 'react-native-elements'
import SlidingUpPanel from 'rn-sliding-up-panel'
import Home from './BottomDrawerComponents/Home';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {getfilteredBusiness} from '../../redux/actions/Business';
import Constants from 'expo-constants';

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
    height: 60,
    alignItems: 'center',
    justifyContent: 'start',
    borderBottom: 10,
    borderBottomWidth:1,
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
  }
}

class BottomSheet extends React.Component {

  constructor(props){
    super(props)
    this.state = {
      business: []
    }
  }

  componentDidMount(){
    const { filterBusinesses } = this.props.business.business;
    this.setState({ business: filterBusinesses })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Hello world</Text>
        <SlidingUpPanel
          ref={c => (this._panel = c)}
          draggableRange={{top: height / 1.2, bottom: 120}}
          animatedValue={this._draggedValue}
          showBackdrop={true}>
          {dragHandler => (
            <View style={styles.panel}>
              <View style={styles.dragHandler} {...dragHandler}>
                <View style={styles.panelHeader}>      
                  <Icon
                    name='ios-remove'
                    type = 'ionicon'
                    size = {60}
                  />         
                </View>
              </View>
              <View style = {{flex: 1}} >
                <View style={{padding: 0,height: height * 0.35}}>
                  <Text
                    style = {{ 
                      fontSize: 20,
                      margin: 10,
                      fontWeight: '600'
                    }}
                  >
                    Pricier
                  </Text>
                  <ScrollView        
                    horizontal = {true}
                  >          
                    {
                      this.state.business.map((business)=>{
                        return(
                          <Home 
                            width={width}
                            height= {height}
                            item = {business}
                          />
                        )
                      })
                    }   
                  </ScrollView>
                </View> 
                <View style={{padding: 0, flex: 1}}>
                  <Text
                    style = {{ 
                      fontSize: 20,
                      margin: 10,
                      fontWeight: '600'
                    }}
                  >
                    UnPricier
                  </Text>
                  <ScrollView        
                    horizontal = {true}
                  >          
                    {
                      this.state.business.map((business)=>{
                        return(
                          <Home 
                            width={width}
                            height= {height}
                            item = {business}
                          />
                        )
                      })
                    }   
                  </ScrollView>
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
  const { business } = state
  return { business: business }
};
const mapDispatchToProps = dispatch => (
  bindActionCreators({
    getfilteredBusiness
  }, dispatch)
);

export default connect(mapStateToProps, mapDispatchToProps)(BottomSheet);
