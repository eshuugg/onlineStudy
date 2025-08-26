import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Header from '../../components/Header/Header';
;

import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
// import {otherCourseDetails, otherCourseDta} from '../../redux/Slicer/OtherCoursesSlicer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { otherCourseDta } from '../../redux/Slicers/OtherCoursesSlicer';

const { width, height } = Dimensions.get('window');

const freeClassOptions = [
  {
    label: 'Live class',
    icon: require('../../asset/online.png'),
    screen: 'FreeLiveClass',
  },
  {
    label: 'Video',
    icon: require('../../asset/video.png'),
    screen: 'FreeVideoClass',
  },
  {
    label: 'Study Material',
    icon: require('../../asset/material.png'),
    screen: 'FreeStudyMaterial',
  },
];

const purchaseClassOptions = [
  {
    label: 'Live class',
    icon: require('../../asset/online-p.png'),
    screen: 'PurchaseLiveClass',
  },
  {
    label: 'Video',
    icon: require('../../asset/video-p.png'),
    screen: 'PurchaseVideoScreen',
  },
  {
    label: 'Study Material',
    icon: require('../../asset/material-p.png'),
    screen: 'PurchaseStudyMaterial',
  },
];

const Dashboard = () => {
  const [otherDetails, setotherDetails] = useState();
  const [userDta, setUserDta] = useState();

  console.log('otherDetails', otherDetails);

  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(otherCourseDta()).then(response => {
      console.log('Free video details fetched successfully:', response);
      if (response?.IsSuccess) {
        setotherDetails(response?.body);
      }
    });

    const userData = async () => {
      const value = await AsyncStorage.getItem('userDta');
      setUserDta(JSON.parse(value));
    };

    userData();
  }, []);

  return (

    <View style={styles.container}>
      <Header title={'Career Carrier'} />

      {/* User Info Section */}
      <View style={styles.userInfo}>
        <Image
          source={require('../../asset/avtar.png')}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.userName}>Hi, {userDta?.FirstName}</Text>
          <Text style={styles.userRole}>WBP Constable</Text>
        </View>
      </View>

      {/* Banner Section */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={styles.banner}>
          <Image
            source={require('../../asset/banner.jpg')}
            style={styles.bannerImage}
          />
        </View>

        {/* Options Section */}
        {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: height * 0.02 }}> */}
        {/* Free Class Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Free Learning Zone</Text>
          <View style={styles.optionRow}>
            {freeClassOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => navigation.navigate(item.screen)}>
                <Image source={item.icon} style={styles.optionIcon} />
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Purchase Class Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Premium Learning Zone</Text>
          <View style={styles.optionRow}>
            {purchaseClassOptions.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.option}
                onPress={() => navigation.navigate(item.screen)}>
                <Image source={item.icon} style={styles.optionIcon} />
                <Text style={styles.optionText}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* </ScrollView> */}

        {/* Bottom Section */}
        <Text style={styles.otherCourseTitle}>Explore More Courses</Text>
        <ScrollView
          horizontal
          style={styles.bottomScroll}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.bottomScrollContent}>
          {otherDetails?.map((course, index) => (
            <TouchableOpacity
              key={index}
              style={styles.bottomCard}
              onPress={() =>
                navigation.navigate('OtherCourseDetails', { dta: course })
              }>
              <Image
                source={{ uri: `https://demo.careercarrier.org${course?.Images}` }}
                style={styles.bottomCardImage}
              />
              <Text style={styles.bottomCardText}>{course?.Name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </View>

  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: width * 0.04,
    backgroundColor: '#fff',
    // elevation: 2,
    marginHorizontal: width * 0.05,
    borderRadius: width * 0.02,
    borderColor: '#ddd',
    borderWidth: 1,
    marginTop: height * -0.01,
    shadowColor: '#565656',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  avatar: {
    width: width * 0.15,
    height: width * 0.15,
    borderRadius: width * 0.075,
    marginRight: width * 0.03,
  },
  userName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
  },
  userRole: {
    fontSize: width * 0.035,
    color: '#666',
  },
  banner: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.02,
  },
  bannerImage: {
    width: '100%',
    height: height * 0.18,
    borderRadius: width * 0.02,
    resizeMode: 'cover',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.03,
    marginTop: height * 0.02,
    paddingBottom: height * 0.02,
  },
  option: {
    width: width * 0.28,
    alignItems: 'center',
    backgroundColor: '#1a2942',
    borderRadius: width * 0.02,
    paddingVertical: height * 0.015,
    marginBottom: height * 0.015,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 10,
    color: '#000',
  },

  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionIcon: {
    width: width * 0.15,
    height: width * 0.15,
    resizeMode: 'contain',
  },
  optionText: {
    marginTop: height * 0.01,
    fontSize: width * 0.035,
    color: '#fff',
    textAlign: 'center',
  },
  otherCourseTitle: {
    color: '#000',
    fontSize: width * 0.045,
    marginLeft: width * 0.05,
    marginTop: height * 0.01,
    fontWeight: 'bold',
  },
  notificationBadge: {
    backgroundColor: '#ff0000',
    borderRadius: width * 0.05,
    position: 'absolute',
    top: height * -0.01,
    right: width * -0.02,
    minWidth: width * 0.06,
    height: width * 0.06,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationText: {
    color: '#fff',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  bottomScroll: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.01,
  },
  bottomScrollContent: {
    paddingBottom: height * 0.05,
  },
  bottomCard: {
    alignItems: 'center',
    marginRight: width * 0.03,
    backgroundColor: '#1a2942',
    width: width * 0.35,
    height: height * 0.15,
    borderRadius: width * 0.02,
    padding: width * 0.03,
    justifyContent: 'center',
  },
  bottomCardImage: {
    width: width * 0.15,
    height: width * 0.15,
    resizeMode: 'contain',
  },
  bottomCardText: {
    marginTop: height * 0.01,
    fontSize: width * 0.035,
    color: '#fff',
    textAlign: 'center',
  },
  sectionContainer: {
    marginHorizontal: width * 0.05,
    marginTop: height * 0.005,
  },
  // sectionTitle: {
  //   fontSize: width * 0.045,
  //   fontWeight: 'bold',
  //   color: '#fff',
  //   marginBottom: height * 0.01,
  // },
});
