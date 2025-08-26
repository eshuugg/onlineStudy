import {View, Text, Modal, ActivityIndicator, BackHandler} from 'react-native';
import React, {useEffect} from 'react';
import Color from './Color';

const Loader = ({loader, onClose}) => {
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (loader) {
          onClose(); // Hide the loader when back button is pressed
          return true; // Prevent default back action
        }
        return false; // Allow normal back action
      },
    );

    return () => backHandler.remove(); // Cleanup listener
  }, [loader]);

  return (
    <Modal animationType="fade" transparent={true} visible={loader}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          // backgroundColor: Color.lightGreen,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}>
        <View
          style={
            {
              // width: 200,
              // padding: 20,
              // backgroundColor: Color.lightGreen, // Replace with your theme color
              // borderRadius: 10,
              // elevation: 10,
              // alignItems: 'center',
            }
          }>
          <ActivityIndicator color={'#fff'} size={45} />
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              marginBottom: 10,
              color: '#fff',
            }}>
            Loading...
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default Loader;
