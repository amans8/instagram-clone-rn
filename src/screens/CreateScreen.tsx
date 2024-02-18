import {
  StyleSheet,
  Button,
  View,
  Image,
  Dimensions,
  TextInput,
  Pressable,
  Text,
} from 'react-native';
import React, {useContext, useState} from 'react';
import ImagePicker from 'react-native-image-crop-picker';
import {PostsContext} from '../context/PostsContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreateScreen({navigation, route}: any) {
  const {fetchedPosts, setFetchedPosts} = useContext(PostsContext);

  const [selectedImage, setSelectedImage] = useState<string | null>(
    route?.params?.post?.images[0] ?? null,
  );
  const [caption, setCaption] = useState<string>(
    route?.params?.post?.caption ?? '',
  );
  const [uploading, setUploading] = useState<boolean>(false);

  const createNewPost = async () => {
    setUploading(true);
    setTimeout(async () => {
      const author = await AsyncStorage.getItem('userToken');
      const date = getTodaysDate();
      setFetchedPosts([
        {
          id: fetchedPosts.length + 1,
          caption,
          images: [selectedImage],
          author,
          date,
        },
        ...fetchedPosts,
      ]);
      navigation.navigate('Home');
    }, 2000);
  };

  const getTodaysDate = () => {
    let today = new Date();

    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    let formattedDate = dd + '-' + mm + '-' + yyyy;
    return formattedDate;
  };

  const selectImageToUpload = () => {
    ImagePicker.openPicker({
      width: 500,
      height: 500,
      cropping: false,
    }).then(async image => {
      const croppedImage = await ImagePicker.openCropper({
        path: image.path,
        width: 500,
        height: 500,
        cropping: true,
        cropperCircleOverlay: false,
        mediaType: 'photo',
      });
      if (image?.sourceURL) {
        setSelectedImage(croppedImage?.path);
      }
    });
  };

  const deletePost = async () => {
    const newPosts = fetchedPosts.filter(
      (p: any) => p.id !== route.params.post.id,
    );
    setFetchedPosts(newPosts);
    navigation.navigate('PostsProfile');
  };

  const modifyPost = async () => {
    setUploading(true);
    setTimeout(async () => {
      const newPosts = fetchedPosts.map((p: any) => {
        if (p.id === route.params.post.id) {
          return {
            id: p.id,
            caption,
            images: [selectedImage],
            author: p.author,
            date: p.date,
          };
        } else {
          return p;
        }
      });
      setFetchedPosts(newPosts);
      navigation.navigate('PostsProfile');
    }, 1000);
  };

  return (
    <View style={[styles.container]}>
      {selectedImage && (
        <Image style={styles.previewImage} source={{uri: selectedImage}} />
      )}
      <View style={[styles.buttonsContainer, {flex: selectedImage ? 1 : 0}]}>
        <Button
          onPress={selectImageToUpload}
          title={
            selectedImage
              ? 'Select a different image'
              : 'Select images to upload'
          }
          disabled={uploading}
        />
        {selectedImage && (
          <TextInput
            style={styles.textInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Type a caption..."
            placeholderTextColor={'#848484'}
            autoCorrect={false}
            spellCheck={false}
            clearButtonMode="while-editing"
            readOnly={uploading}
          />
        )}
        {selectedImage && (
          <>
            <Button
              onPress={
                route?.params?.post
                  ? deletePost
                  : () => {
                      setSelectedImage(null);
                      setCaption('');
                    }
              }
              color={route?.params?.post && 'red'}
              title={route?.params?.post ? 'Delete post' : 'Discard post'}
              disabled={uploading}
            />
            <Pressable
              style={[
                styles.uploadButton,
                (caption.length === 0 ||
                  !selectedImage ||
                  uploading ||
                  (route?.params?.post &&
                    route.params.post.caption === caption &&
                    route.params.post.images[0] === selectedImage)) &&
                  styles.uploadButtonDisabled,
              ]}
              disabled={
                caption.length === 0 ||
                !selectedImage ||
                uploading ||
                (route?.params?.post &&
                  route.params.post.caption === caption &&
                  route.params.post.images[0] === selectedImage)
              }
              onPress={route?.params?.post ? modifyPost : createNewPost}>
              <Text style={styles.buttonText}>
                {uploading
                  ? route?.params?.post
                    ? 'Saving changes...'
                    : 'Uploading...'
                  : route?.params?.post
                  ? 'Modify Post'
                  : 'Upload post'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  previewImage: {
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
    width: Dimensions.get('window').width - 30,
    aspectRatio: 1,
    marginHorizontal: 15,
    objectFit: 'cover',
  },
  buttonsContainer: {
    marginBottom: 30,
  },
  textInput: {
    width: Dimensions.get('window').width - 30,
    backgroundColor: '#282828',
    fontSize: 18,
    color: 'white',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 'auto',
  },
  uploadButton: {
    backgroundColor: '#4192ef',
    width: Dimensions.get('window').width - 30,
    marginTop: 10,
    marginBottom: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    color: 'white',
    borderRadius: 7,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
