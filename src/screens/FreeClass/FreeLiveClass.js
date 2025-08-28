import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native';
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { freeLiveClassDetails } from '../../redux/Slicers/ClassSlicer';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const FreeLiveClass = () => {
  const [demoClass, setdemoClass] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      dispatch(freeLiveClassDetails()).then(response => {
        console.log('Free class details fetched successfully:', response);
        if (response?.IsSuccess) {
          setdemoClass(response?.body);
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

  const renderDemoClass = ({ item }) => (
    <TouchableOpacity
      style={styles.demoClassItem}
      onPress={() => {
        const videoId = extractVideoId(item?.ClassLink);
        if (videoId) {
          setSelectedVideo(videoId);
          setModalVisible(true);
        }
      }}>
      <Image
        source={require('../../asset/online.png')}
        style={styles.demoThumbnail}
      />
      <Text style={styles.demoTitle}>{item.CourseName}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView style={styles.container}>
        <Text style={styles.sectionTitle}>Free Learning Zone/ Classes</Text>
        <FlatList
          data={demoClass}
          renderItem={renderDemoClass}
          keyExtractor={item => item.id}
          numColumns={3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.demoList}
        />
      </ScrollView>

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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: height * 0.25, // 25% of screen height
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: width * 0.05, // 5% of screen width
  },
  courseTitle: {
    fontSize: width * 0.06, // 6% of screen width
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02, // 2% of screen height
  },
  courseDescription: {
    fontSize: width * 0.035, // 3.5% of screen width
    color: '#555',
    marginBottom: height * 0.03, // 3% of screen height
    lineHeight: height * 0.025, // 2.5% of screen height
  },
  courseInfo: {
    marginBottom: height * 0.03, // 3% of screen height
  },
  courseFees: {
    fontSize: width * 0.04, // 4% of screen width
    fontWeight: 'bold',
    color: '#1a2942',
  },
  courseDuration: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#1a2942',
    marginTop: height * 0.01, // 1% of screen height
  },
  buyButton: {
    backgroundColor: '#1a2942',
    paddingVertical: height * 0.02, // 2% of screen height
    borderRadius: width * 0.02, // 2% of screen width
    alignItems: 'center',
    marginBottom: height * 0.02, // 2% of screen height
  },
  buyButtonText: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: width * 0.05, // 5% of screen width
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: width * 0.05, // 5% of screen width
    marginVertical: height * 0.02, // 2% of screen height
  },
  demoList: {
    paddingHorizontal: width * 0.02,
    paddingBottom: height * 0.02,
  },

  demoClassItem: {
    width: width / 3 - width * 0.04, // Adjust for spacing
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.02,
  },

  demoThumbnail: {
    width: width * 0.3, // 30% of screen width
    height: width * 0.3, // Square aspect ratio
    borderRadius: width * 0.02, // 2% of screen width
    marginBottom: height * 0.01, // 1% of screen height
    resizeMode: 'contain',
  },
  demoTitle: {
    fontSize: width * 0.035, // 3.5% of screen width
    color: '#555',
  },
  successfulStudentsContainer: {
    padding: width * 0.05, // 5% of screen width
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.02, // 2% of screen width
    marginHorizontal: width * 0.05, // 5% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: height * 0.05, // 5% of screen height
    minHeight: height * 0.15, // 15% of screen height
  },
  placeholderText: {
    fontSize: width * 0.04, // 4% of screen width
    color: '#888',
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
});

export default FreeLiveClass;