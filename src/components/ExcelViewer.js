import React, {useState, useEffect, useRef, useMemo, useCallback} from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/Feather';
import moment from 'moment';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import XLSX from 'xlsx';
import Share from 'react-native-share';
import Orientation from 'react-native-orientation-locker';

import {
  showReportDetails,
  showTrueLedgerReportDetails,
} from '../redux/Slicers/reportlistSlicer';
const {height} = Dimensions.get('window');
export default function ExcelViewer() {
  const route = useRoute();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const [reportDataDetails, setReportDataDetails] = useState([]);
  const [InactiveLedgerParties, setInactiveLedgerParties] = useState([]);
  const [tableWidth, setTableWidth] = useState(null);

  const {reportData} = useSelector(state => state.reportData);
  const {selectedOption, startDate, endDate, selectedPartyName} = route.params;

  useEffect(() => {
    Orientation.lockToLandscape();
    return () => Orientation.lockToPortrait();
  }, []);

  useEffect(() => {
    if (reportData?.data?.length) {
      setReportDataDetails(prev =>
        JSON.stringify(prev) !== JSON.stringify(reportData) ? reportData : prev,
      );
    }
  }, [reportData]);

  const inactiveTransactions = useMemo(() => {
    if (!reportDataDetails?.data?.length) return [];

    return reportDataDetails.data
      .slice(0, -1)
      .filter(party => party.IsLedger === 'false')
      .map(party => ({ID: party.TransactionID}));
  }, [reportDataDetails]);

  useEffect(() => {
    const newStr = JSON.stringify(inactiveTransactions);
    const prevStr = JSON.stringify(InactiveLedgerParties);
    if (newStr !== prevStr) setInactiveLedgerParties(inactiveTransactions);
  }, [inactiveTransactions]);

  const handleDeleteInactiveParties = useCallback(() => {
    if (InactiveLedgerParties.length === 0) {
      Alert.alert(
        'No Inactive Ledgers',
        'There are no inactive ledgers available to delete.',
        [{text: 'OK'}],
      );
      return;
    }

    Alert.alert(
      'Are you sure?',
      'Do you really want to delete the inactive ledger?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'OK',
          onPress: () => {
            dispatch(showTrueLedgerReportDetails(InactiveLedgerParties)).then(
              res => {
                if (res?.payload?.data?.response?.IsSuccess) {
                  dispatch(
                    showReportDetails({type: 'day', startDate, endDate}),
                  );
                } else {
                  Alert.alert('Failed', 'Failed to delete parties.');
                }
              },
            );
          },
        },
      ],
      {cancelable: true},
    );
  }, [InactiveLedgerParties, dispatch, startDate, endDate]);

  const exportableData = useMemo(() => {
    if (!reportDataDetails?.data?.length) return [];

    return reportDataDetails.data.map((item, index, arr) => {
      if (index === arr.length - 1) {
        return {
          [selectedOption === 'party' ? 'Date' : 'Party']: 'Total Balance',
          Receive: item.Received,
          Expense: item.Expenses,
          Balance: item.Balance,
          Remarks: item.Remarks || '',
        };
      }

      return {
        [selectedOption === 'party' ? 'Date' : 'Party']:
          selectedOption === 'party' ? item.SelfDate : item.PartyName,
        Receive: item.Received,
        Expense: item.Expenses,
        Balance: item.Balance,
        Remarks: item.Remarks || '',
      };
    });
  }, [reportDataDetails, selectedOption]);

  const exportToExcel = useCallback(async () => {
    if (!exportableData?.length || exportableData.length <= 1) {
      Alert.alert('No data to export');
      return;
    }

    const headers =
      selectedOption === 'party'
        ? ['Date', 'Receive', 'Expense', 'Balance', 'Remarks']
        : ['Party', 'Receive', 'Expense', 'Balance', 'Remarks'];

    const ws = XLSX.utils.json_to_sheet(exportableData, {header: headers});
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ledger');

    const wbout = XLSX.write(wb, {type: 'base64', bookType: 'xlsx'});
    const path = `${RNFS.DocumentDirectoryPath}/LedgerData.xlsx`;

    await RNFS.writeFile(path, wbout, 'base64');

    try {
      await Share.open({
        url: `file://${path}`,
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        message: 'Sharing Ledger Data',
      });
    } catch (error) {
      // console.log('Share error:', error);
    }
  }, [exportableData, selectedOption]);

  useEffect(() => {
    if (tableWidth == null) {
      setTableWidth(height);
    }
  }, [height]);

  // UI section below remains the same except now using memoized props and handlers
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon1
            name="arrow-back"
            size={20}
            color="#333"
            style={{marginRight: 8}}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterBtn} onPress={exportToExcel}>
          <Text>
            <Icon name="share-square-o" size={20} color="#333" />
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.middleBar}>
        {reportDataDetails?.data?.length > 1 && (
          <>
            <Text style={styles.middleBarText}>
              {selectedOption === 'party'
                ? `Party-Wise Report`
                : `Day-Wise Report`}
            </Text>
            <Text style={styles.vendorText}>
              {selectedOption === 'party'
                ? `Showing Report Of ${selectedPartyName || 'Party'}`
                : `Showing Report from ${moment(startDate).format(
                    'DD/MM/YYYY',
                  )} to ${moment(endDate).format('DD/MM/YYYY')}`}
            </Text>
          </>
        )}
      </View>
      {console.log('height', height)}
      <ScrollView>
        {reportDataDetails?.data?.length > 1 ? (
          <ScrollView horizontal>
            <View style={{width: tableWidth}}>
              <View style={[styles.row, styles.header]}>
                <Text style={styles.cell}>
                  {selectedOption === 'party' ? 'Date' : 'Party'}
                </Text>
                <Text style={styles.cell}>Receive</Text>
                <Text style={styles.cell}>Expense</Text>
                <Text style={styles.cell}>Balance</Text>
                <Text style={styles.cell}>Remarks</Text>
              </View>

              {reportDataDetails.data.slice(0, -1).map((item, index) => {
                const rowValues = [
                  selectedOption === 'party'
                    ? moment(item.SelfDate, 'YYYY/MM/DD').format('DD/MM/YYYY')
                    : item.PartyName,
                  item.Received,
                  item.Expenses,
                  item.Balance,
                  item.Remarks,
                ];

                return (
                  <View
                    key={index}
                    style={[
                      styles.row,
                      index % 2 === 0 ? styles.evenRow : styles.oddRow,
                    ]}>
                    {rowValues.map((cellData, i) => (
                      <Text
                        key={i}
                        style={[styles.cell, i === 4 && {color: '#333'}]}>
                        {cellData}
                      </Text>
                    ))}
                  </View>
                );
              })}

              <View style={[styles.row, {backgroundColor: '#A53860'}]}>
                <Text style={[styles.cell, {fontWeight: 'bold'}]}>
                  Total Balance
                </Text>
                <Text style={styles.cell}>
                  {reportDataDetails.data.at(-1).Received}
                </Text>
                <Text style={styles.cell}>
                  {reportDataDetails.data.at(-1).Expenses}
                </Text>
                <Text style={styles.cell}>
                  {reportDataDetails.data.at(-1).Balance}
                </Text>
                <Text style={styles.cell}>
                  {reportDataDetails.data.at(-1).Remarks || ''}
                </Text>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 20,
            }}>
            <Text
              style={{fontSize: 16, fontWeight: '500', textAlign: 'center'}}>
              No Data Recorded
            </Text>
          </View>
        )}

        {selectedOption === 'day' && reportDataDetails?.data?.length > 1 && (
          <TouchableOpacity onPress={handleDeleteInactiveParties}>
            <View style={styles.Ledgercontainer}>
              <Text style={styles.LedgercontainerText}>
                Delete Inactive Ledger
              </Text>
              <Icon2 name="trash-2" size={20} color="red" />
            </View>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

// Assume styles are defined in a separate file or below this.

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  middleBar: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    width: '100%',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  middleBarText: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 17,
    fontWeight: 500,
  },
  backText: {
    fontSize: 16,
    color: '#333',
  },
  vendorText: {
    fontSize: 14,
    fontWeight: 400,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign: 'center',
  },
  filterBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  filterText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  header: {
    borderTopWidth: 1,
    backgroundColor: '#A53860',
  },
  // cell: {
  //   width: 100,
  //   paddingHorizontal: 5,
  //   fontSize: 14,
  //
  // },
  // header: {height: 50, backgroundColor: '#537791'},
  // text: {textAlign: 'center', fontWeight: '100'},
  // dataWrapper: {marginTop: -1},
  // row: {height: 40, backgroundColor: '#E7E6E1'},
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
  },

  evenRow: {
    backgroundColor: '#F7F6E7', // Light beige
  },

  oddRow: {
    backgroundColor: '#FFFFFF', // White
  },

  cell: {
    paddingHorizontal: 10,
    width: 100,
    textAlign: 'center',
    color: '#333',
  },
  cell1: {
    color: '#333',
  },

  noDataText: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  Ledgercontainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  LedgercontainerText: {
    fontSize: 15,
    fontWeight: 500,
  },
});
