import {
  View,
  Text,
  BackHandler,
  TouchableOpacity,
  Platform,
  Modal,
  Button,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {WebView} from 'react-native-webview';
import XLSX from 'xlsx';
import Orientation from 'react-native-orientation-locker';
import {useNavigation} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import Color from './Color';
import {useDispatch, useSelector} from 'react-redux';
import {getReport} from '../redux/Slicers/partySlicer';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const ExcelViewer = props => {
  const [html, setHtml] = useState('');
  const [excelData, setExcelData] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [partyId, setPartyId] = useState('');
  const [userDetails, setUserDetails] = useState(null);

  // const navigation = useNavigation();
  const dispatch = useDispatch();

  const {reportDetailLoading, reportDetail} = useSelector(
    state => state.partyData,
  );

  console.log('reportDetail', reportDetail);

  useEffect(() => {
    if (props.route.params?.excelFile) {
      setExcelData(props.route.params?.excelFile);
      setPartyId(props.route.params?.partyId);
    }
  }, [props.route.params?.excelFile]);

  const loadExcelFile = async () => {
    try {
      const binary = XLSX.read(excelData, {type: 'base64'});
      const ws = binary.Sheets[binary.SheetNames[0]];
      const htmlOutput = XLSX.utils.sheet_to_html(ws);
      const responsiveHtml = `
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no">
            <style>
              body {
                margin: 0;
                padding: 0;
                font-family: Arial, sans-serif;
                background-color: #f8f9fa;
                box-sizing: border-box;
              }
              table {
                width: 100%;
                max-width: 100%;
                border-collapse: collapse;
                background-color: #ffffff;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
              }
              th, td {
                padding: 15px 20px;
                border: 1px solid #ddd;
                font-size: 11px;
              }
              th {
                background-color: #800080; /* Purple header */
                color: white;
                text-align: center;
              }
              td {
                text-align: right; /* Align data to the right */
              }
              tr:nth-child(even) {
                background-color: #f2f2f2;
              }
              @media screen and (orientation: landscape) {
                body {
                  font-size: 1.5em;
                }
                th, td {
                  padding: 14px 24px;
                }
              }
            </style>
          </head>
          <body>
            <div style="overflow-x: auto;">
              ${htmlOutput}
            </div>
          </body>
        </html>
      `;

      setHtml(responsiveHtml);
    } catch (error) {
      console.error('Error loading XLSX file:', error);
    }
  };

  useEffect(() => {
    loadExcelFile();
    Orientation.lockToLandscape();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        Orientation.unlockAllOrientations();
        props?.navigation.goBack();
        return true;
      },
    );
    return () => {
      backHandler.remove();
      Orientation.unlockAllOrientations();
    };
  }, [excelData, props?.navigation]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const result = await AsyncStorage.getItem('UCRD');
        console.log('result->L99999999999', JSON.parse(result));
        setUserDetails(JSON.parse(result));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);

  const handleDateFilter = () => {
    dispatch(
      getReport({
        partyId: partyId,
        startDate: `${startDate.toISOString().split('T')[0]}`,
        endDate: `${endDate.toISOString().split('T')[0]}`,
      }),
    ).then(dta => {
      console.log('dta', dta);
      if (dta) {
        setExcelData(dta?.Base64 ? dta?.Base64 : '');
      }
    });
    setModalVisible(false);
  };

  console.log('excelData-----', excelData);

  return (
    <View style={{flex: 1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', padding: 8}}>
        <TouchableOpacity
          onPress={() => {
            Orientation.lockToPortrait();
            props.navigation.navigate('Report');
          }}
          style={{marginRight: 10, flexDirection: 'row'}}>
          <FontAwesome name="chevron-left" size={30} color={'#000'} />
          <Text
            style={{
              fontSize: 18,
              fontWeight: '700',
              color: '#000',
              marginLeft: '8%',
            }}>
            Back
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            marginLeft: '2%',
            color: '#000',
            fontWeight: '700',
          }}>
          Opening Balance {reportDetail?.OpeningBalance || 0}
        </Text>

        <Text
          style={{
            textAlign: 'center',
            marginLeft: '10%',
            color: '#000',
            fontWeight: '700',
          }}>
          Name: {reportDetail?.FileName}
        </Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            marginLeft: 'auto',
            backgroundColor: Color.lightPurple,
            padding: 10,
            borderRadius: 5,
          }}>
          <Text style={{color: '#fff'}}>Filter by Date</Text>
        </TouchableOpacity>
      </View>

      {excelData === '' ? (
        <Text
          style={{
            textAlign: 'center',
            marginTop: '22%',
            fontSize: 18,
            fontWeight: 'bold',
            color: 'red',
          }}>
          {reportDetail?.ErrorMessage}
        </Text>
      ) : (
        <WebView
          originWhitelist={['*']}
          source={{html}}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          contentMode="desktop"
        />
      )}

      <Modal animationType="fade" transparent={true} visible={modalVisible}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}>
          <View
            style={{
              width: 350,
              padding: 20,
              backgroundColor: 'white',
              borderRadius: 10,
              elevation: 10,
              alignItems: 'center',
            }}>
            <Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 10}}>
              Select Date Range
            </Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={{
                marginBottom: '5%',
                backgroundColor: Color.lightPurple,
                padding: 10,
                borderRadius: 5,
              }}>
              <Text style={{fontSize: 16}}>
                Start Date: {moment(startDate).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
            {showStartPicker && (
              <DateTimePicker
                value={startDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  setShowStartPicker(false);

                  if (date) setStartDate(date);
                }}
              />
            )}

            <TouchableOpacity
              style={{
                backgroundColor: Color.lightPurple,
                padding: 10,
                borderRadius: 5,
              }}
              onPress={() => setShowEndPicker(true)}>
              <Text style={{fontSize: 16}}>
                End Date: {moment(endDate).format('DD/MM/YYYY')}
              </Text>
            </TouchableOpacity>
            {showEndPicker && (
              <DateTimePicker
                value={endDate}
                mode="date"
                display="spinner"
                onChange={(event, date) => {
                  setShowEndPicker(false);
                  if (date) setEndDate(date);
                }}
              />
            )}

            <View style={{flexDirection: 'row', marginTop: 20}}>
              <Button title="Apply" onPress={() => handleDateFilter()} />
              <View style={{width: 10}} />
              <Button
                title="Cancel"
                onPress={() => setModalVisible(false)}
                color="red"
              />
            </View>
          </View>
        </View>
      </Modal>
      {reportDetailLoading && <Loader loader={reportDetailLoading} />}
    </View>
  );
};

export default ExcelViewer;
