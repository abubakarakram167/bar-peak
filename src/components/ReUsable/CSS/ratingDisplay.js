import { StyleSheet } from 'react-native';


export default StyleSheet.create({
  ratingCircle:{
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'black',
    borderStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'center'
  },
  testing: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 3,  
    elevation: 5
  },
  starComponent: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15
  },
  heading: {
    textAlign: 'left',
    width: '35%',
    fontSize: 16,
    fontWeight: '500',
    flex: 2
  },
  ratingCaseText: { 
    lineHeight: 13, 
    fontSize: 11.5,
    fontWeight: '500',
    width: '80%', 
    color: 'white',
    textAlign: 'center',
    textShadowColor: '#474747',
    textShadowOffset: {width: 2, height: 1},
    textShadowRadius: 2
  }
    
})