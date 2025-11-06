import React, {useEffect, useState, useCallback} from 'react';
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
  Platform,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import Header from '../../components/Header/Header';
import {useDispatch} from 'react-redux';
import { purchaseStudyMaterialDetails } from '../../redux/Slicers/StudyMaterialSlicer';
import { useNavigation } from '@react-navigation/native';

const {width, height} = Dimensions.get('window');

const PurchaseStudyMaterial = () => {
  const [studyMaterial, setStudyMaterial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const fetchStudyMaterial = useCallback(async () => {
    try {
      setRefreshing(true);
      const response = await dispatch(purchaseStudyMaterialDetails());
      console.log('Study material details fetched successfully:', response);
      if (response?.IsSuccess) {
        setStudyMaterial(response?.body || []);
      }
    } catch (error) {
      console.error('Error fetching study material:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchStudyMaterial();
  }, [fetchStudyMaterial]);

  const onRefresh = useCallback(() => {
    fetchStudyMaterial();
  }, [fetchStudyMaterial]);

  // Render function for study material items
  const renderStudyMaterial = ({ item, index }) => (
    <TouchableOpacity
      style={styles.demoClassItem}
      onPress={() => {
        const url = item?.Material;

        if (!url) return;

        // Make sure the URL is absolute
        const pdfUrl = url.startsWith('http')
          ? url
          : `https://app.careercarrier.org${url}`;

        // Navigate to PdfViewer screen and pass the URL
        navigation.navigate('PdfViewer', { pdfUrl });
      }}>
      <View style={styles.thumbnailContainer}>
        <Image
          source={require('../../asset/material.png')}
          style={styles.demoThumbnail}
        />
        <View style={styles.pdfIconContainer}>
          <Text style={styles.pdfIcon}>📄</Text>
        </View>
      </View>
      <Text style={styles.demoTitle} numberOfLines={2}>
        {item.CourseName || `Material ${index + 1}`}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={{flex: 1}}>
        <Header/>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1a2942" />
          <Text style={styles.loadingText}>Loading study materials...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Header/>
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
        {/* Study Materials */}
        <Text style={styles.sectionTitle}>Premium Learning Zone/ Material</Text>
        
        {studyMaterial.length > 0 ? (
          <FlatList
            data={studyMaterial}
            renderItem={renderStudyMaterial}
            keyExtractor={(item, index) => item.id ? item.id.toString() : `material-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.demoList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            {/* <Image
              source={require('../../asset/material.png')}
              style={styles.emptyImage}
            /> */}
            <Text style={styles.emptyText}>No study materials available</Text>
            {/* <TouchableOpacity 
              style={styles.refreshButton}
              onPress={onRefresh}
              disabled={refreshing}
            >
              <Text style={styles.refreshButtonText}>
                {refreshing ? 'Refreshing...' : 'Tap to refresh'}
              </Text>
            </TouchableOpacity> */}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default PurchaseStudyMaterial;


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
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: width * 0.05,
    height: height * 0.3,
  },
  emptyText: {
    fontSize: width * 0.04,
    color: '#888',
    marginTop: height * 0.02,
  },
});
