import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { Audio } from "expo-av";

const audioBookPlaylist = [
  {
    title: "Hamlet - Act I",
    author: "William Shakespeare",
    source: "Librivox",
    uri: "https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act1_shakespeare.mp3",
    imageSource: "https://i.redd.it/icsp513na2581.jpg",
  },
  {
    title: "Hamlet - Act II",
    author: "William Shakespeare",
    source: "Librivox",
    uri: "https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act2_shakespeare.mp3",
    imageSource: "https://i.redd.it/yiaxwkiiay281.jpg",
  },
  {
    title: "Hamlet - Act III",
    author: "William Shakespeare",
    source: "Librivox",
    uri: "http://www.archive.org/download/hamlet_0911_librivox/hamlet_act3_shakespeare.mp3",
    imageSource:
      "https://preview.redd.it/475kykauy3181.jpg?width=1242&format=pjpg&auto=webp&v=enabled&s=0db488b89f9b1c70e9433c4b6e3f969e059e45f1",
  },
  {
    title: "Hamlet - Act IV",
    author: "William Shakespeare",
    source: "Librivox",
    uri: "https://ia800204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act4_shakespeare.mp3",
    imageSource: "https://i.redd.it/t5ormnxwtl081.jpg",
  },
  {
    title: "Hamlet - Act V",
    author: "William Shakespeare",
    source: "Librivox",
    uri: "https://ia600204.us.archive.org/11/items/hamlet_0911_librivox/hamlet_act5_shakespeare.mp3",
    imageSource:
      "https://preview.redd.it/vxjr2c0dsuc61.jpg?width=2160&format=pjpg&auto=webp&v=enabled&s=eab8a6b43c70b3b24e4c16f017268eb0fce969e0",
  },
];

export default function App() {
  const initialState = {
    currentIndex: 0,
  };
  const [isLoaded, setisLoaded] = useState(false);
  const [sound, setSound] = useState();
  const [isPlaying, setisPlaying] = useState(true);
  const [isBuffering, setisBuffering] = useState(false);
  const [audState, setAudState] = useState(initialState);
  console.log(
    `isPlaying:${isPlaying}, isBuffering:${isBuffering}, currentIndex:${audState.currentIndex} isloaded:${isLoaded}`
  );
  useEffect(() => {
    playSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audState.currentIndex]);

  //loading audio functions
  const loadAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync({
        uri: audioBookPlaylist[audState.currentIndex].uri,
      });
      setSound(sound);
      await sound.playAsync();
      setisLoaded(true);
    } catch (e) {
      setisBuffering(true);
      setisLoaded(false);
      console.log("error is " + e);
    }
  };
  const playSound = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        staysActiveInBackground: true,
        playThroughEarpieceAndroid: false,
      });
      loadAudio();
      setisLoaded(true);
      console.log("I have loaded");
      onPlaybackStatusUpdate();
    } catch (e) {
      console.log("error" + " " + e);
    }
    onPlaybackStatusUpdate = (status) => {
      setisPlaying(status.isPlaying);
      setisBuffering(status.isBuffering);
    };
  };
  //Pause,Resume,loadingprevious and next track functions
  const handlePause = async () => {
    if (sound && isPlaying) {
      await sound.pauseAsync();
      setisPlaying(false);
    }
  };
  const handleResume = async () => {
    if (sound && !isPlaying) {
      await sound.playAsync();
      setisPlaying(true);
    }
  };
  const loadPrevTrack = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        audState.currentIndex < audioBookPlaylist.length - 1
          ? (audState.currentIndex -= 1)
          : (audState.currentIndex = 0);
        setAudState({
          currentIndex: currentIndex,
        });
      }
      loadAudio();
    } catch (e) {
      console.log(e);
    }
  };
  //next track function
  const loadNextTrack = async () => {
    try {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        audState.currentIndex < audioBookPlaylist.length - 1
          ? (audState.currentIndex += 1)
          : (audState.currentIndex = 0);
        setAudState({
          currentIndex: currentIndex,
        });
      }
      await loadAudio();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.albumCover}
        blurRadius={isLoaded ? 3 : 5}
        resizeMode="cover"
        source={{
          uri: `${audioBookPlaylist[audState.currentIndex].imageSource}`,
        }}
      >
        {isLoaded ? (
          <View>
            <View style={styles.albumInfo}>
              <View style={styles.albumHead}>
                <Text style={styles.title}>
                  {audioBookPlaylist[audState.currentIndex].title}
                </Text>
              </View>
              <View style={styles.albumHead}>
                <Text style={styles.author}>
                  {audioBookPlaylist[audState.currentIndex].author}
                </Text>
              </View>
            </View>
            <View style={styles.controls}>
              <TouchableOpacity style={styles.control} onPress={loadPrevTrack}>
                <Ionicons
                  name="ios-play-skip-back-circle-sharp"
                  size={64}
                  color="white"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.control}
                onPress={() => (isPlaying ? handlePause() : handleResume())}
              >
                {isPlaying ? (
                  <Ionicons name="ios-pause" size={64} color="white" />
                ) : (
                  <Ionicons name="ios-play-circle" size={64} color="white" />
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.control} onPress={loadNextTrack}>
                <Ionicons
                  name="ios-play-skip-forward-circle-sharp"
                  size={64}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.indicatorWrapper}>
            <ActivityIndicator
              style={styles.indicator}
              size={"large"}
              color={"#766DF4"}
            ></ActivityIndicator>
            <Text style={styles.indicatorText}>
              Loading Your Music Please Be Patient
            </Text>
          </View>
        )}
      </ImageBackground>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  albumInfo: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
    flexWrap: "nowrap",
    width: "100%",
    height: "25%",
    marginLeft: 5,
    padding: 9,
  },
  albumHead: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 44,
    color: "#fff",
    fontWeight: "600",
  },
  author: {
    fontSize: 20,
    color: "#fff",
    fontWeight: 400,
  },
  albumCover: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    height: "75%",
  },
  control: {
    margin: 20,
  },
  indicatorWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  indicator: {
    padding: 12,
    borderRadius: 12,
  },
  indicatorText: {
    fontSize: 18,
    marginTop: 12,
    color: "#766DF4",
  },
});
