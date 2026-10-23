import fs from 'node:fs';
const svg = fs.readFileSync('./scripts/front.svg', 'utf8');

// Find the board outline path
const boardMatch = svg.match(/<g[^>]*id="Board"[^>]*>([\s\S]*?)<\/g>/);
if (boardMatch) {
  const paths = boardMatch[1].match(/<path[^>]*d="([^"]+)"[^>]*>/g) || [];
  console.log('Board paths count:', paths.length);
  paths.slice(0, 5).forEach(p => console.log(p.slice(0, 300)));
}
