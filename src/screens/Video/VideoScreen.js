import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Dimensions 
} from 'react-native';
import Header from '../../components/Header/Header';
;

const {width, height} = Dimensions.get('window');

export default function VideoScreen() {
  // Sample data for videos
  const videos = [
    {
      id: '1',
      title: 'Video-1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '2',
      title: 'Video-2',
      description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '3',
      title: 'Video-3',
      description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '4',
      title: 'Video-4',
      description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '5',
      title: 'Video-5',
      description: 'Short description for video 5.',
      thumbnail: require('../../asset/education.png'),
    },
    {
      id: '6',
      title: 'Video-6',
      description: 'Short description for video 6.',
      thumbnail: require('../../asset/education.png'),
    },
  ];

  // Render function for each video item
  const renderVideoItem = ({ item }) => (
    <TouchableOpacity style={styles.videoItem}>
      <Image source={item.thumbnail} style={styles.thumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
        {/* Description removed for a cleaner, compact grid */}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <Header/>
      
      {/* Banner */}
      <View style={styles.banner}>
        <Image
          source={require('../../asset/education.png')}
          style={styles.bannerImage}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>WBP Constable</Text>

      {/* Video List */}
      <FlatList
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.videoList}
        showsVerticalScrollIndicator={false}
        numColumns={3} // Display 3 columns
        columnWrapperStyle={styles.row} // Style for each row
        ListFooterComponent={<View style={{height: height * 0.05}} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  banner: {
    width: '100%',
    height: height * 0.22, // 22% of screen height
    marginBottom: height * 0.13, // 13% of screen height
  },
  bannerImage: {
    width: '100%',
    height: '150%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: width * 0.055, // 5.5% of screen width
    fontWeight: 'bold',
    marginHorizontal: width * 0.06, // 6% of screen width
    marginBottom: height * 0.02, // 3% of screen height
    color: '#333',
  },
  videoList: {
    paddingHorizontal: width * 0.04, // 4% of screen width
  },
  row: {
    justifyContent: 'space-between', // Distribute items evenly
    marginBottom: height * 0.02, // Spacing between rows
  },
  videoItem: {
    width: (width - (width * 0.08) - (width * 0.04)) / 3, // Calculate width for 3 items with padding
    aspectRatio: 1, // Make item square for better visual
    marginBottom: height * 0.01, // Spacing between items within a row
    backgroundColor: '#f8f9fa',
    borderRadius: width * 0.02,
    padding: width * 0.02,
    elevation: 2,
    alignItems: 'center', // Center content horizontally
  },
  thumbnail: {
    width: '100%', // Take full width of videoItem
    height: '70%', // Adjust height to fit title below
    borderRadius: width * 0.015,
    resizeMode: 'cover',
  },
  videoInfo: {
    marginTop: height * 0.005, // Small space between thumbnail and title
    alignItems: 'center', // Center title below thumbnail
  },
  videoTitle: {
    fontSize: width * 0.035, // Adjust font size for smaller space
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  // videoDescription styles are no longer needed
});