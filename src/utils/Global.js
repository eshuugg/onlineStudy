import React, { useState, useContext } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { widthPercentageToDP as w, heightPercentageToDP as h } from 'react-native-responsive-screen';
import { Loader as LoaderImage, LoaderRound } from '../components/Images';
import GlobalContext from '../context/GlobalContext';

const Global = () => {
  const [loader, setLoader] = useState(false);
  const context = useContext(GlobalContext);

  const showLoader = () => {
    setLoader(true);
  };

  const hideLoader = () => {
    setTimeout(() => {
      setLoader(false);
    }, 100);
  };

  const setContact = (data) => {
    try {
      return context.setContact(data);
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const clearContact = () => {
    try {
      return context.clearContact();
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const getContact = () => {
    try {
      return context.getContact();
    } catch (ex) {
      console.log(ex);
      return false;
    }
  };

  const Loader = () => {
    return loader ? <LoaderComp style={style.Loader} /> : null;
  };

  return (
    <View>
      {Loader()}
      {/* Other components or logic can be added here */}
    </View>
  );
};

const LoaderComp = (props) => {
  return (
    <View style={props.style}>
      <Image source={LoaderRound} style={style.GM} />
      <Image source={LoaderImage} style={style.LD} />
    </View>
  );
};

const style = StyleSheet.create({
  Loader: {
    display: 'flex',
    width: '100%',
    flex: 1,
    height: h('100%'),
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 999999999999999,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  LD: {
    position: 'relative',
    top: -80,
    height: 40,
    zIndex: 999,
  },
  GM: {
    position: 'relative',
    width: 90,
    resizeMode: 'contain',
    zIndex: 999,
  },
});

export default Global;
