import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Octicons from 'react-native-vector-icons/Octicons';
import { screen, colors } from '../Design';
import * as UI from '../UI';
import { createNavigationContainerRef } from '@react-navigation/native';

//Screens
// import Color from '../Color';
// import Party from '../../screens/AddParty';
// import AddEntry from '../../screens/AddEntry';


import Dashboard from '../../screens/Dashboard/Dashboard';
import FreeLiveClass from '../../screens/FreeClass/FreeLiveClass';
import FreeVideoClass from '../../screens/FreeClass/FreeVideo';
import FreeStudyMaterial from '../../screens/FreeClass/FreeStudyMaterial';

const Drawer = createDrawerNavigator();

const navigationRef = createNavigationContainerRef();

export function navigate(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

export const PageNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Dashboard"
      drawerType="front"
      drawerStyle={{ flex: 1, width: 250 }}
      drawerContent={props => <Nav {...props} />}>
      <Drawer.Screen name="Dashboard" component={Dashboard} options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen name="FreeLiveClass" component={FreeLiveClass} options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen name="FreeVideoClass" component={FreeVideoClass} options={{ unmountOnBlur: true }}
      />
      <Drawer.Screen name="FreeStudyMaterial" component={FreeStudyMaterial} options={{ unmountOnBlur: true }}
      />
    </Drawer.Navigator>
  );
};

