import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {posts} from '../../data/posts';
import {users} from '../../data/users';
import {User} from './HomeScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import ProfileScreen from './ProfileScreen';
import ProfileTitleBar from '../components/ProfileTitleBar';
import TitleBar from '../components/TitleBar';

export interface Post {
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
            route.name === 'ProfileStack' ? (
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
    </ProfilesStack.Navigator>
  );
}

const Item = ({
  post,
  navigation,
  setCurrentUser,
}: {
  post: Post;
  navigation: any;
  setCurrentUser: any;
}) => {
  const [height, setHeight] = useState(0);
  const [fullCaption, showFullCaption] = useState(false);
  const [postUserData, setPostUserData] = useState<User | null>(null);

  useEffect(() => {
    const originalHeight: number = Number(
      post.images[0].split('id/')[1].split('/')[2],
    );
    const originalWidth: number = Number(
      post.images[0].split('id/')[1].split('/')[1],
    );
    const tempHeight =
      (Dimensions.get('window').width / originalWidth) * originalHeight;
    setHeight(tempHeight);
  }, [post]);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = users.find(u => u.username === post.author);
      if (user) {
        setPostUserData(user);
      } else {
        setPostUserData({
          username: post.author,
        });
      }
    };
    fetchUserData();
  }, [post]);

  const convertDateFormat = (inputDate: string) => {
    const dateArray = inputDate.split('-');

    const dateObject = new Date(
      `${dateArray[0]}-${dateArray[1]}-${dateArray[2]}`,
    );

    const day = dateObject.getDate();
    const month = dateObject.toLocaleString('default', {month: 'long'});
    const year = dateObject.getFullYear();

    const result = `${day} ${month} ${year}`;

    return result;
  };

  return (
    <View>
      <Pressable
        style={styles.postHeader}
        onPress={() => {
          setCurrentUser(postUserData);
          navigation.navigate('ProfileStack', {user: postUserData});
        }}>
        {postUserData?.profilePic ? (
          <Image style={styles.postProfilePic} src={postUserData?.profilePic} />
        ) : (
          <Image
            style={styles.postProfilePic}
            source={require('../assets/user.jpg')}
          />
        )}
        <Text style={styles.postUsername}>{post.author}</Text>
      </Pressable>
      <View style={[styles.imageContainer, {height: height ?? 300}]}>
        <ActivityIndicator
          size="large"
          style={[styles.loader, {top: height / 2 - 15}]}
        />
        <Image
          style={[styles.image, {height: height ?? 300}]}
          src={post.images[0]}
        />
      </View>
      <View style={styles.content}>
        <Text>
          <Text style={[styles.postUsername]}>{post.author}</Text>
          {'  '}
          <Text
            style={styles.caption}
            onPress={() => showFullCaption(!fullCaption)}>
            {post.caption.length < 40
              ? post.caption
              : fullCaption
              ? post.caption
              : post.caption.slice(0, 40) + '...'}
          </Text>
        </Text>
        <Text style={styles.date}>{convertDateFormat(post.date)}</Text>
      </View>
    </View>
  );
};

const FeedStackScreen = (props: any) => {
  return (
    <FlatList
      style={styles.postsList}
      data={posts}
      renderItem={({item}: ListRenderItemInfo<Post>) => (
        <Item
          post={item}
          navigation={props.navigation}
          setCurrentUser={props.setCurrentUser}
        />
      )}
      keyExtractor={(item: Post) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  postsList: {
    flex: 1,
  },
  postHeader: {
    backgroundColor: 'black',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
  },
  postProfilePic: {
    width: 40,
    height: 40,
    alignSelf: 'center',
    marginLeft: 15,
    borderRadius: 20,
    marginRight: 15,
  },
  postUsername: {
    color: 'white',
    alignSelf: 'center',
    fontSize: 18,
    fontWeight: '500',
  },
  imageContainer: {
    backgroundColor: 'lightgray',
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  loader: {
    position: 'absolute',
    right: Dimensions.get('window').width / 2 - 15,
  },
  image: {
    objectFit: 'cover',
  },
  content: {
    backgroundColor: 'black',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  caption: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
  },
  date: {
    marginTop: 4,
    color: '#e5e5e5',
    fontSize: 14,
    lineHeight: 22,
  },
});
