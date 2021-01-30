import Dialog, { SlideAnimation, DialogContent } from 'react-native-popup-dialog';
import React from 'react';
import { View, Text, Dimensions } from 'react-native';
const { width, height } = Dimensions.get("window");

export default (props) => {

  return (
    <View >
      <Dialog
        visible={props.show}
        dialogAnimation={new SlideAnimation({
          slideFrom: 'bottom',
        })}
        onTouchOutside={() => {
          props.onClose()
        }}
        width = {width * 0.8}
        height = {0.4}
        animationDuration = {500}
      >
        <DialogContent>
          <Text style = {{ fontSize: 25, marginTop: 10 }} >What Below means </Text>
          <Text style = {{ fontSize: 20, marginTop: 30, fontWeight: '600' }} >Venue By Vibe:</Text>
          <Text style = {{ marginTop: 15, color: 'gray' }} >Showing all establishments in our database. </Text>
          <Text style = {{ fontSize: 20, marginTop: 30, fontWeight: '600' }} >All Venues:</Text>
          <Text style = {{ marginTop: 15, color: 'gray' }} >Showing only the establishments that were selected when setting your vibe. Change your vibe for different results on this setting. </Text>
        </DialogContent>
      </Dialog>
    </View>
  )

}
