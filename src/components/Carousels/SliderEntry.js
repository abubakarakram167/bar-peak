import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from './styles/SliderEntry.style';

export default class SliderEntry extends Component {

    static propTypes = {
        data: PropTypes.object.isRequired,
        even: PropTypes.bool,
        parallax: PropTypes.bool,
        parallaxProps: PropTypes.object
    };

    get image () {
        const { data: { illustration }, parallax, parallaxProps, even } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer,styles.imageContainerEven ]}
              style={styles.image}
              parallaxFactor={0.35}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { data: { title, subtitle}, even } = this.props;

        const uppercaseTitle = title ? (
            <Text
              style={[styles.title, styles.titleEven ]}
              numberOfLines={2}
            >
                { title.toUpperCase() }
            </Text>
        ) : false;

        return (
          <View
          >
            <Text style = {{ color: 'white', textAlign: "center", fontSize: 25 }} >{title}</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.slideInnerContainer}
              onPress={() => { alert(`You've clicked '${title}'`); }}
              >
                <View style={styles.shadow} />
                <View style={[styles.imageContainer, styles.imageContainerEven ]}>
                    { this.image }
                    <View style={[styles.radiusMask,styles.radiusMaskEven]} />
                </View>
                <View style={{ position: "absolute", top: "80%", left: "45%" }}>
                  <TouchableOpacity
                    style = {{ backgroundColor: "#5a5c5c", padding: 10, borderRadius: 20 }} 
                  >
                    <Text
                      style={{ color: "white", fontSize: 15, fontWeight: "600" }}
                      numberOfLines={2}
                    >
                        Choose
                    </Text>
                  </TouchableOpacity>
                </View>
            </TouchableOpacity>
          </View>  
        );
    }
}