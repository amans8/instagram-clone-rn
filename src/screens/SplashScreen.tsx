import {Image, StyleSheet, View} from 'react-native';
import React from 'react';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('../assets/insta.png')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: 150,
    height: 150,
  },
});
