import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';

const CameraModule = ({setSelectedImage}) => {
  const handleCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
      includeBase64: true,
      compressImageQuality: 0.6,
    })
      .then(image => {
        // You might want to handle the image object differently based on your needs
        setSelectedImage({
          uri: image.path,
          base64: image.data,
          width: image.width,
          height: image.height,
        });
      })
      .catch(err => {
        console.log('Camera Error:', err);
        // You might want to handle errors here (e.g., permission denied)
      });
  };

  return (
    <TouchableOpacity style={styles.iconButton} onPress={() => handleCamera()}>
      <Image
        source={require('../assets/img/camera-icon.png')} // Changed to camera icon since this is for camera
        style={styles.icon}
      />
      <Text style={styles.iconText}>Camera</Text>
    </TouchableOpacity>
  );
};

export default CameraModule;

const styles = StyleSheet.create({
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#c2dfaf',
    padding: 10,
    borderRadius: 25,
    width: '30%',
  },
  icon: {
    width: 30,
    height: 30,
    marginBottom: 5,
  },
  iconText: {
    fontSize: 14,
    color: '#333',
  },
});
