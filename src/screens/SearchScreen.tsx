import {FlatList, StyleSheet, Text, TextInput, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {User} from './HomeScreen';
import {users} from '../../data/users';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import ProfileTitleBar from '../components/ProfileTitleBar';
import TitleBar from '../components/TitleBar';
import PostScreen from './PostScreen';

const SearchStack = createNativeStackNavigator();

export default function SearchScreen({navigation}: any) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <SearchStack.Navigator
      screenOptions={({route}) => {
        return {
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitle: () =>
            route.name === 'SearchStackProfile' ||
            route.name === 'SearchStackPost' ? (
              <ProfileTitleBar
                username={currentUser?.username ? currentUser?.username : ''}
              />
            ) : (
              <TitleBar />
            ),
          headerBackTitleVisible: false,
        };
      }}>
      <SearchStack.Screen name="SearchStack">
        {() => (
          <SearchStackSearch
            setCurrentUser={setCurrentUser}
            navigation={navigation}
          />
        )}
      </SearchStack.Screen>
      <SearchStack.Screen name="SearchStackProfile" component={ProfileScreen} />
      <SearchStack.Screen name="SearchStackPost" component={PostScreen} />
    </SearchStack.Navigator>
  );
}

const SearchStackSearch = (props: any) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);

  const searchUsers = async () => {
    if (searchText === '') {
      setSearchResults([]);
    } else {
      const userResults = users.filter(u => u.username.includes(searchText));
      setSearchResults(userResults);
    }
  };

  useEffect(() => {
    const search = setTimeout(() => searchUsers(), 1000);
    return () => clearTimeout(search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={searchText}
        onChangeText={setSearchText}
        placeholder='Search "johndoe"'
        placeholderTextColor={'#848484'}
        autoCorrect={false}
        spellCheck={false}
        clearButtonMode="while-editing"
      />
      <FlatList
        style={styles.usersList}
        data={searchResults}
        renderItem={({item}) => (
          <Item
            user={item}
            navigation={props.navigation}
            setCurrentUser={props.setCurrentUser}
          />
        )}
      />
    </View>
  );
};

const Item = ({user, navigation, setCurrentUser}: any) => (
  <Text
    style={styles.user}
    onPress={() => {
      setCurrentUser(user);
      navigation.navigate('SearchStackProfile', {user});
    }}>
    {user?.username}
  </Text>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    backgroundColor: 'black',
  },
  textInput: {
    backgroundColor: '#282828',
    fontSize: 18,
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 15,
  },
  user: {
    color: 'white',
    fontSize: 18,
    marginVertical: 5,
  },
});
