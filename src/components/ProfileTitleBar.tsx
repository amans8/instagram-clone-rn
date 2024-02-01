import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

export default function ProfileTitleBar({username}: {username: string}) {
  return (
    <View>
      <Text style={styles.title}>{username}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
