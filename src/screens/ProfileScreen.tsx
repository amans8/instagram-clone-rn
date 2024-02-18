import React, {useEffect, useState} from 'react';
import Profile from '../components/Profile';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostScreen from './PostScreen';
import ProfileTitleBar from '../components/ProfileTitleBar';
import {User} from './HomeScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {users} from '../../data/users';
import ProfileTitleRight from '../components/ProfileTitleRight';
import CreateScreen from './CreateScreen';

const PostsStack = createNativeStackNavigator();

export default function ProfileScreen({route, navigation}: any) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        const tempUser = users.find(u => u.username === userToken);
        if (tempUser) {
          setUser(tempUser);
        } else {
          setUser({
            username: userToken,
          });
        }
      }
    };
    fetchUserDetails();
  }, []);

  const [parentRoute, setParentRoute] = useState<any>('');

  useEffect(() => {
    setParentRoute(route);
  }, [route]);

  return (
    <PostsStack.Navigator
      screenOptions={({route}) => {
        return {
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitleStyle: {
            color: 'white',
            fontSize: 20,
          },
          headerShown:
            parentRoute.name === 'ProfileStack' ||
            parentRoute.name === 'SearchStackProfile'
              ? false
              : true,
          headerTitleAlign: 'left',
          headerRight: () =>
            route.name === 'PostsProfile' ? (
              <ProfileTitleRight navigation={navigation} />
            ) : null,
          headerTitle: () =>
            route.name === 'PostsProfile' ? (
              <ProfileTitleBar
                username={user?.username ? user?.username : ''}
              />
            ) : (
              <></>
            ),
          headerBackTitleVisible: false,
        };
      }}>
      <PostsStack.Screen name="PostsProfile">
        {() => <Profile route={route} navigation={navigation} />}
      </PostsStack.Screen>
      <PostsStack.Screen name="PostsPost">
        {(props: any) => <PostScreen route={route} {...props} isOwnPost />}
      </PostsStack.Screen>
      <PostsStack.Screen
        options={{headerTitle: 'Modify Post'}}
        name="ModifyPost"
        component={CreateScreen}
      />
    </PostsStack.Navigator>
  );
}
