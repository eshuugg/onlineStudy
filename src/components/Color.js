import LinearGradient from 'react-native-linear-gradient';

export default Color = {
  lightblue: '#1182e8',
  darkPurple: '#252233',
  lightPurple: '#9496fa',
  blue: '#146fc0',
  darkblue: '#00519a',
  lightred: '#fe1080',
  lightrred: '#e80b73',
  red: '#c20041',
  green: '#2c9717',
  grey: '#848484',
  darkgrey: '#505050',
  myGreen: '#8bc7cc',
  lightGreen: '#9CA986',
  warmYellow: '#FFFBDE',
  maroon: '#A53860',
  YellowGred: 'FFFAB1',
  RedGred: '#F89D9D',
  Redish: '#CB0404',
  purple: '#8a4fe0',
  deepBlue: '#2575fc',
  // warmGradient: {
  //   colors: [
  //     'hsla(47, 100%, 89%, 1)',
  //     'hsla(0, 69%, 87%, 1)',
  //     'hsla(0, 97%, 48%, 1)',
  //   ],
  //   start: {x: 0, y: 0},
  //   end: {x: 0, y: 1},
  // },
  YellowRedGradient: {
    colors: ['#FFFAB1', '#F89D9D'], // hsla(56,100%,85%,1) and hsla(0,87%,79%,1)
    start: {x: 0, y: 0},
    end: {x: 1, y: 0}, // 90deg = horizontal gradient
  },
  yellowGradient: {
    colors: ['#FFDD9D', '#FFF5D0'], // from hsla(39,100%,81%,1) to hsla(47,100%,91%,1)
    start: {x: 0, y: 0},
    end: {x: 1, y: 0}, // 90deg = horizontal gradient
  },

  warmGradient: {
    colors: ['#6a11cb', '#2575fc'], // Purple to Blue
    start: {x: 0, y: 0},
    end: {x: 1, y: 0}, // 90deg = horizontal gradient
  },
};
// export default Color={
//         lightblue:"#009eff",
//         blue:"#007fff",
//         darkblue:"#006ad5",
//         lightred:"#fe1080",
//         lightrred:"#e80b73",
//         red:"#c20041",
//         green:"#2c9717",
//         grey:"#848484",
//         darkgrey:"#505050",
// }
