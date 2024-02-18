import {FlatList, Image, Pressable, StyleSheet, Text} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {users} from '../../data/users';
import {StoriesContext} from '../context/StoriesContext';
import LinearGradient from 'react-native-linear-gradient';

export default function StoriesComponent({navigation}: any) {
  //   const [user, setUser] = useState<User | null>(null);

  const {stories, orderedStories, setOrderedStories} =
    useContext(StoriesContext);

  //   const [orderedStories, setOrderedStories] = useState(stories);

  const allStoriesViewed = (item: any) => {
    let av = true;
    for (let i = 0; i < item.length; i++) {
      if (item[i].seen === false) {
        av = false;
        break;
      }
    }
    return av;
  };

  useEffect(() => {
    const odStories = stories.slice(1);
    const seenStories = odStories.filter((story: any) =>
      allStoriesViewed(story),
    );
    const newStories = odStories.filter(
      (story: any) => !allStoriesViewed(story),
    );
    const allStories = stories
      .slice(0, 1)
      .concat(newStories)
      .concat(seenStories);
    setOrderedStories(allStories);
  }, [stories, setOrderedStories]);

  //   useEffect(() => {
  //     const fetchUserDetails = async () => {
  //       const userToken = await AsyncStorage.getItem('userToken');
  //       if (userToken) {
  //         const tempUser = users.find(u => u.username === userToken);
  //         if (tempUser) {
  //           setUser(tempUser);
  //         } else {
  //           setUser({
  //             username: userToken,
  //           });
  //         }
  //       }
  //     };
  //     fetchUserDetails();
  //   }, []);

  return (
    <FlatList
      horizontal
      style={styles.storiesContainer}
      data={orderedStories}
      renderItem={({item}: any) => (
        <StoryItem
          item={item}
          navigation={navigation}
          orderedStories={orderedStories}
        />
      )}
      keyExtractor={item => item[0].author}
    />
  );
}

const StoryItem = ({item, navigation, orderedStories}: any) => {
  const [pf, setPf] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = users.find(u => u.username === item[0].author);
      if (user) {
        setPf(user?.profilePic);
      }
    };
    fetchUserData();
  }, [item]);

  const [allViewed, setAllViewed] = useState(true);

  const allStoriesViewed = async () => {
    let av = true;
    for (let i = 0; i < item.length; i++) {
      if (item[i].seen === false) {
        av = false;
        break;
      }
    }
    setAllViewed(av);
  };

  useEffect(() => {
    allStoriesViewed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, orderedStories]);

  const openStory = () => {
    navigation.navigate('Story', {story: item, pf});
  };

  return (
    <Pressable style={styles.storyContain} onPress={openStory}>
      <LinearGradient
        colors={allViewed ? ['gray', 'gray'] : ['#FFD700', '#FF6347']} // Replace these colors with your desired gradient colors
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 0.5}}
        style={styles.colorfulCircle}>
        {pf ? (
          <Image style={styles.storyDisplay} src={pf} />
        ) : (
          <Image
            style={styles.storyDisplay}
            source={require('../assets/user.jpg')}
          />
        )}
      </LinearGradient>
      {/* </View> */}
      <Text style={styles.storyTitle}>{item[0]?.author}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  storiesContainer: {
    backgroundColor: 'black',
    borderBottomColor: 'darkgray',
    borderBottomWidth: 0.5,
    paddingVertical: 10,
  },
  storyContain: {
    display: 'flex',
    marginHorizontal: 10,
    width: 100,
    alignItems: 'center',
  },
  colorfulCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyDisplay: {
    height: 90,
    width: 90,
    borderRadius: 45,
    borderWidth: 2,
    borderColor: '#000',
  },
  storyTitle: {
    marginTop: 7,
    color: 'gray',
  },
});
