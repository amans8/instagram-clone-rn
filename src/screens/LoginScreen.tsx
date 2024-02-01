import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext} from '../App';

export default function LoginScreen() {
  const [username, setUsername] = useState<string>('');

  const {signIn} = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={require('../assets/instagram.png')}
        />
      </View>
      <TextInput
        style={styles.textInput}
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        placeholderTextColor={'#848484'}
        autoCorrect={false}
        spellCheck={false}
      />
      <Pressable
        style={[
          styles.loginButton,
          username.length === 0 && styles.loginButtonDisabled,
        ]}
        disabled={username.length === 0}
        onPress={() => signIn({username})}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  imageContainer: {
    height: 70,
    width: '100%',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
  textInput: {
    backgroundColor: '#121212',
    borderWidth: 2,
    borderColor: '#1b1b1b',
    borderRadius: 7,
    width: '100%',
    marginTop: 40,
    height: 50,
    padding: 15,
    fontSize: 16,
    color: 'white',
  },
  loginButton: {
    marginTop: 20,
    backgroundColor: '#4192ef',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    color: 'white',
    borderRadius: 7,
  },
  loginButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
