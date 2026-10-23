import fs from 'node:fs';

const svg = fs.readFileSync('./scripts/front.svg', 'utf8');
const vbMatch = svg.match(/viewBox="([^"]+)"/);
const wMatch = svg.match(/width="([^"]+)"/);
const hMatch = svg.match(/height="([^"]+)"/);

console.log('viewBox:', vbMatch ? vbMatch[1] : null);
console.log('width:', wMatch ? wMatch[1] : null);
console.log('height:', hMatch ? hMatch[1] : null);
