import * as THREE from 'three';

const pcbWidth = 51.6;
const pcbHeight = 42.0;
const pcbDepth = 1.4;
const w2 = pcbWidth / 2;
const h2 = pcbHeight / 2;
const r = 4.2;

const shape = new THREE.Shape();

// Start at top-left, go clockwise
shape.moveTo(-w2 + r, h2);
shape.lineTo(w2 - r, h2);
shape.absarc(w2 - r, h2 - r, r, Math.PI / 2, 0, true);

// Right edge
shape.lineTo(w2, -h2 + r);
shape.absarc(w2 - r, -h2 + r, r, 0, -Math.PI / 2, true);

// Bottom edge with 4 v2 notches between the 5 pads
// Pad GND: from w2-r to 17.5
shape.lineTo(17.5, -h2);
// Notch 4 (between 3V and GND)
shape.lineTo(17.5, -h2 + 2.2);
shape.lineTo(14.5, -h2 + 2.2);
shape.lineTo(14.5, -h2);

// Pad 3V: 14.5 to 7.5
shape.lineTo(7.5, -h2);
// Notch 3 (between 2 and 3V)
shape.lineTo(7.5, -h2 + 2.2);
shape.lineTo(3.5, -h2 + 2.2);
shape.lineTo(3.5, -h2);

// Pad 2: 3.5 to -3.5
shape.lineTo(-3.5, -h2);
// Notch 2 (between 1 and 2)
shape.lineTo(-3.5, -h2 + 2.2);
shape.lineTo(-7.5, -h2 + 2.2);
shape.lineTo(-7.5, -h2);

// Pad 1: -7.5 to -14.5
shape.lineTo(-14.5, -h2);
// Notch 1 (between 0 and 1)
shape.lineTo(-14.5, -h2 + 2.2);
shape.lineTo(-17.5, -h2 + 2.2);
shape.lineTo(-17.5, -h2);

// Pad 0: -17.5 to -w2+r
shape.lineTo(-w2 + r, -h2);
shape.absarc(-w2 + r, -h2 + r, r, -Math.PI / 2, -Math.PI, true);

// Left edge
shape.lineTo(-w2, h2 - r);
shape.absarc(-w2 + r, h2 - r, r, Math.PI, Math.PI / 2, true);

// Add the 5 physical through-holes (radius 1.85mm = 3.7mm diameter)
const holeRadius = 1.85;
const padPositions = [-21.0, -11.0, 0.0, 11.0, 21.0];
padPositions.forEach(hx => {
  const hole = new THREE.Path();
  hole.absarc(hx, -16.0, holeRadius, 0, Math.PI * 2, false);
  shape.holes.push(hole);
});

const extrudeSettings = {
  depth: pcbDepth,
  bevelEnabled: true,
  bevelSegments: 3,
  steps: 1,
  bevelSize: 0.25,
  bevelThickness: 0.25
};

const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
geom.center();

console.log('ExtrudeGeometry built successfully!');
console.log('Vertices count:', geom.attributes.position.count);
console.log('Bounds:', geom.boundingBox);
