import {
  FlatList,
  ListRenderItemInfo,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {User} from './HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import ProfileTitleBar from '../components/ProfileTitleBar';
import TitleBar from '../components/TitleBar';
import {PostsContext} from '../context/PostsContext';
import PostScreen from './PostScreen';
import Post from '../components/Post';
import StoriesComponent from '../components/StoriesComponent';

export interface PostType {
  id: number;
  caption: string;
  images: string[];
  author: string;
  date: string;
}

const ProfilesStack = createNativeStackNavigator();

export default function FeedScreen({navigation}: any) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  return (
    <ProfilesStack.Navigator
      screenOptions={({route}) => {
        return {
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTitle: () =>
            route.name === 'ProfileStack' || route.name === 'FeedPost' ? (
              <ProfileTitleBar
                username={currentUser?.username ? currentUser?.username : ''}
              />
            ) : (
              <TitleBar />
            ),
          headerBackTitleVisible: false,
        };
      }}>
      <ProfilesStack.Screen name="FeedStack">
        {() => (
          <FeedStackScreen
            setCurrentUser={setCurrentUser}
            navigation={navigation}
          />
        )}
      </ProfilesStack.Screen>
      <ProfilesStack.Screen name="ProfileStack" component={ProfileScreen} />
      <ProfilesStack.Screen name="FeedPost" component={PostScreen} />
    </ProfilesStack.Navigator>
  );
}

const Item = ({
  post,
  navigation,
  setCurrentUser,
}: {
  post: PostType;
  navigation: any;
  setCurrentUser: any;
}) => {
  return (
    <Post post={post} navigation={navigation} setCurrentUser={setCurrentUser} />
  );
};

const FeedStackScreen = (props: any) => {
  const {fetchedPosts, setFetchedPosts} = useContext(PostsContext);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const shuffleArray = (array: any) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  };

  const shufflePosts = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      let arrayOfPosts = fetchedPosts;
      shuffleArray(arrayOfPosts);
      setFetchedPosts(arrayOfPosts);
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={shufflePosts}
            tintColor={'white'}
            title="fetching new posts..."
            titleColor={'white'}
          />
        }
        ListHeaderComponent={<StoriesComponent navigation={props.navigation} />}
        style={styles.postsList}
        data={fetchedPosts}
        renderItem={({item}: ListRenderItemInfo<PostType>) => (
          <Item
            post={item}
            navigation={props.navigation}
            setCurrentUser={props.setCurrentUser}
          />
        )}
        keyExtractor={(item: PostType) => item?.id?.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: 'black',
    position: 'relative',
  },
  postsList: {
    flex: 1,
  },
});
