import React, {useContext, useEffect, useState} from 'react';
import {PostsContext} from '../context/PostsContext';
import {PostType} from './FeedScreen';
import Post from '../components/Post';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

export default function PostScreen({route, navigation, isOwnPost}: any) {
  const {fetchedPosts} = useContext(PostsContext);

  const [post, setPost] = useState<PostType | null>(null);

  const fetchPostData = async (postId: string) => {
    const tempPost = fetchedPosts.find((p: any) => p.id === postId);
    if (tempPost) {
      setPost(tempPost);
    }
  };

  useEffect(() => {
    fetchPostData(route.params.postId);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route]);

  return (
    <View
      style={[
        styles.container,
        {justifyContent: !post ? 'center' : 'flex-start'},
      ]}>
      {!post ? (
        <ActivityIndicator size={'small'} />
      ) : (
        <Post post={post} isOwnPost={isOwnPost} navigation={navigation} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: 'black',
  },
});
