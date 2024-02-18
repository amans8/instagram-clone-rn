import {
  ActivityIndicator,
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {StoriesContext} from '../context/StoriesContext';

export default function StoryScreen({navigation, route}: any) {
  const {story, pf} = route.params;

  const [currentUserStory, setCurrentUserStory] = useState(story);

  const [currentStory, setCurrentStory] = useState<any>(null);

  const {stories, orderedStories, setOrderedStories} =
    useContext(StoriesContext);

  const [tempOdStories] = useState(orderedStories);

  const [storyLoading, setStoryLoading] = useState(true);

  useEffect(() => {
    let gotStory = false;
    for (let i = 0; i < currentUserStory.length; i++) {
      if (currentUserStory[i].seen === false) {
        setCurrentStory(currentUserStory[i]);
        gotStory = true;
        break;
      }
    }
    if (!gotStory) {
      setCurrentStory(currentUserStory[0]);
    }
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isStorySeen = (index: number) => {
    const indexOfCurrentStory = currentUserStory.indexOf(currentStory);
    if (index < indexOfCurrentStory) {
      return true;
    }
    return false;
  };

  const isCurrentStory = (index: number) => {
    const indexOfCurrentStory = currentUserStory.indexOf(currentStory);
    if (index === indexOfCurrentStory) {
      return true;
    }
    return false;
  };

  const leftScreenPressed = () => {
    const indexOfCurrentStory = currentUserStory.indexOf(currentStory);
    if (indexOfCurrentStory > 0) {
      setCurrentStory(currentUserStory[indexOfCurrentStory - 1]);
    } else {
      // move to prev user story
      const indexOfCurrentUserStory = tempOdStories.indexOf(currentUserStory);
      if (indexOfCurrentUserStory > 0) {
        const lastUserStory = tempOdStories[indexOfCurrentUserStory - 1];
        setCurrentUserStory(lastUserStory);
        setCurrentStory(lastUserStory[lastUserStory.length - 1]);
      } else {
        navigation.goBack();
      }
    }
  };

  const rightScreenPressed = () => {
    const indexOfCurrentStory = currentUserStory.indexOf(currentStory);
    if (indexOfCurrentStory < currentUserStory.length - 1) {
      setCurrentStory(currentUserStory[indexOfCurrentStory + 1]);
    } else {
      // move to next user story
      const indexOfCurrentUserStory = tempOdStories.indexOf(currentUserStory);
      if (indexOfCurrentUserStory < tempOdStories.length - 1) {
        const nextUserStory = tempOdStories[indexOfCurrentUserStory + 1];
        setCurrentUserStory(nextUserStory);
        setCurrentStory(nextUserStory[0]);
      } else {
        navigation.goBack();
      }
    }
  };

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: any;

    if (!storyLoading) {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(prevProgress => prevProgress + 0.1);
      }, 33); // Update every 33 milliseconds
    }
    setTimeout(() => {
      clearInterval(timer);
      //   setProgress(0);
    }, 3000); // Stop after 3 seconds

    return () => clearInterval(timer);
  }, [currentStory, storyLoading]);

  useEffect(() => {
    let timeoutId: any;

    if (!storyLoading) {
      timeoutId = setTimeout(() => {
        rightScreenPressed();
      }, 3000);
    }
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStory, storyLoading]);

  const imageLoadEnd = () => {
    setStoryLoading(false);
  };

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

  //change current story to seen.
  useEffect(() => {
    if (currentStory) {
      const indexOfCurrentStory = currentUserStory.indexOf(currentStory);
      const indexOfCurrentUserStory = stories.indexOf(currentUserStory);
      let modifedCurrentStory = currentStory;
      modifedCurrentStory.seen = true;
      let modifiedCurrentUserStory = currentUserStory;
      modifiedCurrentUserStory[indexOfCurrentStory] = modifedCurrentStory;
      let modifiedOrderedStories = stories;
      modifiedOrderedStories[indexOfCurrentUserStory] =
        modifiedCurrentUserStory;

      //update order of stories
      const odStories = modifiedOrderedStories.slice(1);
      const seenStories = odStories.filter((sto: any) => allStoriesViewed(sto));
      const newStories = odStories.filter((sto: any) => !allStoriesViewed(sto));
      const allStories = modifiedOrderedStories
        .slice(0, 1)
        .concat(newStories)
        .concat(seenStories);
      setOrderedStories(allStories);

      //   setStories(modifiedOrderedStories);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStory]);

  //   console.log('od storis====>', orderedStories);

  return (
    <View style={styles.container}>
      <View style={styles.header} />
      <View style={styles.storyContainer}>
        <ActivityIndicator
          style={styles.activity}
          size={'large'}
          color={'white'}
        />
        <View style={styles.storyHead}>
          <View style={styles.loadingBar}>
            {currentUserStory.map((subStory: any, index: number) => (
              <View
                key={subStory?.id}
                style={[
                  styles.subLoadingBar,
                  {
                    width:
                      currentUserStory.length === 1
                        ? Dimensions.get('window').width - 30
                        : (Dimensions.get('window').width -
                            30 -
                            (currentUserStory.length - 1) * 6) /
                          currentUserStory.length,
                  },
                  {
                    backgroundColor: isStorySeen(index)
                      ? 'white'
                      : isCurrentStory(index)
                      ? 'black'
                      : 'black',
                  },
                  {
                    backgroundColor: !isStorySeen(index)
                      ? 'rgba(0,0,0,0.1)'
                      : 'white',
                  },
                ]}>
                {isCurrentStory(index) && (
                  <View
                    style={[
                      styles.progress,
                      {
                        width: `${(progress / 6.9) * 100}%`,
                        maxWidth:
                          currentUserStory.length === 1
                            ? Dimensions.get('window').width - 30
                            : (Dimensions.get('window').width -
                                30 -
                                (currentUserStory.length - 1) * 6) /
                              currentUserStory.length,
                      },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
          <View style={styles.profileInfo}>
            {pf ? (
              <Image style={styles.pf} src={pf} />
            ) : (
              <Image style={styles.pf} source={require('../assets/user.jpg')} />
            )}
            <Text style={styles.username}>{currentUserStory[0]?.author}</Text>
            <Pressable onPress={() => navigation.goBack()}>
              <AntDesign name="close" color={'white'} size={30} />
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.leftScreen} onPressOut={leftScreenPressed} />
        <Pressable style={styles.rightScreen} onPressOut={rightScreenPressed} />
        {currentStory && (
          <Image
            style={[styles.story, {opacity: storyLoading ? 0 : 1}]}
            src={currentStory?.story}
            onLoadStart={() => setStoryLoading(true)}
            onLoadEnd={imageLoadEnd}
          />
        )}
      </View>
      <View style={styles.footer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#404040',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#404040',
  },
  footer: {
    height: 50,
    width: '100%',
    backgroundColor: '#404040',
  },
  storyContainer: {
    flex: 1,
    borderRadius: 15,
    height: Dimensions.get('window').height - 110,
    width: Dimensions.get('window').width,
    backgroundColor: '#c4c4c4',
    position: 'relative',
  },
  activity: {
    position: 'absolute',
    top: '50%',
    left: Dimensions.get('window').width / 2 - 15,
  },
  story: {
    position: 'relative',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 110,
    objectFit: 'cover',
    borderRadius: 15,
  },
  storyHead: {
    position: 'absolute',
    paddingHorizontal: 15,
    paddingTop: 10,
    zIndex: 4,
  },
  loadingBar: {
    height: 4,
    width: Dimensions.get('window').width - 30,
    marginBottom: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subLoadingBar: {
    height: 4,
    borderRadius: 2,
    // backgroundColor: 'white',
  },
  progress: {
    height: 4,
    borderRadius: 2,
    backgroundColor: 'white',
    opacity: 1,
  },
  profileInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  pf: {
    height: 40,
    width: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    marginRight: 'auto',
  },
  leftScreen: {
    height: Dimensions.get('window').height - 110,
    width: Dimensions.get('window').width / 2,
    position: 'absolute',
    zIndex: 2,
    // backgroundColor: 'pink',
  },
  rightScreen: {
    height: Dimensions.get('window').height - 110,
    width: Dimensions.get('window').width / 2,
    position: 'absolute',
    right: 0,
    zIndex: 2,
    // backgroundColor: 'lightblue',
  },
});
