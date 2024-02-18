import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {PostType} from '../screens/FeedScreen';
import {PostsContext} from '../context/PostsContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function Profile({route, navigation}: any) {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<PostType[]>([]);

  const {fetchedPosts} = useContext(PostsContext);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const tempPosts = fetchedPosts.filter(
        (p: any) => p.author === route.params?.user?.username,
      );
      setUserPosts(tempPosts);
      setLoading(false);
    };
    //imitate a network request
    setTimeout(() => {
      fetchUserPosts();
    }, 1000);
  }, [route, fetchedPosts]);

  return (
    <View style={styles.container}>
      <View style={styles.picContainer}>
        {route.params?.user?.profilePic ? (
          <Image
            style={styles.profilePic}
            src={route.params?.user?.profilePic}
          />
        ) : (
          <Image
            style={styles.profilePic}
            source={require('../assets/user.jpg')}
          />
        )}
        <View style={styles.statsContainer}>
          <View>
            <Text style={[styles.center, styles.number]}>
              {userPosts.length}
            </Text>
            <Text style={styles.center}>Posts</Text>
          </View>
          <View>
            <Text style={[styles.center, styles.number]}>299</Text>
            <Text style={styles.center}>Followers</Text>
          </View>
          <View>
            <Text style={[styles.center, styles.number]}>399</Text>
            <Text style={styles.center}>Following</Text>
          </View>
        </View>
      </View>

      <Text style={styles.name}>
        {route.params?.user?.name ?? route.params?.user?.username}
      </Text>
      <Text style={styles.bio}>{route.params?.user?.bio}</Text>
      <View style={styles.postsHeader}>
        <Ionicons name="images-sharp" color={'#fff'} size={30} />
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading posts</Text>
          <ActivityIndicator />
        </View>
      ) : userPosts.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>No posts</Text>
        </View>
      ) : (
        <View style={styles.listContainer}>
          <FlatList
            data={userPosts}
            numColumns={3}
            renderItem={({item}: any) => (
              <PostItem item={item} navigation={navigation} route={route} />
            )}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
}

const PostItem = ({item, navigation, route}: any) => {
  return (
    <Pressable
      style={styles.post}
      onPress={() =>
        route.name === 'Profile'
          ? navigation.navigate('PostsPost', {postId: item.id})
          : route.name === 'SearchStackProfile'
          ? navigation.navigate('SearchStackPost', {postId: item.id})
          : navigation.navigate('FeedPost', {postId: item.id})
      }>
      <Image style={styles.postImage} src={item.images[0]} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    backgroundColor: 'black',
  },
  picContainer: {
    flexDirection: 'row',
  },
  statsContainer: {
    width: Dimensions.get('window').width - 150,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginLeft: 15,
  },
  center: {
    textAlign: 'center',
    color: '#fff',
  },
  number: {
    fontSize: 18,
    fontWeight: '500',
  },
  profilePic: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    color: '#fff',
    fontSize: 20,
    marginTop: 15,
    fontWeight: '500',
  },
  bio: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5,
  },
  postsHeader: {
    display: 'flex',
    alignItems: 'center',
    marginTop: 20,
    paddingBottom: 10,
    borderBottomColor: '#fff',
    borderBottomWidth: 1,
    marginBottom: 3,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingText: {
    color: '#e5e5e5',
    fontSize: 16,
    marginRight: 7,
  },
  listContainer: {
    flex: 3, // the number of columns you want to devide the screen into
    marginHorizontal: 'auto',
    width: 400,
  },
  post: {
    flex: 1,
    maxWidth: '33.33%',
    borderColor: '#000',
    borderWidth: 1,
    backgroundColor: '#404040',
    alignItems: 'center',
    aspectRatio: 1,
  },
  postImage: {
    flex: 1,
    width: '100%',
    resizeMode: 'cover',
  },
});
