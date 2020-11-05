import React from 'react';
import { AsyncStorage, StyleSheet, View, Image, Button} from 'react-native';
import { Header } from 'react-native-elements';

const removeStorageItem = (navigation) => {
  console.log("called remove");
  AsyncStorage.clear().then(async ()=>{
    const userId = await AsyncStorage.getItem('UserId')  
    const token = await AsyncStorage.getItem('Token')
    console.log(`in local storage after deleting  userid: ${userId} and token is ${token}`)
    // navigation.navigate('SplashScreen')
  });
}

class HeaderBar extends React.Component {
	
	constructor(props){
		super(props)
		this.state = {
			show: this.props.show
		}
	}

	componentDidMount(){
	
	}

	render(){
		const {navigation} = this.props;
		return (
			this.state.show	? 
				(	
					<Header
  					placement="left"
  					leftComponent={ <Image style = {{width: 100, height: 27}} source = {{ uri: "https://ultrastreaming.tv/wp-content/uploads/2020/06/logo-1.png"}}/> }
  					rightComponent={ 
							<View style = {{flexDirection : 'row'}}>
								<Button
									onPress={() => navigation.navigate('searchScreen', { name: null })}
									title="Home"
									color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
									style = {{flex: 1}}
								/>
								<Button
									onPress={() => navigation.navigate('ScheduleScreen',  { navigation, showButton: true })}
									title="Schedule"
									color={  Platform.OS === 'ios' ? "#5a99c7"  : 'transparent'  }
									style = {{flex: 1}}
								/>
								<Button
									onPress={() => removeStorageItem(navigation)}
									title="Logout"
									color="#E45217"
									style = {{flex: 1}}
								/>
							</View>
						}
						containerStyle = {{
							backgroundColor: 'black',
							justifyContent: 'space-around'
						}}
					/>
				)	: null
		)
	}
}

const styles = StyleSheet.create({
  imageStyle:{
    width: 200,
    height: 200,
    borderWidth: 1
  },
  nameStyle:{
    fontWeight: 'bold'
  },
  resultStyle:{
    marginLeft: 10,
    marginBottom: 10
  }
}) 

export default HeaderBar;