import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileTitleRight({navigation}: any) {
  return (
    <View>
      <Pressable onPress={() => navigation.navigate('ProfileModal')}>
        <Ionicons
          style={styles.icon}
          name="reorder-three"
          size={30}
          color={'#fff'}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
  },
  icon: {
    marginRight: 20,
  },
});
