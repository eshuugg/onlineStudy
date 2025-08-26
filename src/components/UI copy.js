import React, {useState, Component} from 'react';
import {
  Animated,
  View,
  TouchableOpacity,
  StyleSheet,
  Text as TextHelper,
  TextInput,
} from 'react-native';
import {styles, colors, fonts, screen} from './Design';
import LinearGradient from 'react-native-linear-gradient';
import Color from './Color';

export const Button = props => {
  return (
    <TouchableOpacity
      style={[
        props.red != undefined ? styles.bgRed : styles.bgBlack,
        props.ml != undefined ? {marginLeft: props.ml} : null,
        props.mr != undefined ? {marginRight: props.mr} : null,
        props.mb != undefined ? {marginBottom: props.mb} : null,
        props.mt != undefined ? {marginTop: props.mt} : null,
        props.r != undefined ? {borderRadius: props.r} : null,
        props.width != undefined ? {width: props.width} : null,
        props.maxWidth != undefined ? {maxWidth: props.maxWidth} : null,
        props.p != undefined ? {padding: props.p} : null,
        props.pl != undefined ? {paddingLeft: props.pl} : null,
        props.pr != undefined ? {paddingRight: props.pr} : null,
        props.pb != undefined ? {paddingBottom: props.pb} : null,
        props.pt != undefined ? {paddingTop: props.pt} : null,
        props.disabled == true ? {opacity: 0.7} : null,
        props.style,
      ]}
      onPress={props.onPress != undefined ? async () => props.onPress() : null}
      activeOpacity={props.o != undefined ? props.o : 0.8}
      disabled={props.disabled != undefined ? props.disabled : false}>
      {props.green != undefined ? (
        <LinearGradient
          start={{x: 0, y: 0.8}}
          locations={[0.1, 0.9]}
          end={{x: 0.8, y: 0}}
          colors={[Color.lightPurple, Color.lightPurple]}
          // colors={[colors.darkPurple, '#33aeea']}
          style={styleButton.gradient}>
          <Text color={colors.white} size={18}>
            {props.text}
          </Text>
        </LinearGradient>
      ) : (
        <LinearGradient
          start={{x: 0, y: 0.8}}
          locations={[0.1, 0.9]}
          end={{x: 0.8, y: 0}}
          colors={[Color.lightPurple, Color.lightPurple]}
          // colors={[colors.darkPurple, colors.darkblue]}
          style={styleButton.gradient}>
          <Text color={colors.white} size={18}>
            {props.text}
          </Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};
const styleButton = StyleSheet.create({
  btn: {
    width: '100%',
    padding: 10,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    overflow: 'hidden',
    borderRadius: 50,
    padding: 0,
    paddingBottom: 15,
    paddingTop: 15,
    display: 'flex',
    alignItems: 'center',
  },
});
export const Div = props => {
  return (
    <View
      style={[
        {position: 'relative'},
        props.bg != undefined ? {backgroundColor: props.bg} : null,

        props.ml != undefined ? {marginLeft: props.ml} : null,
        props.mr != undefined ? {marginRight: props.mr} : null,
        props.mb != undefined ? {marginBottom: props.mb} : null,
        props.mt != undefined ? {marginTop: props.mt} : null,

        props.p != undefined ? {padding: props.p} : null,
        props.pl != undefined ? {paddingLeft: props.pl} : null,
        props.pr != undefined ? {paddingRight: props.pr} : null,
        props.pb != undefined ? {paddingBottom: props.pb} : null,
        props.pt != undefined ? {paddingTop: props.pt} : null,

        props.l != undefined ? {left: props.l} : null,
        props.r != undefined ? {right: props.r} : null,
        props.b != undefined ? {bottom: props.b} : null,
        props.t != undefined ? {top: props.t} : null,

        props.o != undefined ? {borderRadius: props.o} : null,

        props.width != undefined ? {width: props.width} : null,
        props.height != undefined ? {height: props.height} : null,

        props.maxheight != undefined ? {maxWidth: props.maxheight} : null,
        props.minheight != undefined ? {minHeight: props.minheight} : null,

        props.minwidth != undefined ? {minWidth: props.minwidth} : null,
        props.maxwidth != undefined ? {maxWidth: props.maxwidth} : null,

        props.style,
      ]}>
      {props.children}
    </View>
  );
};
export const Text = props => {
  return (
    <TextHelper
      style={[
        props.color != undefined ? {color: props.color} : {color: colors.black},
        props.bg != undefined ? {backgroundColor: props.bg} : null,
        props.size != undefined ? {fontSize: props.size} : {fontSize: 15},
        props.font != undefined
          ? {fontFamily: props.font}
          : {fontFamily: fonts.rr},
        props.center != undefined ? {textAlign: 'center'} : null,
        props.right != undefined ? {textAlign: 'right'} : null,
        props.ml != undefined ? {marginLeft: props.ml} : null,
        props.mr != undefined ? {marginRight: props.mr} : null,
        props.mb != undefined ? {marginBottom: props.mb} : null,
        props.mt != undefined ? {marginTop: props.mt} : null,
        props.pl != undefined ? {paddingLeft: props.pl} : null,
        props.pr != undefined ? {paddingRight: props.pr} : null,
        props.pb != undefined ? {paddingBottom: props.pb} : null,
        props.pt != undefined ? {paddingTop: props.pt} : null,
        props.l != undefined ? {lineHeight: props.l} : null,
        props.s != undefined ? {letterSpacing: props.s} : null,
        props.width != undefined ? {width: props.width} : null,
        props.upper != undefined ? {textTransform: 'uppercase'} : null,
        props.bold != undefined ? {fontWeight: 'bold'} : null,
        {position: 'relative'},
        props.l != undefined ? {left: props.l} : null,
        props.r != undefined ? {right: props.r} : null,
        props.b != undefined ? {bottom: props.b} : null,
        props.t != undefined ? {top: props.t} : null,

        props.style,
        styles.maxWidth,
      ]}
      numberOfLines={props.line != undefined ? props.line : null}>
      {props.children}
    </TextHelper>
  );
};

export const Flex = props => {
  return (
    <View
      style={[
        {width: props.size, display: 'flex', position: 'relative'},

        props.bg != undefined ? {backgroundColor: props.bg} : null,

        props.height != undefined ? {height: props.height} : null,

        props.column != undefined
          ? {flexDirection: 'column'}
          : {flexDirection: 'row'},
        props.middle != undefined ? {alignItems: 'center'} : '',
        props.bottom != undefined ? {alignItems: 'flex-end'} : '',
        props.baseline != undefined ? {alignItems: 'baseline'} : '',
        props.stretch != undefined ? {alignItems: 'stretch'} : '',
        props.spaceb != undefined ? {justifyContent: 'space-between'} : '',
        props.spacea != undefined ? {justifyContent: 'space-around'} : '',
        props.end != undefined ? {justifyContent: 'flex-end'} : '',
        props.center != undefined ? {justifyContent: 'center'} : '',
        props.right != undefined ? {justifyContent: 'flex-end'} : '',
        props.cover != undefined ? {minHeight: screen.h('97%')} : '',
        props.full != undefined ? {minHeight: screen.h('91%')} : '',

        props.ml != undefined ? {marginLeft: props.ml} : null,
        props.mr != undefined ? {marginRight: props.mr} : null,
        props.mb != undefined ? {marginBottom: props.mb} : null,
        props.mt != undefined ? {marginTop: props.mt} : null,

        props.l != undefined ? {left: props.l} : null,
        props.r != undefined ? {right: props.r} : null,
        props.b != undefined ? {bottom: props.b} : null,
        props.t != undefined ? {top: props.t} : null,

        props.wrap != undefined ? {flexWrap: 'wrap'} : null,

        props.width != undefined ? {width: props.width} : null,
        props.minwidth != undefined ? {minWidth: props.minwidth} : null,
        props.maxwidth != undefined
          ? {maxWidth: props.maxwidth}
          : {maxWidth: '100%'},

        {padding: 10},
        props.p != undefined ? {padding: props.p} : null,

        props.o != undefined ? {borderRadius: props.o} : null,

        props.pl != undefined ? {paddingLeft: props.pl} : null,
        props.pr != undefined ? {paddingRight: props.pr} : null,
        props.pb != undefined ? {paddingBottom: props.pb} : null,
        props.pt != undefined ? {paddingTop: props.pt} : null,

        props.style != undefined ? props.style : null,
      ]}>
      {props.children}
    </View>
  );
};

export const Container = props => {
  return (
    <View
      style={[styles.container, props.style != undefined ? props.style : null]}>
      {props.children}
    </View>
  );
};
export const Gradient = props => {
  return (
    <LinearGradient
      start={{x: 0, y: 0.8}}
      locations={[0.1, 0.9]}
      end={{x: 0.8, y: 0}}
      colors={[colors.lightblue, colors.darkblue]}
      style={props.style}>
      {props.children}
    </LinearGradient>
  );
};

export const GradientRed = props => {
  return (
    <LinearGradient
      start={{x: 0, y: 0.4}}
      locations={[0, 0.9]}
      end={{x: 0.8, y: 0.1}}
      colors={[colors.lightred, colors.lightrred]}
      style={[props.style]}>
      {props.children}
    </LinearGradient>
  );
};
