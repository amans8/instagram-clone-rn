/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {createContext, useEffect, useMemo, useReducer} from 'react';
import LoginScreen from './screens/LoginScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CreateScreen from './screens/CreateScreen';
import ProfileModal from './screens/ProfileModal';

export const AuthContext = createContext<{
  signIn: (data: {username: string}) => void;
  signOut: () => void;
}>({
  signIn: () => {},
  signOut: () => {},
});

const HomeStack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const [state, dispatch] = useReducer(
    (prevState: any, action: {type: string; token?: null | string}) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'TOKEN_NOT_FOUND':
          return {
            isLoading: false,
            IsSignout: false,
            userToken: null,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  useEffect(() => {
    const bootstrapAsync = async () => {
      let userToken;
      try {
        userToken = await AsyncStorage.getItem('userToken');
      } catch (e) {
        // Restoring token failed
      }
      if (userToken !== null) {
        dispatch({type: 'RESTORE_TOKEN', token: userToken});
      } else {
        dispatch({type: 'TOKEN_NOT_FOUND'});
      }
    };
    // timeout to mimic a long running process
    setTimeout(() => bootstrapAsync(), 1000);
  }, []);

  const authContext = useMemo(
    () => ({
      signIn: async (data: {username: string}) => {
        await AsyncStorage.setItem('userToken', data.username);
        dispatch({type: 'SIGN_IN', token: data.username});
      },
      signOut: async () => {
        await AsyncStorage.removeItem('userToken');
        dispatch({type: 'SIGN_OUT'});
      },
    }),
    [],
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <HomeStack.Navigator>
          {state.isLoading ? (
            <HomeStack.Screen
              name="Splash"
              component={SplashScreen}
              options={{headerShown: false}}
            />
          ) : state.userToken == null ? (
            <HomeStack.Screen
              name="Login"
              component={LoginScreen}
              options={{
                title: 'Sign in',
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
                headerShown: false,
              }}
            />
          ) : (
            <>
              <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                  headerShown: false,
                }}
              />
              <HomeStack.Screen
                name="Create"
                component={CreateScreen}
                options={{
                  animation: 'slide_from_right',
                }}
              />
              <HomeStack.Group
                screenOptions={{presentation: 'transparentModal'}}>
                <HomeStack.Screen
                  name="ProfileModal"
                  component={ProfileModal}
                  options={{
                    headerShown: false,
                  }}
                />
              </HomeStack.Group>
            </>
          )}
        </HomeStack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;
