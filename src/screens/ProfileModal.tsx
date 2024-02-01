import {Button, StyleSheet, View} from 'react-native';
import React, {useContext} from 'react';
import {AuthContext} from '../App';

export default function ProfileModal({navigation}: any) {
  const {signOut} = useContext(AuthContext);

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalTop} onTouchStart={() => navigation.goBack()} />
      <View style={styles.modalBottom}>
        <Button title="Sign out" onPress={() => signOut()} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalTop: {
    flex: 1,
  },
  modalBottom: {
    backgroundColor: '#404040',
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 15,
  },
});
