import { StyleSheet, Dimensions} from 'react-native';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 3;
const CARD_WIDTH = CARD_HEIGHT + 50;

export default StyleSheet.create({
  heartIcon:{ 
    flex:1,
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 5,
    top: 5 
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  setVibeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '800' 
  },
  setVibeButton: {
    backgroundColor: '#1b76de',
    padding: 10,
    paddingTop: 10,
    paddingBottom: 10,
    width: 70,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#043c7d'
  },
  searchBarInput:{ 
    flex: 6, 
    fontWeight: '700',
    color: 'black', 
    backgroundColor: 'white', 
    textAlign: 'left', 
    height: '80%'
  },
  viewButtons: {
    backgroundColor: 'white',
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    paddingRight: 2,
    paddingLeft: 2 
  },
  activeViewButtons: {
    backgroundColor: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 2,
    paddingRight: 2,
    paddingLeft: 2 
  },
  activeCategoryButtonTextColor: {
    color: 'white',
    textAlign:'center',
    fontSize: 10,
    fontWeight: '900'
  },
  searchBar:{
    flexDirection: 'row', 
    padding: 10,
    backgroundColor: 'white',
    marginHorizontal: '10%',
    shadowOffset: { width: 0, height: 0 },
    shadowColor: 'black',
    shadowOpacity: 0.2,
    elevation: 1,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    width: '80%',
    borderRadius: 20,
    borderWidth: 1
  },
  categoryButtons: {
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    marginLeft: 5 ,
    borderRadius: 8,
    borderColor: 'lightgray',
    backgroundColor: "black"
  }, 
  nonActiveCategory: {
    paddingTop: 5,
    paddingBottom: 5,
    borderWidth: 2,
    marginLeft: 5 ,
    borderRadius: 8,
    borderColor: 'lightgray'
  },
  categoryButtonTextColor: {
    color: 'black',
    textAlign:'center',
    fontSize: 10,
    fontWeight: '500'
  },
  activeButtonTextColor: {
    color: 'white',
    textAlign:'center',
    fontSize: 13,
    fontWeight: '800'
  },
  buttonTextColor: {
    color: 'black',
    textAlign:'center',
    fontSize: 11,
    fontWeight: '800'
  },
  mapStyle: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.70,
  },
  scrollView: {
    position: "absolute",
    bottom: '6%',
    left: 0,
    right: 0,
    paddingVertical: 10,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 0,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    marginBottom: 30,
    borderRadius: 10,
    borderWidth: 0.3
  },
  cardImage: {
    flex: 1,
    width: "100%",
    height: "50%",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  }
});
