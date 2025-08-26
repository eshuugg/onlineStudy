import React from 'react';
import {View, SafeAreaView, StatusBar} from 'react-native';
import Header from '../components/Header/Header';

const Layout = props => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar backgroundColor="#000" hidden={false} />
      <View
        style={{
          // backgroundColor: '#f8f8f8',
          backgroundColor:"#fff" , 
          flex: 1,
          width: '100%',
        }}>
        <Header drawer={props.drawer} title={props.title} {...props} />
        {props.children}
      </View>
    </SafeAreaView>
  );
};

export default Layout;
