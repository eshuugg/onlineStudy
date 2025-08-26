// YouTubePlayer.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const YouTubePlayer = ({ route }) => {
  const { videoUrl } = route.params;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: videoUrl }}
        allowsFullscreenVideo
        javaScriptEnabled
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default YouTubePlayer;
