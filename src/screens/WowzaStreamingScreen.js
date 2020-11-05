import React from 'react';
import {Dimensions, Text, View, StyleSheet, ScrollView, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { withNavigation } from 'react-navigation';
import { Video } from 'expo-av';
import ResultDetail from "../components/ResultDetail";
import CountDown from 'react-native-countdown-component';

var { width, height } = Dimensions.get('window');
class WowzaStreamingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      channelId: this.props.navigation.getParam('channelId'),
      streamingUrl: Platform.OS === 'android' ? 'http://64.227.103.158:8081/live/tsn-4/playlist.m3u8': '',
      allChannels: [],
      showVideo: false,
      showImage: true,
      showLoading: true,
      spinner: true,
      matchStartingMinutes: this.props.navigation.getParam('matchStartingTimeMinutes') - 30,
      useNativeControls: false,
      updateForcingNumber: 0,
      showOverlay: false,
      showCountdown: false,
      shouldPlay: false
    };
  }

  componentDidMount(){
   this.getChannel();
   this.getcheckMatchStart();
  }

  getcheckMatchStart(){
    console.log("minutes", this.state.matchStartingMinutes)
    if (this.state.matchStartingMinutes > 0)
      this.setState({ showCountdown: true, showOverlay: true })

    else
      this.setState({ shouldPlay: true, showCountdown: false, showOverlay: false })
  }

  getChannel(){
    yelp.get(`https://ultrastreaming.tv/wp-json/c/s/${this.state.channelId}`).
    then((channelInfo)=>{
      this.setState({ streamingUrl: channelInfo.data.meta.mobile_link[0],
                      image: channelInfo.data.image,
                      channelName: channelInfo.data.data.post_title
                    });
      this.getAllSpecificCategoryChannels();
    }).catch(err => console.log("the errorsss", err))
  }

  handleVideoMount = ref => {
    this.player = ref;
  };

  handleToggleUseNativeControls = () =>
    this.setState({ useNativeControls: !this.state.useNativeControls });

  getAllSpecificCategoryChannels (){
    yelp.get(`https://ultrastreaming.tv/wp-json/c/c/201`)
    .then((allChannelsData)=>{
      this.setState({ allChannels: allChannelsData.data })
    })
  }

  changeChannelSource(channelId, channelImage, channelName){
    this.setState({ channelId, image: channelImage, channelName })
    let changeStreamUrl = this.state.allChannels.filter((channel)=>{  return channelId === channel.data.ID })[0]

    this.setState({
      streamingUrl: changeStreamUrl.meta.Link[0],
      image: channelImage,
      showImage: true,
      spinner: true,
      showCountdown: false,
      showOverlay: false
    })
  }

  getChannelName(name){
    return name.toLowerCase().replace("wowza", "")
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
        { this.state.showOverlay && (
          <View  style={[styles.overlay, { height: '100%'}]} >
            <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
            {
              this.state.showCountdown &&
              (<CountDown
                until={ this.state.matchStartingMinutes * 60 }
                onFinish={() => {this.setState({ showCountdown: false, showOverlay: false, shouldPlay: true })}}
                onPress={() => alert('You must wait until time complete.Thank you')}
                size={20}
              
              />)
            }     
            </View>
          </View>  
          
          )  
        }
          { this.state.channelName && <Text style = {styles.channelName}>{this.getChannelName(this.state.channelName)}</Text>}
            <Video
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
            { this.state.spinner && <ActivityIndicator size="large" color="#333331" style = { styles.loaderStyle } /> }
            { this.state.showImage && <Image source = {{ uri: this.state.image }} style = { Platform.OS === 'ios' ? styles.iosImageStyle : styles.androidImageStyle } /> }
            </View>
          <View>
            <Text style={styles.channelName}>SkySports</Text>
            <FlatList
              showsHorizontalScrollIndicator = {false}
              horizontal = {true}
              data= {this.state.allChannels}
              keyExtractor = { (item, index)=> { return index.toString() }}
              style = {styles.categoryChannels}
              renderItem = { ({item})=>{
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

export default withNavigation(WowzaStreamingScreen)

var styles = StyleSheet.create({

  countDown: {
    position: 'absolute',
    top: '50%',
    left: '24%',
    zIndex: 5
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.8,
    backgroundColor: 'black',
    width: width,
    zIndex: 4
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 1
  },
  channelName: {
    marginLeft: 12,
    marginTop: 30,
    fontWeight: 'bold',
    color: 'white'
  },
  categoryChannels: {
    marginTop: 20
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
