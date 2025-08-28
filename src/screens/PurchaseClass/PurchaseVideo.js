import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import Header from '../../components/Header/Header';
;
import { useDispatch } from 'react-redux';
import { purchaseVideoDetails } from '../../redux/Slicers/VideoSlicer';
import WebView from 'react-native-webview';
// import {purchaseVideoDetails} from '../../redux/Slicers/VideoSlicer';

const { width, height } = Dimensions.get('window');

export default function PurchaseVideoScreen() {
  const [videoData, setvideoData] = useState();
  const [selectedVideo, setSelectedVideo] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

  // Sample data for videos
  // const videos = [
  //   {
  //     id: '1',
  //     title: 'Video-1',
  //     description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  //   {
  //     id: '2',
  //     title: 'Video-2',
  //     description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  //   {
  //     id: '3',
  //     title: 'Video-3',
  //     description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  //   {
  //     id: '4',
  //     title: 'Video-4',
  //     description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  //   {
  //     id: '5',
  //     title: 'Video-5',
  //     description: 'Short description for video 5.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  //   {
  //     id: '6',
  //     title: 'Video-6',
  //     description: 'Short description for video 6.',
  //     thumbnail: require('../../asset/education.png'),
  //   },
  // ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(purchaseVideoDetails()).then(response => {
      console.log('Free video details fetched successfully:', response);
      if (response?.IsSuccess) {
        setvideoData(response?.body);
      }
    });
  }, []);

  // Render function for each video item
  const extractVideoId = (url) => {
    // Extract video ID from various YouTube URL formats
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

const renderVideoItem = ({ item }) => {
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
        navigation.navigate('PdfViewer', { pdfUrl });
      }
    };

    return (
      <TouchableOpacity
        style={styles.demoClassItem}
        onPress={handlePress}
      >
        <Image
          source={require('../../asset/video.png')}
          style={styles.demoThumbnail}
        />
        <Text style={styles.demoTitle}>{item.CourseName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header />

      {/* Banner */}
      {/* <View style={styles.banner}>
        <Image
          source={require('../../asset/video.png')}
          style={styles.bannerImage}
        />
      </View> */}

      {/* Title */}
      <Text style={styles.title}>Premium Learning Zone/ Video</Text>

      {/* Video List */}
      <FlatList
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videoList}
        showsVerticalScrollIndicator={false}
        numColumns={3} // Display 3 columns
        columnWrapperStyle={styles.row} // Style for each row
        ListFooterComponent={<View style={{ height: height * 0.05 }} />}
      />
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
            <Text style={styles.closeButtonText}>X</Text>
          </TouchableOpacity>
          
          {selectedVideo && (
            <WebView
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{
                uri: `https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=0&showinfo=0&modestbranding=1`,
              }}
              allowsFullscreenVideo={false}
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
  banner: {
    width: '100%',
    height: height * 0.22, // 22% of screen height
    // marginBottom: height * 0.13, // 13% of screen height
    alignItems: 'center'
  },
  bannerImage: {
    width: '40%',
    height: '90%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: width * 0.055, // 5.5% of screen width
    fontWeight: 'bold',
    marginHorizontal: width * 0.06, // 6% of screen width
    marginVertical: height * 0.02, // 2% of screen height
    marginBottom: height * 0.02, // 3% of screen height
    color: '#333',
  },
  videoList: {
    paddingHorizontal: width * 0.04, // 4% of screen width
  },
  row: {
    justifyContent: 'space-between', // Distribute items evenly
    marginBottom: height * 0.02, // Spacing between rows
  },
  videoItem: {
    width: (width - width * 0.08 - width * 0.04) / 3, // Calculate width for 3 items with padding
    aspectRatio: 1, // Make item square for better visual
    marginBottom: height * 0.01, // Spacing between items within a row
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.02,
    padding: width * 0.02,
    elevation: 2,
    alignItems: 'center', // Center content horizontally
  },
  thumbnail: {
    width: '100%', // Take full width of videoItem
    height: '70%', // Adjust height to fit title below
    borderRadius: width * 0.015,
    resizeMode: 'cover',
  },
  videoInfo: {
    marginTop: height * 0.005, // Small space between thumbnail and title
    alignItems: 'center', // Center title below thumbnail
  },
  videoTitle: {
    fontSize: width * 0.035, // Adjust font size for smaller space
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
  },
  webView: {
    width: width,
    height: height * 0.3,
    alignSelf: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
    demoThumbnail: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    resizeMode: 'contain',
  },
  demoTitle: {
    fontSize: width * 0.035,
    color: '#555',
  },
  // videoDescription styles are no longer needed
});
