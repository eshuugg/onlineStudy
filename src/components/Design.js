import {StyleSheet} from 'react-native';
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from 'react-native-responsive-screen';
import * as allimages from '../components/Images';

export const colors = {
  lightblue: '#1182e8',
  blue: '#146fc0',
  darkblue: '#00519a',
  lightred: '#fe1080',
  lightrred: '#e80b73',
  red: '#c20041',
  green: '#2c9717',
  grey: '#848484',
  darkgrey: '#505050',
  white: '#ffffff',
};
export const fonts = {
  rt: 'Roboto-Thin',
  rl: 'Roboto-Light',
  rr: 'Roboto-Regular',
  rm: 'Roboto-Medium',
  rb: 'Roboto-Bold',
  rbl: 'Roboto-Black',
};
export const images = allimages;
export const screen = {
  h: h,
  w: w,
};
export const styles = StyleSheet.create({
  container: {
    width: '98%',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 410,
  },
  maxWidth: {
    maxWidth: 410,
  },
  flex: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    position: 'relative',
  },
  flexColumn: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    position: 'relative',
  },
});
