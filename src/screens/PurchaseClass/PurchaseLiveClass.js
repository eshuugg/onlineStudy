import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Modal,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { purchaseLiveClassDetails } from '../../redux/Slicers/ClassSlicer';
import WebView from 'react-native-webview';

const { width, height } = Dimensions.get('window');

const PurchaseLiveClass = () => {
  const [demoClass, setDemoClass] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchLiveClassData = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await dispatch(purchaseLiveClassDetails());
      console.log('Live class details fetched successfully:', response);
      if (response?.IsSuccess) {
        setDemoClass(response?.body || []);
      }
    } catch (error) {
      console.error('Error fetching live class data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchLiveClassData();
  }, [fetchLiveClassData]);

  const onRefresh = useCallback(() => {
    fetchLiveClassData();
  }, [fetchLiveClassData]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const renderDemoClass = ({ item, index }) => (
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
      <View style={styles.playIconContainer}>
        <Text style={styles.playIcon}>▶</Text>
      </View>
      <Text style={styles.demoTitle} numberOfLines={2}>
        {item.CourseName || `Class ${index + 1}`}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{ flex: 1 }}>
        <Header />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a2942" />
          <Text style={styles.loadingText}>Loading classes...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView 
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1a2942']}
            tintColor={'#1a2942'}
          />
        }
      >
        {/* Demo Classes */}
        <Text style={styles.sectionTitle}>Premium Learning Zone/ Classes</Text>
        
        {demoClass.length > 0 ? (
          <FlatList
            data={demoClass}
            renderItem={renderDemoClass}
            keyExtractor={(item, index) => item.id ? item.id.toString() : `class-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Image
              source={require('../../asset/online.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyText}>No classes available</Text>
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
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          
          {selectedVideo && (
            <WebView
              style={styles.webView}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              source={{
                uri: `https://www.youtube.com/embed/${selectedVideo}?autoplay=1&controls=1&showinfo=0&modestbranding=1`,
              }}
              allowsFullscreenVideo={true}
            />
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PurchaseLiveClass;

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
    paddingHorizontal: width * 0.03, // 3% of screen width
  },
  demoClassItem: {
    alignItems: 'center',
    marginRight: width * 0.04, // 4% of screen width
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
