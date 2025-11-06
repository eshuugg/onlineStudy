import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    StatusBar,
    Dimensions,
    TouchableOpacity,
    Modal,
    RefreshControl,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
// import { WebView } from 'react-native-webview';
import YoutubePlayer from "react-native-youtube-iframe";

import { useDispatch } from 'react-redux';
import { getCourses } from '../../redux/Slicers/MyCourses';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MyCourses = (props) => {
    const { courseDetails } = props.route.params || {};
    const [activeTab, setActiveTab] = useState('study');
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    // Sample data for demonstration
    const [studyMaterial, setStudyMaterial] = useState([]);

    const [demoClass, setDemoClass] = useState([]);

    const [liveClass, setLiveClass] = useState([]);

    const dispatch = useDispatch(); // Placeholder for Redux dispatch

    const navigation = useNavigation();

    console.log('courseDetails', courseDetails)

    // Fetch study material method
    const fetchData = async () => {
        try {
            setRefreshing(true);
            dispatch(getCourses(courseDetails?.ID)).then(res => {
                console.log('res', res)
                if (res?.IsSuccess) {
                    setStudyMaterial(res?.body?.StudyMaterialList || []);
                    setDemoClass(res?.body?.VideoList || []);
                    setLiveClass(res?.body?.LiveClass || []);
                }
            }); // Replace '1' with actual user/course ID as needed
            setTimeout(() => {
                setRefreshing(false);
                setLoading(false);
            }, 1000);
        } catch (error) {
            console.error('Error fetching study material:', error);
            setRefreshing(false);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [props]);

    const onRefresh = useCallback(() => {
        fetchData();
    }, [fetchData]);

    // Extract YouTube video ID
    const extractVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Render function for study material items
    const renderStudyMaterial = ({ item, index }) => {
        console.log('item', item);

        // Extract video ID (if Type === 2)
        const videoId = item?.Type === 2 ? extractVideoId(item?.Material) : null;
        const thumbnailUrl =
            videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

        const handlePress = () => {
            if (item?.Type === 1) {
                // 📄 Type 1: PDF
                const url = item?.Material;
                if (!url) return;

                const pdfUrl = url.startsWith('http')
                    ? url
                    : `https://app.careercarrier.org${url}`;

                navigation.navigate('PdfViewer', { pdfUrl });
            } else if (item?.Type === 2 && videoId) {
                // 🎥 Type 2: Video
                setSelectedVideo(videoId);
                setModalVisible(true);
            } else {
                console.warn('Unknown Type or invalid data:', item);
            }
        };

        return (
            <TouchableOpacity style={styles.demoClassItem} onPress={handlePress}>
                <View style={styles.thumbnailContainer}>
                    {item?.Type === 2 ? (
                        <>
                            {thumbnailUrl ? (
                                <Image
                                    source={{ uri: thumbnailUrl }}
                                    style={styles.demoThumbnail}
                                />
                            ) : (
                                <Image
                                    source={require('../../asset/online.png')}
                                    style={styles.demoThumbnail}
                                />
                            )}
                            <View style={styles.playIconContainer}>
                                <Text style={styles.playIcon}>▶</Text>
                            </View>
                        </>
                    ) : (
                        <Image
                            source={require('../../asset/material.png')}
                            style={styles.demoThumbnail}
                        />
                    )}
                </View>

                <Text style={styles.demoTitle} numberOfLines={2}>
                    {item.CourseName || `Material ${index + 1}`}
                </Text>
            </TouchableOpacity>
        );
    };


    // Render function for video items
    const renderVideoItem = ({ item, index }) => {
        const videoId = extractVideoId(item?.Classlink);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

        return (
            <TouchableOpacity
                style={styles.demoClassItem}
                onPress={() => {
                    if (videoId) {
                        setSelectedVideo(videoId);
                        setModalVisible(true);
                    }
                }}>
                {thumbnailUrl ? (
                    <Image source={{ uri: thumbnailUrl }} style={styles.demoThumbnail} />
                ) : (
                    <Image
                        source={require('../../asset/online.png')}
                        style={styles.demoThumbnail}
                    />
                )}
                <View style={styles.playIconContainer}>
                    <Text style={styles.playIcon}>▶</Text>
                </View>
                <Text style={styles.demoTitle} numberOfLines={2}>
                    {item.CourseName || `Video ${index + 1}`}
                </Text>
            </TouchableOpacity>
        );
    };

    // Render function for live class items
    const renderLiveClass = ({ item, index }) => {
        const videoId = extractVideoId(item?.ClassLink);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : null;

        return (
            <TouchableOpacity
                style={styles.demoClassItem}
                onPress={() => {
                    if (videoId) {
                        setSelectedVideo(videoId);
                        setModalVisible(true);
                    }
                }}>
                {thumbnailUrl ? (
                    <Image source={{ uri: thumbnailUrl }} style={styles.demoThumbnail} />
                ) : (
                    <Image
                        source={require('../../asset/online.png')}
                        style={styles.demoThumbnail}
                    />
                )}
                <View style={styles.liveBadge}>
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
                <View style={styles.playIconContainer}>
                    <Text style={styles.playIcon}>▶</Text>
                </View>
                <Text style={styles.demoTitle} numberOfLines={2}>
                    {item.CourseName || `Live Class ${index + 1}`}
                </Text>
            </TouchableOpacity>
        );
    };

    // Video player modal
    const renderVideoModal = () => (
        <Modal
            visible={modalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Icon name="close" size={24} color="#fff" />
                    </TouchableOpacity>

                    {selectedVideo && (
                        <YoutubePlayer
                            height={300}
                            play={true}
                            videoId={selectedVideo}
                            webViewStyle={{ opacity: 0.99 }}
                            initialPlayerParams={{
                                controls: true,         // show basic play/pause controls
                                modestbranding: true,   // hides big YouTube logo
                                rel: false,             // hides "related videos" at end
                                showinfo: false,        // hides video title (deprecated but still helps)
                                fs: true,               // allows fullscreen toggle
                                loop: false,            // disable looping
                                autoplay: true,         // starts automatically
                                iv_load_policy: 3,      // hides annotations / cards
                                playsinline: true,      // prevents fullscreen by default
                            }}
                            onError={(e) => console.log("YouTube Error", e)}
                        />

                    )}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#4CAF50" barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Courses</Text>
                <View style={styles.courseInfo}>
                    {!courseDetails?.Images ? <Image
                        source={require('../../asset/test.png')}
                        style={styles.courseDummyImage}
                    /> : <Image
                        source={{ uri: `https://app.careercarrier.org${courseDetails?.Images}` }}
                        style={styles.courseImage}
                    />}
                    <View style={styles.courseDetails}>
                        <Text style={styles.courseName}>{courseDetails?.Name}</Text>
                        {/* <Text style={styles.courseProgress}>5 of 12 lessons completed</Text> */}
                    </View>
                </View>
            </View>

            {/* Tabs */}
            <View style={styles.tabsContainer}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'study' && styles.activeTab]}
                    onPress={() => setActiveTab('study')}
                >
                    <Text style={[styles.tabText, activeTab === 'study' && styles.activeTabText]}>
                        Study Materials
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                    onPress={() => setActiveTab('videos')}
                >
                    <Text style={[styles.tabText, activeTab === 'videos' && styles.activeTabText]}>
                        Videos
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'live' && styles.activeTab]}
                    onPress={() => setActiveTab('live')}
                >
                    <Text style={[styles.tabText, activeTab === 'live' && styles.activeTabText]}>
                        Live Classes
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Content based on active tab */}
            {activeTab === 'study' && (
                <FlatList
                    data={studyMaterial}
                    renderItem={renderStudyMaterial}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
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
                            <View style={styles.emptyState}>
                                <Icon name="description" size={60} color="#ccc" />
                                <Text style={styles.emptyStateText}>No study materials available</Text>
                            </View>
                        )
                    }
                />
            )}

            {activeTab === 'videos' && (
                <FlatList
                    data={demoClass}
                    renderItem={renderVideoItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
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
                            <View style={styles.emptyState}>
                                <Icon name="videocam" size={60} color="#ccc" />
                                <Text style={styles.emptyStateText}>No videos available yet</Text>
                            </View>
                        )
                    }
                />
            )}

            {activeTab === 'live' && (
                <FlatList
                    data={liveClass}
                    renderItem={renderLiveClass}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
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
                            <View style={styles.emptyState}>
                                <Icon name="live-tv" size={60} color="#ccc" />
                                <Text style={styles.emptyStateText}>No live classes scheduled</Text>
                            </View>
                        )
                    }
                />
            )}

            {/* Loading indicator */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4CAF50" />
                    <Text style={styles.loadingText}>Loading content...</Text>
                </View>
            )}

            {/* Video Player Modal */}
            {renderVideoModal()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    header: {
        backgroundColor: '#1a2942',
        padding: 16,
        paddingTop: 50,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 16,
    },
    courseInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    courseDummyImage: {
        width: 70,
        height: 70,
        // borderRadius: 20,
        // resizeMode: 'cover',
        // backgroundColor: '#eee',
    },
    courseImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        resizeMode: 'cover',
        // backgroundColor: '#eee',
    },
    courseDetails: {
        marginLeft: 12,
        flex: 1,
    },
    courseName: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    courseProgress: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tab: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: '#1a2942',
    },
    tabText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#1a2942',
        fontWeight: 'bold',
    },
    listContainer: {
        padding: 16,
        paddingBottom: 32,
    },
    demoClassItem: {
        width: (width - 40) / 2,
        marginBottom: 16,
        marginRight: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    thumbnailContainer: {
        position: 'relative',
    },
    demoThumbnail: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    pdfIconContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderRadius: 8,
    },
    pdfIcon: {
        fontSize: 32,
    },
    playIconContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -15 }, { translateY: -15 }],
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 30,
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        color: 'white',
        fontSize: 14,
        marginLeft: 2,
    },
    liveBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'red',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4,
    },
    liveText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    demoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#666',
        marginTop: 12,
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
    },
    loadingText: {
        marginTop: 12,
        color: '#666',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    videoPlayer: {
        width: '100%',
        height: 300,
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 20,
        padding: 8,
    },
});

export default MyCourses;