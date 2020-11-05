import React from 'react';
import { Text, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Video } from 'expo-av';
import ResultDetail from "../components/ResultDetail";

class ResultDetailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: this.props.navigation.getParam('id'),
      image: this.props.navigation.getParam('image'),
      streamingUrl: Platform.OS === 'android' ? 'http://64.227.103.158:8081/live/tsn-4/playlist.m3u8': '',
      channelName: this.props.navigation.getParam('channelName'),
      categoryName: this.props.navigation.getParam('categoryName'),
      allChannels: [],
      showVideo: true,
      showImage: true,
      showLoading: true,
      spinner: true,
      useNativeControls: false,
      updateForcingNumber: 0
    };
  }

  componentDidMount(){
    const { navigation } = this.props;
    this.focusListener = navigation.addListener("didBlur", () => {
      this.setState({ showVideo: false })
    });
    this.getChannel();
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }


  handleVideoMount = ref => {
    this.player = ref;
  };

  handleToggleUseNativeControls = () =>
    this.setState({ useNativeControls: !this.state.useNativeControls });

  getChannel(){
   
  }

  getAllSpecificCategoryChannels (){
  
  }

  changeChannelSource(channelId, channelImage, channelName){
    this.setState({ channelId, image: channelImage, channelName })
    let changeStreamUrl = this.state.allChannels.filter((channel)=>{  return channelId === channel.data.ID })[0]

    this.setState({
      streamingUrl: changeStreamUrl.meta.Link[0],
      image: channelImage,
      showImage: true,
      spinner: true
    })
  }

  videoError(error){
    console.log("error")
  }

  onBuffer(buffer){
    console.log("error")
  }

  render() {

    return (
      <ScrollView style = {{ backgroundColor: '#302F2F' }} >
        <View style={{ aspectRatio: 1.3 }}>
        <Text style = {styles.channelName}>{this.state.channelName}</Text>
          {this.state.showVideo && <Video
              rate={1.0}
              volume={1.0}
              resizeMode="cover"
              style={ Platform.OS === 'ios' ? styles.iosVideoPlayer : styles.androidVideoPlayer }
              source={{uri: this.state.streamingUrl}}
              ref={this.handleVideoMount}
              shouldPlay={Platform.OS === 'ios' ?  true :  false}
              onLoad = { ()=>{ this.setState({ showImage: false, spinner: false }) }}
              useNativeControls={true}
              onPlaybackStatusUpdate={this.handlePlaybackStatusUpdate}
            />
          }
          { this.state.spinner && <ActivityIndicator size="large" color="#333331" style = { styles.loaderStyle } /> }
          {this.state.showImage && <Image source={{ uri: this.state.image }} style={Platform.OS === 'ios' ? styles.iosImageStyle : styles.androidImageStyle} />}
        </View>
          <Text style={styles.channelName}>{this.state.categoryName}</Text>
          <View>
            <FlatList
              showsHorizontalScrollIndicator = {false}
              horizontal = {true}
              data= {this.state.allChannels}
              keyExtractor = { (item, index) =>  index.toString()  }
              style = {styles.categoryChannels}
              renderItem = { ({item})=>{
                console.log("the item", item)
                return (
                  <TouchableOpacity onPress = { ()=>{ this.changeChannelSource( item.data.ID, item.image, item.data.post_name )} }>
                    <ResultDetail result = {item} />
                  </TouchableOpacity>
                );
              }}
              />
           </View>

      </ScrollView>
    );
  }
}

export default withNavigation(ResultDetailScreen)

var styles = StyleSheet.create({
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
  iosVideoPlayer: {
    width: '100%',
    height: "80%",
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%'
  },
  androidVideoPlayer: {
    width: '100%',
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '4%'
  },
  channelName: {
    marginLeft: 12,
    marginTop: 30,
    fontWeight: 'bold', color: 'white'
  },
  categoryChannels: {
    marginTop: '4%'
  },
  iosImageStyle:{
    width: '100%',
    height: "80%",
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    top: 55
  },
  androidImageStyle:{
    width: '100%',
    height: "80%",
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    top: 55
  },
  spinnerTextStyle: {
    color: '#808080'
  },
  loaderStyle:{
    position: "absolute",
    top:  '50%',
    left:  '47%',
    zIndex: 3
  },

});
