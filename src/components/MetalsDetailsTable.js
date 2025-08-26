import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const MetalsDetailsTable = ({metalData}) => {
  // Calculate totals
  const totalPcs = metalData.reduce(
    (sum, item) => sum + Number(item.Pcs || 0),
    0,
  );
  const totalGross = metalData.reduce(
    (sum, item) => sum + Number(item.GrossWeight || 0),
    0,
  );
  const totalNetWeight = metalData.reduce(
    (sum, item) => sum + Number(item.NetWeight || 0),
    0,
  );
  const totalFineWeight = metalData.reduce(
    (sum, item) => sum + Number(item.FinalFineWeight || 0),
    0,
  );

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={[styles.row, styles.header]}>
        <Text style={[styles.cell, styles.headerText]}>Metal Type</Text>
        <Text style={[styles.cell, styles.headerText]}>Total PCS</Text>
        <Text style={[styles.cell, styles.headerText]}>Total Gross</Text>
        <Text style={[styles.cell, styles.headerText]}>Net Weight</Text>
        <Text style={[styles.cell, styles.headerText]}>Fine Weight</Text>
      </View>

      {/* Data Rows */}
      {metalData.map((item, index) => (
        <View key={index} style={styles.row}>
          <Text style={[styles.cell, styles.metalType]}>{item.Metal}</Text>
          <Text style={styles.cell}>{item.Pcs || 0}</Text>
          <Text style={styles.cell}>
            {Number(item.GrossWeight || 0).toFixed(3)}
          </Text>
          <Text style={styles.cell}>
            {Number(item.NetWeight || 0).toFixed(3)}
          </Text>
          <Text style={styles.cell}>
            {Number(item.FinalFineWeight || 0).toFixed(3)}
          </Text>
        </View>
      ))}

      {/* Total Row */}
      <View style={[styles.row, styles.totalRow]}>
        <Text style={[styles.cell, styles.totalText]}>Total</Text>
        <Text style={[styles.cell, styles.totalText]}>{totalPcs}</Text>
        <Text style={[styles.cell, styles.totalText]}>
          {totalGross.toFixed(3)}
        </Text>
        <Text style={[styles.cell, styles.totalText]}>
          {totalNetWeight.toFixed(3)}
        </Text>
        <Text style={[styles.cell, styles.totalText]}>
          {totalFineWeight.toFixed(3)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#cce5ff',
  },
  totalRow: {
    backgroundColor: '#d1e7dd',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  metalType: {
    fontWeight: 'bold',
  },
  headerText: {
    fontWeight: 'bold',
    color: '#333',
  },
  totalText: {
    fontWeight: 'bold',
  },
});

export default MetalsDetailsTable;
