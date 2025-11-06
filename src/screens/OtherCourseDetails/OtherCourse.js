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
  Modal,
  Alert,
  RefreshControl,
} from 'react-native';
import Header from '../../components/Header/Header';
import { useDispatch } from 'react-redux';
import { courseData, orderCreate, orderSuccessCheck } from '../../redux/Slicers/OtherCoursesSlicer';
import { useNavigation } from '@react-navigation/native';
import WebView from 'react-native-webview';
import RazorpayCheckout from 'react-native-razorpay';
import { useToast } from 'react-native-toast-notifications';

const { width, height } = Dimensions.get('window');

export default function OtherCourseDetailsScreen(props) {
  const [otherData, setotherData] = useState(props.route.params);
  const [courseDetails, setcourseDetails] = useState();
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const toast = useToast();
  const { dta } = props?.route?.params

  console.log('props', dta);


  const fetchCourseDetails = async () => {
    try {
      setRefreshing(true);
      const response = await dispatch(courseData(dta?.ID));
      if (response?.IsSuccess) setcourseDetails(response?.body);
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setRefreshing(false);
    }
  };


  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      fetchCourseDetails();
    });
    return unsubscribe;
  }, [dta?.ID]); // 👈 re-run when a new course ID is passed


  const onRefresh = useCallback(() => {
    fetchCourseDetails();
  }, [fetchCourseDetails]);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handlePayment = () => {
    if (!courseDetails?.Fees) {
      Alert.alert("Error", "Invalid course amount");
      return;
    }
    dispatch(orderCreate({ CourseID: courseDetails?.ID })).then(response => {
      console.log('Order created successfully:', response);
      if (response?.IsSuccess) {
        var options = {
          description: 'Course Purchase',
          image: 'https://your-logo-url.com/logo.png', // Optional: replace with your logo
          currency: 'INR',
          key: 'rzp_live_RMIGXUkPS6DD1w', // Live key
          amount: courseDetails.Fees * 100, // Razorpay amount in paise
          name: courseDetails?.Name || "Course Payment",
          courseID: response?.body?.Razorpay?.ID || "12345",
          prefill: {
            email: 'careercarrierprl@gmail.com', // Replace with logged-in user's email
            contact: '9002118919',     // Replace with logged-in user's phone
            name: 'Career Carrier',
            // courseId: response?.body?.Razorpay?.ID || "12345", // Course ID for backend verification
          },
          theme: { color: '#53a20e' }
        };

        RazorpayCheckout.open(options)
          .then((data) => {
            // console.log(`Success: ${data.razorpay_payment_id}`);
            console.log('data', data)
            if (data?.razorpay_payment_id) {
              // Handle successful payment here
              dispatch(orderSuccessCheck({ CourseID: courseDetails?.ID, TransactionId: data.razorpay_payment_id, OrderID: response?.body?.Razorpay?.ID }))
                .then((dta) => {
                  console.log('dta-=-=-=--=->>>>>', dta)
                  if (dta?.IsSuccess) {
                    toast.show("Payment Successful", {
                      type: 'success',
                      placement: 'top',
                      style: { marginTop: '12%' },
                      duration: 3000,
                      animationType: 'slide-in',
                    });
                    fetchCourseDetails(); // Refresh course details after payment
                  } else {
                    toast.show("Payment verification failed. Please try again.", {
                      type: 'danger',
                      placement: 'top',
                      style: { marginTop: '12%' },
                      duration: 3000,
                      animationType: 'slide-in',
                    });
                  }
                })
                .catch(error => {
                  console.error('Payment verification failed:', error);
                  Alert.alert("Error", "Payment verification failed. Please try again.");
                });
            }
          })
          .catch((error) => {
            console.log(`Error: ${error.code} | ${error.description}`);
            Alert.alert("Payment Failed", error.description);
          });
      } else {
        Alert.alert("Error", "Failed to create order");
      }
    });
  };

  const renderDemoClass = ({ item }) => (
    <TouchableOpacity
      style={styles.demoClassItem}
      onPress={() => {
        const url = item?.Classlink;
        if (!url) return;

        const videoId = extractVideoId(url);
        if (videoId) {
          setSelectedVideo(videoId);
          setModalVisible(true);
        }
      }}>
      <Image
        source={require('../../asset/education.png')}
        style={styles.demoThumbnail}
      />
    </TouchableOpacity>
  );

  console.log('courseDetails', courseDetails)

  return (
    <View style={{ flex: 1 }}>
      <Header />
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1a2942']} // Customize the loading indicator color
            tintColor={'#1a2942'} // iOS only
          />
        }
      >
        {/* Top Banner */}
        <Image
          source={{ uri: `https://app.careercarrier.org${courseDetails?.Images}` }}
          style={styles.bannerImage}
        />

        {/* Course Details */}
        <View style={styles.detailsContainer}>
          <Text style={styles.courseTitle}>{courseDetails?.Name}</Text>
          <Text style={styles.courseDescription}>
            {courseDetails?.Description}
          </Text>

          <View style={styles.courseInfo}>
            <Text style={styles.courseFees}>Fees: ₹ {courseDetails?.Fees}</Text>
            <Text style={styles.courseDuration}>Duration: {courseDetails?.Duretion} minutes</Text>
          </View>

          {/* Buy Now Button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={() => {
              if (courseDetails?.IsFree) {
                Alert.alert("Info", "This course is free!");
              } else {
                handlePayment();
              }
            }}
            disabled={courseDetails?.IsPurchase}
          >
            {courseDetails?.IsPurchase ? (
              <TouchableOpacity onPress={() => navigation.navigate('MyCourses', { courseDetails: courseDetails })}>
                <Text style={styles.buyButtonText}>
                  {'Purchased - ' + courseDetails?.DayLeft + ' days left'}
                </Text>
              </TouchableOpacity>
            ) : courseDetails?.IsFree ? (
              <Text style={styles.buyButtonText}>Free</Text>
            ) : (
              <Text style={styles.buyButtonText}>Buy Now</Text>
            )}
          </TouchableOpacity>

        </View>

        {/* Demo Classes */}
        <Text style={styles.sectionTitle}>Demo Classes</Text>
        <FlatList
          data={courseDetails?.CourseDetails}
          renderItem={renderDemoClass}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  bannerImage: {
    width: '100%',
    height: height * 0.25,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: width * 0.05,
  },
  courseTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: height * 0.02,
  },
  courseDescription: {
    fontSize: width * 0.035,
    color: '#555',
    marginBottom: height * 0.03,
    lineHeight: height * 0.025,
  },
  courseInfo: {
    marginBottom: height * 0.03,
  },
  courseFees: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#1a2942',
  },
  courseDuration: {
    fontSize: width * 0.04,
    color: '#1a2942',
    marginTop: height * 0.01,
  },
  buyButton: {
    backgroundColor: '#1a2942',
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginBottom: height * 0.02,
  },
  buyButtonText: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: width * 0.05,
    marginVertical: height * 0.02,
  },
  demoList: {
    paddingHorizontal: width * 0.03,
  },
  demoClassItem: {
    alignItems: 'center',
    marginRight: width * 0.04,
  },
  demoThumbnail: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: width * 0.02,
    marginBottom: height * 0.01,
    resizeMode: 'contain',
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