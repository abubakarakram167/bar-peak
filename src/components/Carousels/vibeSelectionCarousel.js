import * as React from 'react';
import {
  Text, 
  View,
  SafeAreaView } from 'react-native';
  import { ENTRIES1, ENTRIES2 } from './static/entries';
import Carousel from 'react-native-snap-carousel';
import { sliderWidth, itemWidth } from './styles/SliderEntry.style';
import styles, { colors } from './styles/index.style';
import  SliderEntry  from './SliderEntry';
import { scrollInterpolators, animatedStyles } from './utils/animations';
const SLIDER_1_FIRST_ITEM = 1;


export default class App extends React.Component {

    constructor(props){
      super(props);  
    }

    _renderItemWithParallax ({item, index}, parallaxProps) {
      return (
          <SliderEntry
            data={item}
            even={(index + 1) % 2 === 0}
            parallax={true}
            parallaxProps={parallaxProps}
          />
      );
    }
    _renderItem ({item, index}) {
      return <SliderEntry data={item} even={(index + 1) % 2 === 0} />;
    }

    render() {
      const {entries} = this.props;
        return (
          <View style={styles.exampleContainer}>
             <Carousel
                data={entries}
                renderItem={this._renderItem}
                sliderWidth={sliderWidth}
                itemWidth={itemWidth}
                containerCustomStyle={styles.slider}
                contentContainerCustomStyle={styles.sliderContentContainer}
                scrollInterpolator={scrollInterpolators[`scrollInterpolator2`]}
                slideInterpolatedStyle={animatedStyles[`animatedStyles2`]}
                useScrollView={true}
              />
          </View>
        );
    }
}
