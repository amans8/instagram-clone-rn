import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {posts} from '../../data/posts';
import {Post} from './FeedScreen';

export default function ProfileScreen({route}: any) {
  const [loading, setLoading] = useState(true);
  const [userPosts, setUserPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      const tempPosts = posts.filter(
        p => p.author === route.params?.user?.username,
      );
      setUserPosts(tempPosts);
      setLoading(false);
    };
    //imitate a network request
    setTimeout(() => {
      fetchUserPosts();
    }, 1000);
  }, [route]);

  return (
    <View style={styles.container}>
      {route.params?.user?.profilePic ? (
        <Image style={styles.profilePic} src={route.params?.user?.profilePic} />
      ) : (
        <Image
          style={styles.profilePic}
          source={require('../assets/user.jpg')}
        />
      )}
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
            renderItem={PostItem}
            keyExtractor={item => item.id.toString()}
          />
        </View>
      )}
    </View>
  );
}

const PostItem = ({item}: any) => (
  <View style={styles.post}>
    <Image style={styles.postImage} src={item.images[0]} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingBottom: 0,
    backgroundColor: 'black',
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
