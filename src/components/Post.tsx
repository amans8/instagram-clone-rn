import {
  ActivityIndicator,
  Button,
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {users} from '../../data/users';
import {User} from '../screens/HomeScreen';
import AntDesign from 'react-native-vector-icons/AntDesign';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import {PostsContext} from '../context/PostsContext';

export default function Post({
  post,
  navigation,
  setCurrentUser,
  isOwnPost,
}: any) {
  const [postUserData, setPostUserData] = useState<User | null>(null);

  const {fetchedPosts, setFetchedPosts} = useContext(PostsContext);

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

  const [height, setHeight] = useState(0);
  const [fullCaption, showFullCaption] = useState(false);

  useEffect(() => {
    const originalHeight: number = post.images[0].includes(
      'react-native-image-crop-picker',
    )
      ? 500
      : Number(post.images[0].split('id/')[1].split('/')[2]);
    const originalWidth: number = post.images[0].includes(
      'react-native-image-crop-picker',
    )
      ? 500
      : Number(post.images[0].split('id/')[1].split('/')[1]);
    const tempHeight =
      (Dimensions.get('window').width / originalWidth) * originalHeight;
    setHeight(tempHeight);
  }, [post]);

  const convertDateFormat = (inputDate: string) => {
    const dateArray = inputDate.split('-');

    const day = parseInt(dateArray[0], 10); // Convert day to integer
    const monthIndex = parseInt(dateArray[1], 10) - 1; // Convert month to zero-based index
    const year = parseInt(dateArray[2], 10);

    const dateObject = new Date(year, monthIndex, day);

    const formattedDate = `${day} ${dateObject.toLocaleString('default', {
      month: 'long',
    })} ${year}`;

    return formattedDate;
  };

  const [currentPage, setCurrentPage] = useState(0);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.floor(offsetX / Dimensions.get('window').width);
    setCurrentPage(page);
  };

  const toggleLike = () => {
    const postIndex = fetchedPosts.findIndex((p: any) => p.id === post.id);
    const tempPosts = [...fetchedPosts];
    if (post.liked) {
      tempPosts[postIndex].liked = false;
    } else {
      tempPosts[postIndex].liked = true;
    }
    setFetchedPosts(tempPosts);
  };

  return (
    <View>
      <Pressable
        style={styles.postHeader}
        onPress={() => {
          if (navigation && !isOwnPost) {
            setCurrentUser && setCurrentUser(postUserData);
            navigation.navigate('ProfileStack', {user: postUserData});
          }
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
        {isOwnPost && (
          <Button
            onPress={() => {
              navigation.navigate('ModifyPost', {post});
            }}
            title={'Edit'}
          />
        )}
      </Pressable>
      <View style={[styles.imageContainer, {height: height ?? 300}]}>
        <ActivityIndicator
          size="large"
          style={[styles.loader, {top: height / 2 - 15}]}
        />
        {post.images.length === 1 ? (
          <Pressable
            onPress={() => {
              if (navigation && !isOwnPost) {
                setCurrentUser && setCurrentUser(postUserData);
                navigation.navigate('FeedPost', {postId: post.id});
              }
            }}>
            <Image
              style={[styles.image, {height: height ?? 300}]}
              src={post.images[0]}
            />
          </Pressable>
        ) : (
          <View>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              scrollEventThrottle={16}>
              {post.images.map((image: string, index: number) => (
                <Image
                  src={image}
                  style={[styles.image, {height: height ?? 300}]}
                  key={index}
                />
              ))}
            </ScrollView>
            <View style={styles.pagination}>
              {post.images.map((_: any, index: number) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    {opacity: index === currentPage ? 1 : 0.5},
                  ]}
                />
              ))}
            </View>
          </View>
        )}
      </View>
      <View style={styles.actionsContainer}>
        {post?.liked ? (
          <Pressable style={styles.action} onPress={toggleLike}>
            <AntDesign name="heart" size={30} color={'red'} />
          </Pressable>
        ) : (
          <Pressable style={styles.action} onPress={toggleLike}>
            <AntDesign name="hearto" size={30} color={'#fff'} />
          </Pressable>
        )}
        <EvilIcons
          style={styles.action}
          name="comment"
          size={40}
          color={'#fff'}
        />
        {/* <Feather style={styles.action} name="send" size={30} color={'#fff'} /> */}
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
}

const styles = StyleSheet.create({
  postHeader: {
    backgroundColor: 'black',
    height: 70,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
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
    marginRight: 'auto',
  },
  imageContainer: {
    backgroundColor: 'lightgray',
    width: Dimensions.get('window').width,
    position: 'relative',
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 12,
    alignSelf: 'center',
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: 'white',
  },
  loader: {
    position: 'absolute',
    right: Dimensions.get('window').width / 2 - 15,
  },
  image: {
    width: Dimensions.get('window').width,
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
  actionsContainer: {
    paddingTop: 15,
    paddingHorizontal: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  action: {
    marginRight: 10,
  },
});