const Nav = ({ navigation }) => {
  const [userDetails, setUserDetails] = useState({
    FIRSTNAME: '',
    LASTNAME: '',
    EMAIL: '',
    ROLE: '',
    Designation: '',
  });

  const [isExpandedMenu, setIsExpandedMenu] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await AsyncStorage.getItem('userDta');
      const result = JSON.parse(res);
      console.log('result', result);
      if (result != null) {
        setUserDetails({
          FIRSTNAME: result.FirstName,
          // LASTNAME: result.LASTNAME,
          EMAIL: result.Email,
          ROLE: result.ROLE,
          Designation: result.Type,
        });
      } else {
        setUserDetails({
          FIRSTNAME: '',
          LASTNAME: '',
          EMAIL: '',
          ROLE: '',
          Designation: '',
        });
      }
    };

    fetchUserDetails();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      'Alert!',
      'You are about to log out. Do you wish to continue?',
      [
        {
          text: 'Yes',
          onPress: async () => {
            await AsyncStorage.removeItem('userDta');
            try {
              navigation.replace('Login');
            } catch (Ex) {
              navigation.navigate('Login');
            }
          },
        },
        { text: 'No' },
      ],
      { cancelable: false },
    );
  };

  return (
    <UI.Div style={pageNavigationStyle.container}>
      <ScrollView>
        <UI.Div style={pageNavigationStyle.profileContainer}>
          <UI.Div style={pageNavigationStyle.userImageBox}>
            <Image
              source={require('../../asset/avtar.png')}
              style={{ width: 70, height: 70, borderRadius: 25 }}
            />
          </UI.Div>
          <UI.Text style={pageNavigationStyle.userName}>
            {userDetails.FIRSTNAME}
          </UI.Text>
          <UI.Div style={pageNavigationStyle.userDetailRow}>
            <MaterialIcons
              name="email"
              size={18}
              style={pageNavigationStyle.iconStyle}
            />
            <UI.Text style={pageNavigationStyle.userEmail}>
              {userDetails.EMAIL}
            </UI.Text>
          </UI.Div>
          <UI.Div style={pageNavigationStyle.userDetailRow}>
            <AntDesign
              name="user"
              size={18}
              style={pageNavigationStyle.iconStyle}
            />
            {/* <UI.Text style={pageNavigationStyle.userRole}>
              {userDetails.ROLE === 'SU' ? 'Management' : 'Party'}
            </UI.Text> */}
          </UI.Div>
        </UI.Div>

        <UI.Div style={pageNavigationStyle.menuSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}>
            <UI.Div style={pageNavigationStyle.menuItem}>
              <AntDesign
                name="home"
                size={20}
                color="#000"
              // style={pageNavigationStyle.menuItemIcon}
              />
              <UI.Text style={pageNavigationStyle.menuItemText}>
                Dashboard
              </UI.Text>
            </UI.Div>
          </TouchableOpacity>
        </UI.Div>
        <UI.Div style={pageNavigationStyle.menuSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}>
            <UI.Div style={pageNavigationStyle.menuItem}>
              <MaterialIcons
                name="airplay"
                size={20}
                color="#000"
              // style={pageNavigationStyle.menuItemIcon}
              />
              <UI.Text style={pageNavigationStyle.menuItemText}>
                Purchase Live Class
              </UI.Text>
            </UI.Div>
          </TouchableOpacity>
        </UI.Div>
        <UI.Div style={pageNavigationStyle.menuSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}>
            <UI.Div style={pageNavigationStyle.menuItem}>
              <MaterialIcons
                name="smart-display"
                size={20}
                color="#000"
              // style={pageNavigationStyle.menuItemIcon}
              />
              <UI.Text style={pageNavigationStyle.menuItemText}>
                Purchase Video Class
              </UI.Text>
            </UI.Div>
          </TouchableOpacity>
        </UI.Div>
        <UI.Div style={pageNavigationStyle.menuSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}>
            <UI.Div style={pageNavigationStyle.menuItem}>
              <AntDesign
                name="book"
                size={20}
                color="#000"
              // style={pageNavigationStyle.menuItemIcon}
              />
              <UI.Text style={pageNavigationStyle.menuItemText}>
                Purchase Study Material
              </UI.Text>
            </UI.Div>
          </TouchableOpacity>
        </UI.Div>
        <UI.Div style={pageNavigationStyle.menuSection}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Dashboard')}>
            <UI.Div style={pageNavigationStyle.menuItem}>
              <AntDesign
                name="book"
                size={20}
                color="#000"
              // style={pageNavigationStyle.menuItemIcon}
              />
              <UI.Text style={pageNavigationStyle.menuItemText}>
                My Orders
              </UI.Text>
            </UI.Div>
          </TouchableOpacity>
        </UI.Div>
      </ScrollView>

      <UI.Div style={pageNavigationStyle.footer}>
        <TouchableOpacity activeOpacity={0.8} onPress={handleLogout}>
          <UI.Div style={pageNavigationStyle.logoutButton}>
            <SimpleLineIcons name="logout" size={20} color="#fff" />
            <UI.Text style={pageNavigationStyle.logoutButtonText}>Logout</UI.Text>
          </UI.Div>
        </TouchableOpacity>
      </UI.Div>

    </UI.Div>
  );
};

const pageNavigationStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // backgroundColor:"fff" ,
    // paddingVertical: 20,
  },

  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#1a2942',
    // borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },

  userImageBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    // backgroundColor: '#c2dfaf',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  userInitial: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
  },

  userName: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },

  userDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  iconStyle: {
    marginRight: 10,
    color: '#c2dfaf',
  },

  userEmail: {
    fontSize: 14,
    color: '#fff',
  },

  userRole: {
    fontSize: 14,
    color: '#555',
  },

  menuSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    // backgroundColor: Color.lightPurple,
    // backgroundColor: '#fff',
    // borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    // elevation: 3,
  },

  menuItemText: {
    flex: 1,
    color: '#000',
    fontSize: 15,
    fontWeight: 600,
    marginLeft: 15,
  },
  arrowIcon: {
    marginLeft: 'auto',
  },
  subMenuItemText: {
    paddingVertical: 8,
    fontSize: 14,
    color: '#444',
  },
  subMenuContainer: {
    // marginLeft: 20,
    marginTop: 1,
    backgroundColor: '#ccc',
    borderRadius: 8,
  },

  footer: {
    paddingHorizontal: 20,
    // paddingVertical: 10,
    // backgroundColor: '#fff',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // elevation: 5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a2942',
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 10,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  logoutButtonText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },

});

export default Nav;
