import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  StatusBar,
  Dimensions,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getOrders } from '../../redux/Slicers/MyOrderSlicer';
import { useDispatch } from 'react-redux';
import Header from '../../components/Header/Header';

const { width } = Dimensions.get('window');

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  // Fetch orders function
  const fetchOrders = () => {
    setLoading(true);
    dispatch(getOrders())
      .then(response => {
        console.log('Orders fetched successfully:', response);
        if (response?.payload?.IsSuccess) {
          setOrders(response.payload.body || []);
        } else if (response?.IsSuccess) {
          setOrders(response.body || []);
        }
        setLoading(false);
        setRefreshing(false);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
        setLoading(false);
        setRefreshing(false);
      });
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, []);

  // Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Render each order item
  const renderOrderItem = ({ item }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderNumber}>{item.OrderNo}</Text>
          <Text style={styles.orderDate}>{formatDate(item.CreatedOn)}</Text>
        </View>
        <View style={[styles.statusBadge,
        { backgroundColor: item.Status === 'created' ? '#E3F2FD' : '#E8F5E9' }]}>
          <Text style={[styles.statusText,
          { color: item.Status === 'created' ? '#1976D2' : '#388E3C' }]}>
            {item.Status.charAt(0).toUpperCase() + item.Status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.courseInfo}>
        {/* {item.Images ? (
          <Image
            source={{ uri: item.Images }}
            style={styles.courseImage}
            onError={() => console.log('Image failed to load')}
          />
        ) : (
          <View style={[styles.courseImage, styles.placeholderImage]}>
            <Icon name="image" size={24} color="#ccc" />
          </View>
        )} */}
        <View style={styles.courseDetails}>
          <Text style={styles.courseName}>{item.CourseName}</Text>
          <Text style={styles.courseDuration}>Duration: {item.Duration} days</Text>
          <Text style={styles.daysLeft}>{item.DaysLeft} days left</Text>
        </View>
      </View>

      <View style={styles.orderFooter}>
        <Text style={styles.courseFee}>₹{item.CourseFees.toFixed(2)}</Text>
        {/* <TouchableOpacity style={styles.viewDetailsBtn}>
          <Text style={styles.viewDetailsText}>View Details</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />
      <Header title={'My Orders'} />

      {/* Orders List with Pull-to-Refresh */}
      <FlatList
        data={orders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.ID.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4CAF50']}
            tintColor={'#4CAF50'}
          />
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyContainer}>
              <Icon name="receipt" size={60} color="#ccc" />
              <Text style={styles.emptyText}>No orders found</Text>
              <TouchableOpacity onPress={onRefresh} style={styles.retryButton}>
                <Text style={styles.retryText}>Tap to refresh</Text>
              </TouchableOpacity>
            </View>
          )
        }
        ListFooterComponent={
          loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#4CAF50" />
              <Text style={styles.loadingText}>Loading orders...</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderDate: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  courseInfo: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  courseImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  courseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  courseDuration: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  daysLeft: {
    fontSize: 14,
    color: '#E65100',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courseFee: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewDetailsBtn: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  viewDetailsText: {
    color: 'white',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: 'white',
    fontWeight: '500',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
});

export default MyOrders;