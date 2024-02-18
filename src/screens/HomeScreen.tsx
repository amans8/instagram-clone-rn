import React, {useEffect, useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FeedScreen from './FeedScreen';
import SearchScreen from './SearchScreen';
import CreateScreen from './CreateScreen';
import ProfileScreen from './ProfileScreen';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {Image, StyleSheet} from 'react-native';
import {users} from '../../data/users';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TitleBar from '../components/TitleBar';

export interface User {
  username: string;
  profilePic?: string;
  name?: string;
}

export default function HomeScreen({navigation}: any) {
  const Tab = createBottomTabNavigator();

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

  return (
    <Tab.Navigator
      screenOptions={({route}) => {
        return {
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: '#000',
            paddingTop: 15,
          },
          headerStyle: {
            backgroundColor: '#000',
          },
          headerShadowVisible: false,
          headerShown:
            route.name === 'Feed' ||
            route.name === 'Search' ||
            route.name === 'Profile'
              ? false
              : true,
          headerTitle: () => <TitleBar />,
          headerTitleAlign: 'left',
        };
      }}>
      <Tab.Screen
        name="Feed"
        component={FeedScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons name="home" size={30} color={'#fff'} />
            ) : (
              <Ionicons name="home-outline" size={30} color={'#fff'} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarIcon: ({focused}) => {
            return focused ? (
              <Ionicons name="search" size={30} color={'#fff'} />
            ) : (
              <Ionicons name="search-outline" size={30} color={'#fff'} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Create"
        component={CreateScreen}
        listeners={() => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Create');
          },
        })}
        options={{
          tabBarIcon: () => {
            return (
              <Ionicons name="add-circle-outline" size={30} color={'#fff'} />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        listeners={() => ({
          tabPress: e => {
            e.preventDefault();
            navigation.navigate('Profile', {user});
          },
        })}
        options={{
          tabBarIcon: ({focused}: any) => {
            return user?.profilePic ? (
              <Image
                src={user?.profilePic}
                style={[styles.userImage, {borderWidth: focused ? 2 : 0}]}
              />
            ) : (
              <Image
                style={[styles.userImage, {borderWidth: focused ? 2 : 0}]}
                source={require('../assets/user.jpg')}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  userImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderColor: '#fff',
  },
});
