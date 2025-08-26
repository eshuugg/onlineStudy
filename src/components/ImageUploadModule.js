import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';
import ImagePicker from 'react-native-image-crop-picker';

const ImageUploadModule = ({setSelectedImage}) => {
  const handleImageUpload = () => {
    ImagePicker.openPicker({
      freeStyleCropEnabled: true,
      cropping: true,
      includeBase64: true,
      compressImageQuality: 0.6,
    })
      .then(image => {
        setSelectedImage(image.data);
      })
      .catch(err => {});
  };

  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={() => handleImageUpload()}>
      <Image
        source={require('../assets/img/upload-icon.png')} // Changed to camera icon since this is for camera
        style={styles.icon}
      />
      <Text style={styles.iconText}>Camera</Text>
    </TouchableOpacity>
  );
};

export default ImageUploadModule;

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
