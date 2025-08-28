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
  Linking,
} from 'react-native';
import Header from '../../components/Header/Header';
;
import { useDispatch } from 'react-redux';
// import { freeLiveClassDetails } from '../../redux/Slicer/ClassSlicer';
import { freeStudyMaterialDetails } from '../../redux/Slicers/StudyMaterialSlicer';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const FreeStudyMaterial = () => {
  const [demoClass, setdemoClass] = useState([]);
  const demoClasses = [
    {
      id: '1',
      title: 'Video-1',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '2',
      title: 'Video-2',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '3',
      title: 'Video-3',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '4',
      title: 'Video-4',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '5',
      title: 'Video-5',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '6',
      title: 'Video-6',
      thumbnail: require('../../asset/education.png'),
    },
  ];

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {

      dispatch(freeStudyMaterialDetails()).then(response => {
        console.log('Free class details fetched successfully:', response);
        if (response?.IsSuccess) {
          setdemoClass(response?.body);
        }
      });
    });
    return unsubscribe;
  }, []);

  // Render function for demo class items
  const renderDemoClass = ({ item }) => (
    <TouchableOpacity
      style={styles.demoClassItem}
      onPress={() => {
        const url = item?.Material;

        if (!url) return;

        // Make sure the URL is absolute
        const pdfUrl = url.startsWith('http')
          ? url
          : `https://demo.careercarrier.org${url}`; // 🔁 Replace with your actual domain

        // Navigate to PdfViewer screen and pass the URL
        navigation.navigate('PdfViewer', { pdfUrl });
      }}>
      <Image
        source={require('../../asset/material.png')}
        style={styles.demoThumbnail}
      />
      <Text style={styles.demoTitle}>{item.CourseName}</Text>
    </TouchableOpacity>
  );


  return (
    <View style={{ flex: 1 }}>
      <Header/>
      <ScrollView style={styles.container}>
        {/* Top Banner */}
        {/* <Image
          source={require('../../asset/indianpolice.jpg')}
          style={styles.bannerImage}
        /> */}

        {/* Course Details */}
        {/* <View style={styles.detailsContainer}>
          <Text style={styles.courseTitle}>WBP Constable</Text>
          <Text style={styles.courseDescription}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
            bibendum consequat ipsum, ac ultrices leo hendrerit vel. Class
            aptent taciti sociosqu ad litora torquent per conubia nostra, per
            inceptos himenaeos.
          </Text>

          <View style={styles.courseInfo}>
            <Text style={styles.courseFees}>Fees: ₹15000</Text>
            <Text style={styles.courseDuration}>Duration: 3 Months</Text>
          </View>

          <TouchableOpacity style={styles.buyButton}>
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View> */}

        {/* Demo Classes */}
        <Text style={styles.sectionTitle}>Free Learning Zone/ Material</Text>
        <FlatList
          data={demoClass}
          renderItem={renderDemoClass}
          keyExtractor={item => item.id?.toString()}
          numColumns={3}
          contentContainerStyle={styles.demoList}
          showsVerticalScrollIndicator={false}
        />

        {/* Successful Students */}
        {/* <Text style={styles.sectionTitle}>Successful Students</Text>
        <View style={styles.successfulStudentsContainer}>
          <Text style={styles.placeholderText}>
            Content for Successful Students
          </Text>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default FreeStudyMaterial;

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
    width: width / 3 - width * 0.05, // Adjust to leave space for margins
    alignItems: 'center',
    marginBottom: height * 0.02,
    marginHorizontal: width * 0.02, // Add horizontal spacing between items
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
});
