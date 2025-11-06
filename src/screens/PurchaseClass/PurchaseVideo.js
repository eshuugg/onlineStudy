import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { purchaseVideoDetails } from '../../redux/Slicers/VideoSlicer';
// import WebView from 'react-native-webview';
import YoutubePlayer from "react-native-youtube-iframe";

const { width, height } = Dimensions.get('window');

export default function PurchaseVideoScreen() {
  const [videoData, setVideoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();

  const fetchVideoData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await dispatch(purchaseVideoDetails());
      console.log('Video details fetched successfully:', response);
      if (response?.IsSuccess) {
        setVideoData(response?.body || []);
      }
    } catch (error) {
      console.error('Error fetching video data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  const onRefresh = useCallback(() => {
    fetchVideoData();
  }, [fetchVideoData]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderVideoItem = ({ item, index }) => {
    const handlePress = () => {
      const url = item?.Material;

      if (!url) return;

      if (item.Type === 2) {
        // For YouTube videos
        const videoId = extractVideoId(url);
        if (videoId) {
          setSelectedVideo(videoId);
          setModalVisible(true);
        }
      } else if (item.Type === 1) {
        // For PDFs (keep your existing PDF handling)
        const pdfUrl = url.startsWith('http')
          ? url
          : `https://your-domain.com${url}`;
        // navigation.navigate('PdfViewer', { pdfUrl });
      }
    };

    return (
      <TouchableOpacity
        style={styles.videoItem}
        onPress={handlePress}
      >
        <View style={styles.thumbnailContainer}>
          <Image
            source={require('../../asset/video.png')}
            style={styles.thumbnail}
          />
          {/* <View style={styles.playIconContainer}>
            <Text style={styles.playIcon}>▶</Text>
          </View> */}
        </View>
        <Text style={styles.videoTitle} numberOfLines={2}>
          {item.CourseName || `Video ${index + 1}`}
        </Text>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a2942" />
          <Text style={styles.loadingText}>Loading videos...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Title */}
      <Text style={styles.title}>Premium Learning Zone/ Video</Text>

      {/* Video List */}
      {videoData.length > 0 ? (
        <FlatList
          data={videoData}
          renderItem={renderVideoItem}
          keyExtractor={(item, index) => item.id ? item.id.toString() : `video-${index}`}
          contentContainerStyle={styles.videoList}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          columnWrapperStyle={styles.row}
          ListFooterComponent={<View style={{ height: height * 0.05 }} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#1a2942']}
              tintColor={'#1a2942'}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image
            source={require('../../asset/video.png')}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>No videos available</Text>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={refreshing}
          >
            <Text style={styles.refreshButtonText}>
              {refreshing ? 'Refreshing...' : 'Tap to refresh'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Video Player Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {selectedVideo && (
            <YoutubePlayer
              height={300}
              play={true}
              videoId={selectedVideo}
              webViewStyle={{ opacity: 0.99 }}
              initialPlayerParams={{
                controls: true,         // show basic play/pause controls
                modestbranding: true,   // hides big YouTube logo
                rel: false,             // hides "related videos" at end
                showinfo: false,        // hides video title (deprecated but still helps)
                fs: true,               // allows fullscreen toggle
                loop: false,            // disable looping
                autoplay: true,         // starts automatically
                iv_load_policy: 3,      // hides annotations / cards
                playsinline: true,      // prevents fullscreen by default
              }}
              onError={(e) => console.log("YouTube Error", e)}
            />
          )}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
    color: '#1a2942',
  },
  videoList: {
    paddingHorizontal: width * 0.03,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  videoItem: {
    width: (width - width * 0.1) / 3,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  thumbnailContainer: {
    position: 'relative',
    width: '100%',
    aspectRatio: 1,
    marginBottom: height * 0.01,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: width * 0.03,
    resizeMode: 'cover',
  },
  playIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: width * 0.03,
  },
  playIcon: {
    fontSize: width * 0.08,
    color: 'white',
  },
  videoTitle: {
    fontSize: width * 0.03,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  webView: {
    width: width,
    height: height * 0.35,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: height * 0.1,
  },
  emptyImage: {
    width: width * 0.5,
    height: width * 0.5,
    opacity: 0.5,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
  },
});