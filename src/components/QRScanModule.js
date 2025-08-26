import React, {useEffect, useRef, useState} from 'react';
import {StatusBar, Text, View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Layout from './Layout';

const QRScanModule = props => {
  const [status, setStatus] = useState(false);
  const scannerRef = useRef(null);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', async () => {
      console.log('Focus triggered');
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA,
      );
      console.log('Permission result:', result);
      setStatus(result === RESULTS.GRANTED);
    });

    return () => unsubscribe();
  }, []);

  const onSuccess = async e => {
    console.log('Scanned QR:', e);
    // props.navigation.navigate('AddMultiStockIn', { ... });
  };
  console.log('status', status);

  return (
    <Layout goBack drawer title="Scan" {...props}>
      <View style={styles.scrollViewStyle}>
        <StatusBar barStyle="light-content" backgroundColor="#2663ff" />
        {status ? (
          <View style={{flex: 1}}>
            {/* <QRCodeScanner
              ref={scannerRef}
              reactivate={true}
              showMarker={true}
              onRead={onSuccess}
              topContent={
                <Text style={styles.centerText}>
                  Please move your camera{'\n'}over the QR Code
                </Text>
              }
            /> */}

            <QRCodeScanner
              onRead={onSuccess}
            //   flashMode={RNCamera.Constants.FlashMode.torch}
              topContent={
                <Text style={styles.centerText}>
                  Go to{' '}
                  <Text style={styles.textBold}>
                    wikipedia.org/wiki/QR_code
                  </Text>{' '}
                  on your computer and scan the QR code.
                </Text>
              }
              bottomContent={
                <TouchableOpacity style={styles.buttonTouchable}>
                  <Text style={styles.buttonText}>OK. Got it!</Text>
                </TouchableOpacity>
              }
            />
          </View>
        ) : (
          <Text style={styles.permissionText}>
            Please enable camera access to use the scanner.
          </Text>
        )}
      </View>
    </Layout>
  );
};

export default QRScanModule;

const styles = StyleSheet.create({
  scrollViewStyle: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  permissionText: {
    textAlign: 'center',
    color: 'gray',
    marginTop: 50,
  },
});
