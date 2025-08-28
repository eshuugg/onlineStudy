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
import { useDispatch } from 'react-redux';
import { freeVideoDetails } from '../../redux/Slicers/VideoSlicer';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

export default function FreeVideoClass() {
  const [videoData, setvideoData] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(freeVideoDetails()).then(response => {
        console.log('Free video details fetched successfully:', response);
        if (response?.IsSuccess) {
          setvideoData(response?.body);
        }
      });
    });
    return unsubscribe;
  }, []);

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
          source={require('../../asset/education.png')}
          style={styles.bannerImage}
        />
      </View> */}

      {/* Title */}
      <Text style={styles.title}>Free Learning Zone/ Video</Text>

      {/* Video List */}
      <FlatList
        data={videoData}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.videoList}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        columnWrapperStyle={styles.row}
        // ListFooterComponent={<View style={{ height: height * 0.05 }} />
      />

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
    height: height * 0.22,
    alignItems: 'center'
  },
  bannerImage: {
    width: '40%',
    height: '90%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    marginHorizontal: width * 0.06,
    marginVertical: height * 0.02,
    marginBottom: height * 0.02,
    color: '#333',
  },
  videoList: {
    paddingHorizontal: width * 0.04,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
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
  demoClassItem: {
    width: width / 3 - width * 0.04,
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.02,
  },
  // Modal styles
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
});