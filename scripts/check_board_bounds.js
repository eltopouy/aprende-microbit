import fs from 'node:fs';

const svg = fs.readFileSync('./scripts/front.svg', 'utf8');

// Find board group
const m = svg.match(/<g[^>]*id="Board"[^>]*>([\s\S]*?)<\/g>\s*<\/g>/);
console.log('Found Board group:', !!m);
