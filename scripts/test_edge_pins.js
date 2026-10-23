const largePads = [
  { name: '0', x: -21.0 },
  { name: '1', x: -11.0 },
  { name: '2', x: 0.0 },
  { name: '3V', x: 11.0 },
  { name: 'GND', x: 21.0 }
];

// Small pins: 20 pins distributed between the large pads
const smallPins = [];
// Between 0 and 1: x from -17.5 to -14.5 -> 3 pins at -16.9, -16.0, -15.1
smallPins.push(-17.0, -16.0, -15.0);
// Between 1 and 2: x from -7.5 to -3.5 -> 3 pins at -6.5, -5.5, -4.5
smallPins.push(-6.8, -5.8, -4.8, -3.8);
// Between 2 and 3V: x from 3.5 to 7.5 -> 4 pins
smallPins.push(3.8, 4.8, 5.8, 6.8);
// Between 3V and GND: x from 14.5 to 17.5 -> 3 pins
smallPins.push(15.0, 16.0, 17.0);

console.log('Total small pins:', smallPins.length);
console.log('Small pins positions:', smallPins);
