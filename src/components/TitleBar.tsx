import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

export default function TitleBar() {
  return (
    <View style={styles.headerContainer}>
      <Image style={styles.image} source={require('../assets/instagram.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    width: '100%',
  },
  image: {
    height: 40,
    width: 120,
  },
});
