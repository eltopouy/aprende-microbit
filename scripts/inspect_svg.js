import fs from 'node:fs';

async function main() {
  const frontRes = await fetch('https://raw.githubusercontent.com/microbit-foundation/microbit-svg/master/microbit-drawing-2.svg');
  const frontSvg = await frontRes.text();
  fs.writeFileSync('./scripts/front.svg', frontSvg);
  console.log('Saved front.svg, length:', frontSvg.length);

  const backRes = await fetch('https://raw.githubusercontent.com/microbit-foundation/microbit-svg/master/microbit-drawing-back-2.svg');
  const backSvg = await backRes.text();
  fs.writeFileSync('./scripts/back.svg', backSvg);
  console.log('Saved back.svg, length:', backSvg.length);
}

main().catch(console.error);
