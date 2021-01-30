import { StyleSheet , Dimensions} from 'react-native';
const { width, height } = Dimensions.get("window");

export default StyleSheet.create({
  setVibeButton: { 
    backgroundColor: 'black',
    justifyContent: 'center',
    padding: 8,
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    borderRadius: 10 
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: '#d6d6d6'
  },
  modalMessage: {
    textAlign: 'center',
    fontWeight: "500",
    fontSize: 18
  },
  timeText: {
    fontSize: 15,
    fontWeight: "500"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: "#000",
    width: width * 0.9,
    height: height * 0.3,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 28
  },
  rateButtonStyling: { 
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: '700',
    paddingTop: 15, 
    paddingBottom: 15 
  },
  sliderImageIcons:{ 
    borderWidth: 1,
    backgroundColor: 'white',
    borderRadius: 20,
    padding:3,
    paddingLeft: 5,
    paddingRight: 5 
  },
  ratingText: { 
    textAlign: 'center', 
    width: '30%',
    fontSize: 18,
    fontWeight: '600' 
  },
  heartIcon:{ 
    flex:1,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    top: "3%",
    right: "3%" 
  },
  surveyHeading: { 
    fontSize: 18,
    textAlign: 'center',
    fontWeight: "400",
    color: 'black',
    paddingLeft:10,
    paddingRight:10,
    marginTop: 30 
  },
  ratingLabel: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '600',
    color: 'white'
  },
  ratingButtonToggle: {  
    padding: 10, 
    paddingTop: 5,
    paddingBottom: 5,
    maxWidth: 150,
    minWidth: 150,
    minHeight: 40,
    textAlign: 'center',
    borderRadius: 4,
    borderWidth:0,
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingComponent: {
    flex:1,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center' 
  },
  rateModal: {
    flex:3,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20
  },
  heading: {
    textAlign: 'left',
    width: '35%',
    fontSize: 14,
    fontWeight: '500'
  },
  starComponent: {
    flex:1,
    width: '100%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 15
  },
  back: {
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    zIndex: 0
},
front: {
    position: 'absolute',
    top:25,
    left:25,
    width: 50,
    height:50,
    backgroundColor: 'red',
    zIndex: 1
}
});