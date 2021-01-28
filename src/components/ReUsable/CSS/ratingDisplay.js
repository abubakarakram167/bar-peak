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
    fontSize: 10,
    fontWeight: '600',
    width: '80%', 
    color: 'white',
    textAlign: 'center'
  }
    
})