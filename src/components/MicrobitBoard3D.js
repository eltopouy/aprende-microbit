import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class MicrobitBoard3D {
  constructor(canvas, container, options = {}) {
    this.canvas = canvas;
    this.container = container;
    this.options = options;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.boardGroup = new THREE.Group();
    this.ledMeshes = []; // 5x5 array
    this.matrixGlow = null;
    this.buttonAMesh = null;
    this.buttonBMesh = null;
    this.logoMesh = null;
    this.micLedMat = null;

    // Accesorios
    this.servoGroup = null;
    this.servoArm = null;
    this.ultrasonicGroup = null;
    this.potGroup = null;
    this.potKnob = null;
    this.lampGroup = null;
    this.bulbMat = null;

    // Anclajes 3D para líneas líderes
    this.anchors = {};
    this.clickableParts = [];
    this.isHoveredPart = null;

    this.onSelectPart = options.onSelectPart || (() => {});
    this.onUpdateFrame = options.onUpdateFrame || (() => {});

    this.animationFrameId = null;
    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6eddd); // Tono cálido exacto CAD

    // 2. Cámara: Perspectiva isométrica inclinada estilo laboratorio CAD
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 1000);
    this.camera.position.set(24, 42, 60);

    // 3. Renderer con sombras suaves y antialiasing de alta calidad
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (this.renderer.outputColorSpace) {
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
    } catch (err) {
      console.warn('WebGL no disponible:', err);
      return;
    }

    // 4. Controles orbitales suaves y fluidos
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 30;
    this.controls.maxDistance = 160;
    this.controls.maxPolarAngle = Math.PI * 0.85;
    this.controls.minPolarAngle = 0.1;
    this.controls.target.set(0, 1.5, 0);

    // 5. Suelo técnico con cuadrícula milimétrica CAD y sombra de contacto
    this.buildWorkbenchGrid();
    this.buildContactShadow();

    // 6. Iluminación técnica de estudio calibrada para resaltar el oro metálico
    this.setupLighting();

    // 7. Construir la BBC micro:bit v2 con alta fidelidad y orificios pasantes
    this.buildMicrobit();

    // 8. Accesorios 3D externos (dentro de boardGroup para rotar coordinados)
    this.buildAccessories();

    // 9. Inclinación isométrica del tablero (la cara frontal mira hacia el usuario)
    this.boardGroup.rotation.set(-Math.PI / 3.4, 0, -0.06);
    this.boardGroup.position.set(0, 1.5, 0);

    this.scene.add(this.boardGroup);

    // Eventos
    this.setupEvents();

    // Loop de render
    this.animate();
  }

  buildWorkbenchGrid() {
    const gridGeo = new THREE.PlaneGeometry(280, 280);

    const gridVertexShader = `
      varying vec2 vPos;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.0);
        vPos = wp.xz;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }
    `;

    const gridFragmentShader = `
      uniform vec3 color;
      uniform float cell;
      uniform vec2 center;
      uniform float inner;
      uniform float outer;
      uniform float strength;
      varying vec2 vPos;
      void main() {
        vec2 g = abs(fract(vPos / cell - 0.5) - 0.5) / fwidth(vPos / cell);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        vec2 q = (vPos - center) / vec2(1.25, 1.0);
        float fade = 1.0 - smoothstep(inner, outer, length(q));
        float a = line * fade * strength;
        gl_FragColor = vec4(color, a);
      }
    `;

    const gridMat = new THREE.ShaderMaterial({
      vertexShader: gridVertexShader,
      fragmentShader: gridFragmentShader,
      uniforms: {
        color: { value: new THREE.Color(0xd9c7ae) },
        cell: { value: 8.0 },
        center: { value: new THREE.Vector2(0, 0) },
        inner: { value: 30.0 },
        outer: { value: 110.0 },
        strength: { value: 0.85 }
      },
      transparent: true,
      depthWrite: false
    });

    const gridMesh = new THREE.Mesh(gridGeo, gridMat);
    gridMesh.rotation.x = -Math.PI / 2;
    gridMesh.position.y = -14.0;
    this.scene.add(gridMesh);
  }

  buildContactShadow() {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createRadialGradient(128, 128, 15, 128, 128, 120);
    grad.addColorStop(0, 'rgba(30, 20, 10, 0.35)');
    grad.addColorStop(0.4, 'rgba(40, 25, 15, 0.22)');
    grad.addColorStop(0.7, 'rgba(50, 35, 20, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(canvas);
    const shadowGeo = new THREE.PlaneGeometry(80, 64);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false
    });

    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -13.9, 0);
    this.scene.add(shadowMesh);
  }

  setupLighting() {
    // Luz ambiental cálida
    const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.4);
    this.scene.add(ambientLight);

    // Luz principal directriz que arroja sombras suaves
    const keyLight = new THREE.DirectionalLight(0xfffdf7, 2.4);
    keyLight.position.set(50, 95, 75);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.bias = -0.0004;
    this.scene.add(keyLight);

    // Luz dorada frontal inferior: dedicada exclusivamente a iluminar los pines ENIG y orificios
    const goldRimLight = new THREE.DirectionalLight(0xfff3cc, 2.2);
    goldRimLight.position.set(0, -30, 50);
    this.scene.add(goldRimLight);

    // Luz de contorno azulada para realzar detalles de chips y reverso
    const rimLight = new THREE.DirectionalLight(0xb4d4ff, 0.9);
    rimLight.position.set(-60, -40, -70);
    this.scene.add(rimLight);

    // Luz de relleno cálida para la cara inferior
    const fillLight = new THREE.PointLight(0xffe9cc, 0.8, 220);
    fillLight.position.set(0, -40, 50);
    this.scene.add(fillLight);
  }

  buildMicrobit() {
    // Dimensiones oficiales BBC micro:bit v2: 51.6 mm x 42.0 mm x 1.4 mm
    const pcbWidth = 51.6;
    const pcbHeight = 42.0;
    const pcbDepth = 1.4;
    const w2 = pcbWidth / 2;
    const h2 = pcbHeight / 2;
    const r = 4.2;

    // --- 1. Placa PCB con esquinas redondeadas, muescas laterales y MUESCAS v2 EN EL BORDE INFERIOR ---
    const shape = new THREE.Shape();

    // Comienza en la esquina superior izquierda
    shape.moveTo(-w2 + r, h2);
    shape.lineTo(w2 - r, h2);
    shape.absarc(w2 - r, h2 - r, r, Math.PI / 2, 0, true);

    // Borde derecho con muesca lateral
    shape.lineTo(w2, 1.5);
    shape.lineTo(w2 - 1.0, 0);
    shape.lineTo(w2, -1.5);
    shape.lineTo(w2, -h2 + r);
    shape.absarc(w2 - r, -h2 + r, r, 0, -Math.PI / 2, true);

    // BORDE INFERIOR OFICIAL v2: 5 almohadillas salientes y 4 muescas rebajadas para pinzas cocodrilo
    // Pad GND: de w2-r a 17.5
    shape.lineTo(17.5, -h2);
    // Muesca 4 (entre 3V y GND)
    shape.lineTo(17.5, -h2 + 2.2);
    shape.lineTo(14.5, -h2 + 2.2);
    shape.lineTo(14.5, -h2);

    // Pad 3V: de 14.5 a 7.5
    shape.lineTo(7.5, -h2);
    // Muesca 3 (entre Pin 2 y 3V)
    shape.lineTo(7.5, -h2 + 2.2);
    shape.lineTo(3.5, -h2 + 2.2);
    shape.lineTo(3.5, -h2);

    // Pad 2: de 3.5 a -3.5
    shape.lineTo(-3.5, -h2);
    // Muesca 2 (entre Pin 1 y Pin 2)
    shape.lineTo(-3.5, -h2 + 2.2);
    shape.lineTo(-7.5, -h2 + 2.2);
    shape.lineTo(-7.5, -h2);

    // Pad 1: de -7.5 a -14.5
    shape.lineTo(-14.5, -h2);
    // Muesca 1 (entre Pin 0 y Pin 1)
    shape.lineTo(-14.5, -h2 + 2.2);
    shape.lineTo(-17.5, -h2 + 2.2);
    shape.lineTo(-17.5, -h2);

    // Pad 0: de -17.5 a -w2+r
    shape.lineTo(-w2 + r, -h2);
    shape.absarc(-w2 + r, -h2 + r, r, -Math.PI / 2, -Math.PI, true);

    // Borde izquierdo con muesca lateral
    shape.lineTo(-w2, -1.5);
    shape.lineTo(-w2 + 1.0, 0);
    shape.lineTo(-w2, 1.5);
    shape.lineTo(-w2, h2 - r);
    shape.absarc(-w2 + r, h2 - r, r, Math.PI, Math.PI / 2, true);

    // --- 5 ORIFICIOS PASANTES REALES TALADRADOS EN LA PCB (Radio 1.85 mm = 3.7 mm diámetro) ---
    const holeRadius = 1.85;
    const holeY = -16.0;
    const padXPositions = [-21.0, -11.0, 0.0, 11.0, 21.0];

    padXPositions.forEach(hx => {
      const hole = new THREE.Path();
      hole.absarc(hx, holeY, holeRadius, 0, Math.PI * 2, false);
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

    const pcbGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    pcbGeo.center();

    // Material de máscara de soldadura negro mate técnico satinado
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x14171d,
      roughness: 0.5,
      metalness: 0.2
    });

    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.receiveShadow = true;
    pcbMesh.castShadow = true;
    pcbMesh.userData = { partId: 'procesador', name: 'Placa BBC micro:bit v2' };
    this.clickableParts.push(pcbMesh);
    this.boardGroup.add(pcbMesh);

    // --- 2. Serigrafía frontal de alta resolución (Silkscreen oficial nítida) ---
    this.buildSilkscreenTexture(pcbWidth, pcbHeight, pcbDepth);

    // --- 3. Conector de Borde Dorado ENIG con relieve 3D y barriles metalizados ---
    this.buildEdgeConnector(pcbWidth, pcbHeight, pcbDepth, holeRadius, holeY, padXPositions);

    // --- 4. Matriz LED 5x5 con reflectores y brillo emissive ---
    this.buildLedMatrix();

    // --- 5. Botones táctiles A y B mecánicos con capuchón etiquetado ---
    this.buildButtons();

    // --- 6. Logo Táctil Capacitivo de Oro (v2) en relieve 3D ---
    this.buildLogoTouch();

    // --- 7. Micrófono MEMS frontal con LED de actividad acústica ---
    this.buildMicrophone();

    // --- 8. Componentes Traseros (Procesador nRF52833, Altavoz v2, USB, etc.) ---
    this.buildBackComponents();

    // Anclajes 3D para líneas líderes alineados exactamente con los pines y chips
    this.anchors['part:matrix'] = new THREE.Vector3(0, 3.8, pcbDepth + 1.2);
    this.anchors['part:matrix-center'] = new THREE.Vector3(0, 3.8, pcbDepth + 1.2);
    this.anchors['part:button-a'] = new THREE.Vector3(-19.5, 3.5, pcbDepth + 2.0);
    this.anchors['part:button-b'] = new THREE.Vector3(19.5, 3.5, pcbDepth + 2.0);
    this.anchors['part:logo'] = new THREE.Vector3(0, 15.5, pcbDepth + 1.2);
    this.anchors['part:edge'] = new THREE.Vector3(0, -16.0, pcbDepth + 1.2);
    this.anchors['part:pin-0'] = new THREE.Vector3(-21.0, -16.0, pcbDepth + 1.2);
    this.anchors['part:speaker'] = new THREE.Vector3(13.0, 8.0, -pcbDepth - 1.5);
    this.anchors['part:processor'] = new THREE.Vector3(0, 3.0, -pcbDepth - 1.2);
    this.anchors['part:accel-chip'] = new THREE.Vector3(-14.0, 5.0, -pcbDepth - 1.0);
    this.anchors['part:compass-chip'] = new THREE.Vector3(-14.0, 5.0, -pcbDepth - 1.0);
  }

  buildSilkscreenTexture(pcbWidth, pcbHeight, pcbDepth) {
    // Generar textura 2D en ultra alta resolución (2048 x 1664) con la serigrafía oficial de BBC micro:bit v2
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1664;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Patrón ondulado de colores superior oficial (Ceibal / BBC micro:bit v2 signature)
    ctx.lineWidth = 26;
    ctx.lineCap = 'round';

    // Onda Roja oficial
    ctx.strokeStyle = '#de1642';
    ctx.beginPath();
    ctx.moveTo(260, 190);
    ctx.bezierCurveTo(480, 120, 720, 260, 960, 190);
    ctx.stroke();

    // Onda Amarilla oficial
    ctx.strokeStyle = '#ffcc00';
    ctx.beginPath();
    ctx.moveTo(1080, 190);
    ctx.bezierCurveTo(1320, 120, 1560, 260, 1780, 190);
    ctx.stroke();

    // 2. Marco blanco técnico alrededor de la matriz LED 5x5
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.lineWidth = 6;
    ctx.strokeRect(600, 480, 848, 848);

    // Retícula fina de referencia entre LEDs
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    for (let i = 1; i < 5; i++) {
      const p = 600 + i * (848 / 5);
      ctx.beginPath();
      ctx.moveTo(p, 480);
      ctx.lineTo(p, 1328);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(600, p);
      ctx.lineTo(1448, p);
      ctx.stroke();
    }

    // 3. Letras A y B dentro de círculo de serigrafía blanco
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';

    // Botón A
    ctx.beginPath();
    ctx.arc(280, 900, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = '900 78px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('A', 280, 904);

    // Botón B
    ctx.beginPath();
    ctx.arc(1768, 900, 52, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillText('B', 1768, 904);

    // 4. Marca de serigrafía oficial "BBC micro:bit"
    ctx.font = 'bold 52px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
    ctx.fillText('BBC micro:bit', 1024, 370);

    // 5. ETIQUETAS DE PINES GRANDES EN SERIGRAFÍA BLANCA ULTRA-NÍTIDA
    // Posiciones en coordenadas canvas (X):
    // Pad 0: 210, Pad 1: 606, Pad 2: 1024, Pad 3V: 1442, Pad GND: 1838
    ctx.font = '900 82px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('0', 210, 1378);
    ctx.fillText('1', 606, 1378);
    ctx.fillText('2', 1024, 1378);
    ctx.font = '900 72px system-ui, -apple-system, sans-serif';
    ctx.fillText('3V', 1442, 1380);
    ctx.font = '900 66px system-ui, -apple-system, sans-serif';
    ctx.fillText('GND', 1838, 1380);

    // Línea separadora blanca horizontal por encima del conector de borde
    ctx.lineWidth = 6;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.beginPath();
    ctx.moveTo(110, 1324);
    ctx.lineTo(1938, 1324);
    ctx.stroke();

    // Pequeños marcadores de peine (tick marks) para los pines pequeños
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    const tickX = [350, 390, 430, 470, 740, 780, 820, 860, 900, 1150, 1190, 1230, 1270, 1310, 1580, 1620, 1660, 1700];
    tickX.forEach(tx => {
      ctx.beginPath();
      ctx.moveTo(tx, 1324);
      ctx.lineTo(tx, 1338);
      ctx.stroke();
    });

    const silkTexture = new THREE.CanvasTexture(canvas);
    silkTexture.anisotropy = 4;

    const silkGeo = new THREE.PlaneGeometry(pcbWidth - 0.4, pcbHeight - 0.4);
    const silkMat = new THREE.MeshBasicMaterial({
      map: silkTexture,
      transparent: true,
      depthWrite: false
    });

    const silkMesh = new THREE.Mesh(silkGeo, silkMat);
    silkMesh.position.set(0, 0, pcbDepth / 2 + 0.06);
    this.boardGroup.add(silkMesh);
  }

  buildEdgeConnector(pcbWidth, pcbHeight, pcbDepth, holeRadius, holeY, padXPositions) {
    // Material de oro químico de inmersión (ENIG) de alto brillo reflectante con autoemisión cálida
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfcc62c,          // Oro amarillo brillante enriquecido
      metalness: 0.84,          // Fuerte respuesta metálica reflectiva
      roughness: 0.16,          // Superficie pulida brillante
      emissive: 0x422a00         // Autoemisión dorada cálida: garantiza que NUNCA se vea oscuro
    });

    const edgeGroup = new THREE.Group();

    const padLabels = ['0', '1', '2', '3V', 'GND'];
    const padW = 6.2;
    const padH = 9.4;

    // --- 1. LAS 5 GRANDES ALMOHADILLAS DE ORO CON ORIFICIO CENTRAL Y BISEL 3D ---
    padXPositions.forEach((x, idx) => {
      // Forma de la almohadilla grande con su orificio central sustraído
      const padShape = new THREE.Shape();
      const pw2 = padW / 2;
      const ph2 = padH / 2;

      padShape.moveTo(-pw2, -ph2);
      padShape.lineTo(pw2, -ph2);
      padShape.lineTo(pw2, ph2 - 1.2);
      padShape.quadraticCurveTo(pw2, ph2, pw2 - 1.2, ph2);
      padShape.lineTo(-pw2 + 1.2, ph2);
      padShape.quadraticCurveTo(-pw2, ph2, -pw2, ph2 - 1.2);
      padShape.closePath();

      // Orificio central circular
      const holePath = new THREE.Path();
      holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
      padShape.holes.push(holePath);

      // Extrusión 3D de la almohadilla de oro frontal (con relieve real)
      const padExtrudeSettings = {
        depth: 0.12,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.08,
        bevelThickness: 0.08
      };

      const padGeo = new THREE.ExtrudeGeometry(padShape, padExtrudeSettings);
      padGeo.center();

      const padMeshFront = new THREE.Mesh(padGeo, goldMat);
      padMeshFront.position.set(x, holeY, pcbDepth / 2 + 0.1);
      padMeshFront.userData = { partId: 'conector-borde', name: `Pin ${padLabels[idx]}` };
      this.clickableParts.push(padMeshFront);
      edgeGroup.add(padMeshFront);

      // Almohadilla de oro gemela en la cara trasera (Back Face)
      const padMeshBack = new THREE.Mesh(padGeo, goldMat);
      padMeshBack.position.set(x, holeY, -pcbDepth / 2 - 0.1);
      padMeshBack.userData = { partId: 'conector-borde', name: `Pin ${padLabels[idx]}` };
      this.clickableParts.push(padMeshBack);
      edgeGroup.add(padMeshBack);

      // --- BARRILES METÁLICOS DE ORO INTERNOS (Revestimiento tubular pasante del orificio) ---
      const barrelGeo = new THREE.CylinderGeometry(holeRadius, holeRadius, pcbDepth + 0.28, 24, 1, true);
      barrelGeo.rotateX(Math.PI / 2);
      const barrelMat = new THREE.MeshStandardMaterial({
        color: 0xfcc62c,
        metalness: 0.88,
        roughness: 0.2,
        side: THREE.DoubleSide
      });
      const barrelMesh = new THREE.Mesh(barrelGeo, barrelMat);
      barrelMesh.position.set(x, holeY, 0);
      edgeGroup.add(barrelMesh);
    });

    // --- 2. LOS 20 PINES INTERMEDIOS DELGADOS (Grupados entre las almohadillas grandes) ---
    // Paso de pines oficial de 1.27 mm
    const smallPinXList = [
      // Entre Pin 0 y Pin 1 (4 pines)
      -17.5, -16.23, -14.96, -13.69,
      // Entre Pin 1 y Pin 2 (5 pines)
      -7.54, -6.27, -5.00, -3.73, -2.46,
      // Entre Pin 2 y 3V (5 pines)
      2.46, 3.73, 5.00, 6.27, 7.54,
      // Entre 3V y GND (4 pines)
      13.69, 14.96, 16.23, 17.5
    ];

    const stripeW = 0.85;
    const stripeH = 6.4;
    const stripeGeo = new THREE.BoxGeometry(stripeW, stripeH, 0.12);

    smallPinXList.forEach(sx => {
      // Pin delgado cara frontal
      const stripeMeshFront = new THREE.Mesh(stripeGeo, goldMat);
      stripeMeshFront.position.set(sx, -pcbHeight / 2 + stripeH / 2 + 0.1, pcbDepth / 2 + 0.08);
      edgeGroup.add(stripeMeshFront);

      // Pin delgado cara trasera
      const stripeMeshBack = new THREE.Mesh(stripeGeo, goldMat);
      stripeMeshBack.position.set(sx, -pcbHeight / 2 + stripeH / 2 + 0.1, -pcbDepth / 2 - 0.08);
      edgeGroup.add(stripeMeshBack);
    });

    this.boardGroup.add(edgeGroup);
  }

  buildLedMatrix() {
    const matrixGroup = new THREE.Group();
    matrixGroup.position.set(0, 3.8, 1.05);

    const ledSpacing = 4.3; // Espaciado milimétrico entre LEDs
    this.ledMeshes = [];

    // Carcasa o reflector negro de cada LED
    const housingGeo = new THREE.BoxGeometry(2.3, 2.3, 0.4);
    const housingMat = new THREE.MeshStandardMaterial({ color: 0x111318, roughness: 0.6 });

    // Lente difusora central de emisión
    const lensGeo = new THREE.BoxGeometry(1.5, 1.5, 0.6);

    for (let y = 0; y < 5; y++) {
      this.ledMeshes[y] = [];
      for (let x = 0; x < 5; x++) {
        const posX = (x - 2) * ledSpacing;
        const posY = (2 - y) * ledSpacing;

        // Marco del LED
        const housing = new THREE.Mesh(housingGeo, housingMat);
        housing.position.set(posX, posY, 0.1);
        matrixGroup.add(housing);

        // Lente central emisiva (con tono rubí apagado realista)
        const ledMat = new THREE.MeshStandardMaterial({
          color: 0x220b0d,
          emissive: 0x000000,
          roughness: 0.35,
          metalness: 0.1
        });

        const ledMesh = new THREE.Mesh(lensGeo, ledMat);
        ledMesh.position.set(posX, posY, 0.35);
        ledMesh.userData = {
          partId: 'matriz-led',
          name: `LED (${x}, ${y})`,
          coordX: x,
          coordY: y
        };

        this.clickableParts.push(ledMesh);
        matrixGroup.add(ledMesh);
        this.ledMeshes[y][x] = ledMesh;
      }
    }

    // Luz puntual ambiental proyectada por la matriz cuando se iluminan LEDs
    this.matrixGlow = new THREE.PointLight(0xff2b2b, 0, 35);
    this.matrixGlow.position.set(0, 0, 5.0);
    matrixGroup.add(this.matrixGlow);

    this.boardGroup.add(matrixGroup);
  }

  buildButtons() {
    // Carcasa metálica plateada de pulsador táctil
    const housingMat = new THREE.MeshStandardMaterial({
      color: 0xadb5bd,
      metalness: 0.88,
      roughness: 0.22
    });

    // Capuchón táctil negro satinado
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.4,
      metalness: 0.3
    });

    const housingGeo = new THREE.BoxGeometry(6.6, 6.6, 2.4);

    // --- Botón A ---
    const housingA = new THREE.Mesh(housingGeo, housingMat);
    housingA.position.set(-19.5, 3.5, 1.25);
    housingA.castShadow = true;
    this.boardGroup.add(housingA);

    const capGeo = new THREE.CylinderGeometry(2.1, 2.1, 1.8, 32);
    capGeo.rotateX(Math.PI / 2);

    this.buttonAMesh = new THREE.Mesh(capGeo, buttonMat);
    this.buttonAMesh.position.set(-19.5, 3.5, 2.5);
    this.buttonAMesh.userData = { partId: 'boton-a', name: 'Botón Pulsador A' };
    this.clickableParts.push(this.buttonAMesh);
    this.boardGroup.add(this.buttonAMesh);

    // --- Botón B ---
    const housingB = new THREE.Mesh(housingGeo, housingMat);
    housingB.position.set(19.5, 3.5, 1.25);
    housingB.castShadow = true;
    this.boardGroup.add(housingB);

    this.buttonBMesh = new THREE.Mesh(capGeo, buttonMat.clone());
    this.buttonBMesh.position.set(19.5, 3.5, 2.5);
    this.buttonBMesh.userData = { partId: 'boton-b', name: 'Botón Pulsador B' };
    this.clickableParts.push(this.buttonBMesh);
    this.boardGroup.add(this.buttonBMesh);
  }

  buildLogoTouch() {
    // Logotipo icónico de BBC micro:bit v2 en oro 3D con ojos recortados
    const logoShape = new THREE.Shape();
    logoShape.moveTo(-6.5, -3.2);
    logoShape.lineTo(6.5, -3.2);
    logoShape.quadraticCurveTo(7.8, 0, 6.5, 3.2);
    logoShape.lineTo(-6.5, 3.2);
    logoShape.quadraticCurveTo(-7.8, 0, -6.5, -3.2);
    logoShape.closePath();

    // Recortes de los ojos izquierdo y derecho
    const eyeLeft = new THREE.Path();
    eyeLeft.absarc(-2.4, 0, 1.2, 0, Math.PI * 2, true);
    logoShape.holes.push(eyeLeft);

    const eyeRight = new THREE.Path();
    eyeRight.absarc(2.4, 0, 1.2, 0, Math.PI * 2, true);
    logoShape.holes.push(eyeRight);

    const logoExtrude = {
      depth: 0.18,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08
    };

    const logoGeo = new THREE.ExtrudeGeometry(logoShape, logoExtrude);
    logoGeo.center();

    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xfcc62c,
      metalness: 0.88,
      roughness: 0.16,
      emissive: 0x442a00
    });

    this.logoMesh = new THREE.Mesh(logoGeo, logoMat);
    this.logoMesh.position.set(0, 15.5, 1.05);
    this.logoMesh.userData = { partId: 'logo-touch', name: 'Logo Táctil Capacitivo' };
    this.clickableParts.push(this.logoMesh);
    this.boardGroup.add(this.logoMesh);
  }

  buildMicrophone() {
    // Encapsulado MEMS metálico
    const micBoxGeo = new THREE.BoxGeometry(3.2, 2.4, 1.0);
    const micMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, metalness: 0.9, roughness: 0.2 });
    const micBox = new THREE.Mesh(micBoxGeo, micMat);
    micBox.position.set(13.0, 15.5, 1.3);
    micBox.userData = { partId: 'microfono', name: 'Micrófono MEMS' };
    this.clickableParts.push(micBox);
    this.boardGroup.add(micBox);

    // Orificio de sonido
    const holeGeo = new THREE.CircleGeometry(0.5, 16);
    const holeMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
    const hole = new THREE.Mesh(holeGeo, holeMat);
    hole.position.set(12.5, 15.5, 1.82);
    this.boardGroup.add(hole);

    // LED de actividad acústica (pequeño indicador rojo)
    const ledMicGeo = new THREE.CircleGeometry(0.4, 16);
    this.micLedMat = new THREE.MeshBasicMaterial({ color: 0x440808 });
    const micLed = new THREE.Mesh(ledMicGeo, this.micLedMat);
    micLed.position.set(14.2, 15.5, 1.82);
    this.boardGroup.add(micLed);
  }

  buildBackComponents() {
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.4,
      metalness: 0.3
    });

    // 1. Procesador Principal ARM Cortex-M4 nRF52833
    const cpuGeo = new THREE.BoxGeometry(9.0, 9.0, 1.2);
    const cpuMesh = new THREE.Mesh(cpuGeo, icMat);
    cpuMesh.position.set(0, 2.5, -1.5);
    cpuMesh.castShadow = true;
    cpuMesh.userData = { partId: 'procesador', name: 'Microcontrolador nRF52833' };
    this.clickableParts.push(cpuMesh);
    this.boardGroup.add(cpuMesh);

    // 2. Altavoz Electroacústico Posterior (v2)
    const speakerGeo = new THREE.CylinderGeometry(5.4, 5.4, 1.8, 36);
    speakerGeo.rotateX(Math.PI / 2);
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0xc8cdd5,
      metalness: 0.82,
      roughness: 0.28
    });

    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.position.set(13.5, 8.5, -1.8);
    speakerMesh.castShadow = true;
    speakerMesh.userData = { partId: 'altavoz', name: 'Altavoz Posterior v2' };
    this.clickableParts.push(speakerMesh);
    this.boardGroup.add(speakerMesh);

    // 3. Chip Acelerómetro y Magnetómetro MEMS
    const sensorGeo = new THREE.BoxGeometry(3.6, 3.6, 1.0);
    const sensorMesh = new THREE.Mesh(sensorGeo, icMat);
    sensorMesh.position.set(-14.0, 5.0, -1.4);
    sensorMesh.userData = { partId: 'acelerometro', name: 'Sensor LSM303 (Inercial y Brújula)' };
    this.clickableParts.push(sensorMesh);
    this.boardGroup.add(sensorMesh);

    // 4. Conector Micro-USB
    const usbGeo = new THREE.BoxGeometry(7.8, 5.6, 3.2);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0xd8dde6, metalness: 0.92, roughness: 0.18 });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(0, 20.8, 0.4);
    usbMesh.userData = { partId: 'procesador', name: 'Puerto Micro-USB' };
    this.clickableParts.push(usbMesh);
    this.boardGroup.add(usbMesh);

    // 5. Conector de batería JST 2-pin
    const jstGeo = new THREE.BoxGeometry(6.4, 5.2, 5.0);
    const jstMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.5 });
    const jstMesh = new THREE.Mesh(jstGeo, jstMat);
    jstMesh.position.set(15.5, 18.5, -1.8);
    this.boardGroup.add(jstMesh);

    // 6. Botón de Reset
    const rstGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.4, 20);
    rstGeo.rotateX(Math.PI / 2);
    const rstMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
    const rstMesh = new THREE.Mesh(rstGeo, rstMat);
    rstMesh.position.set(-8.5, 14.5, -1.6);
    this.boardGroup.add(rstMesh);
  }

  buildAccessories() {
    // 1. Servomotor Micro 9g (SG90) - Añadido a boardGroup para compartir inclinación
    this.servoGroup = new THREE.Group();
    this.servoGroup.position.set(38, -2, 0);

    const servoBodyGeo = new THREE.BoxGeometry(12, 23, 12);
    const servoMat = new THREE.MeshStandardMaterial({ color: 0x1d70b8, roughness: 0.4 });
    const servoBody = new THREE.Mesh(servoBodyGeo, servoMat);
    servoBody.castShadow = true;
    this.servoGroup.add(servoBody);

    this.servoArm = new THREE.Group();
    this.servoArm.position.set(0, 7.5, 7.2);
    const hornGeo = new THREE.BoxGeometry(3.6, 18, 1.8);
    hornGeo.translate(0, 7, 0);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
    const hornMesh = new THREE.Mesh(hornGeo, hornMat);
    this.servoArm.add(hornMesh);
    this.servoGroup.add(this.servoArm);

    // Cables de conexión flexibles hacia los pines de micro:bit
    this.createJumperWire(this.servoGroup, [0, -10, 0], [-38, -15, 1], 0xd97706); // Señal -> Pin 0
    this.createJumperWire(this.servoGroup, [2, -10, 0], [-27, -15, 1], 0xdc2626); // 3V -> 3V
    this.createJumperWire(this.servoGroup, [-2, -10, 0], [-17, -15, 1], 0x475569); // GND -> GND

    this.servoGroup.visible = false;
    this.boardGroup.add(this.servoGroup);
    this.anchors['part:servo'] = new THREE.Vector3(38, 6, 8);

    // 2. Sensor Ultrasónico HC-SR04
    this.ultrasonicGroup = new THREE.Group();
    this.ultrasonicGroup.position.set(-38, 2, 0);

    const sonicPcbGeo = new THREE.BoxGeometry(4, 22, 44);
    const sonicPcbMat = new THREE.MeshStandardMaterial({ color: 0x1d5a96, roughness: 0.4 });
    const sonicPcb = new THREE.Mesh(sonicPcbGeo, sonicPcbMat);
    this.ultrasonicGroup.add(sonicPcb);

    const eyeGeo = new THREE.CylinderGeometry(7.2, 7.2, 11, 28);
    eyeGeo.rotateZ(Math.PI / 2);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xcfd4dc, metalness: 0.85, roughness: 0.2 });

    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(6, 0, -11.5);
    this.ultrasonicGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(6, 0, 11.5);
    this.ultrasonicGroup.add(eyeRight);

    // Cables hacia pines 1 y 2
    this.createJumperWire(this.ultrasonicGroup, [0, -10, 0], [17, -19, 1], 0x16a34a); // Pin 1
    this.createJumperWire(this.ultrasonicGroup, [0, -10, 4], [38, -19, 1], 0x2563eb); // Pin 2

    this.ultrasonicGroup.visible = false;
    this.boardGroup.add(this.ultrasonicGroup);
    this.anchors['part:ultrasonic'] = new THREE.Vector3(-38, 6, 8);

    // 3. Potenciómetro rotatorio
    this.potGroup = new THREE.Group();
    this.potGroup.position.set(-36, -8, 0);

    const potBaseGeo = new THREE.CylinderGeometry(8.5, 8.5, 7, 28);
    const potBaseMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 });
    const potBase = new THREE.Mesh(potBaseGeo, potBaseMat);
    potBase.rotateX(Math.PI / 2);
    this.potGroup.add(potBase);

    this.potKnob = new THREE.Group();
    const knobGeo = new THREE.CylinderGeometry(7.2, 7.2, 8.5, 28);
    knobGeo.rotateX(Math.PI / 2);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x1e222a, roughness: 0.35 });
    const knobMesh = new THREE.Mesh(knobGeo, knobMat);
    this.potKnob.add(knobMesh);

    const notchGeo = new THREE.BoxGeometry(1.4, 5.2, 8.8);
    notchGeo.translate(0, 4.2, 0);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    this.potKnob.add(notch);

    this.potKnob.position.set(0, 0, 4.2);
    this.potGroup.add(this.potKnob);

    this.potGroup.visible = false;
    this.boardGroup.add(this.potGroup);
    this.anchors['part:pot'] = new THREE.Vector3(-36, -8, 8);

    // 4. Lámpara ambiental
    this.lampGroup = new THREE.Group();
    this.lampGroup.position.set(36, 12, 6);

    const bulbGeo = new THREE.SphereGeometry(6.5, 24, 24);
    this.bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffec99,
      emissive: 0xffcc00,
      emissiveIntensity: 0.8
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, this.bulbMat);
    this.lampGroup.add(bulbMesh);

    this.lampGroup.visible = false;
    this.boardGroup.add(this.lampGroup);
    this.anchors['part:light-source'] = new THREE.Vector3(36, 12, 8);
  }

  createJumperWire(parentGroup, startLocal, endTarget, colorHex) {
    const p0 = new THREE.Vector3(...startLocal);
    const p3 = new THREE.Vector3(...endTarget);
    const midY = Math.min(p0.y, p3.y) - 6;
    const p1 = new THREE.Vector3((p0.x * 2 + p3.x) / 3, midY, p0.z + 4);
    const p2 = new THREE.Vector3((p0.x + p3.x * 2) / 3, midY, p3.z + 4);

    const curve = new THREE.CubicBezierCurve3(p0, p1, p2, p3);
    const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.45, 8, false);
    const tubeMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.35 });
    const wireMesh = new THREE.Mesh(tubeGeo, tubeMat);
    parentGroup.add(wireMesh);
  }

  setupEvents() {
    window.addEventListener('resize', () => this.onResize());
    this.canvas.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.canvas.addEventListener('click', (e) => this.onCanvasClick(e));
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    if (!width || !height) return;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onPointerMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableParts, true);

    if (intersects.length > 0) {
      this.canvas.style.cursor = 'pointer';
      this.isHoveredPart = intersects[0].object.userData;
    } else {
      this.canvas.style.cursor = 'default';
      this.isHoveredPart = null;
    }
  }

  onCanvasClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableParts, true);

    if (intersects.length > 0) {
      const part = intersects[0].object.userData;
      if (part && part.partId) {
        if (part.partId === 'boton-a' && this.options.onButtonPress) {
          this.options.onButtonPress('A');
          this.pressButton('A', true);
          setTimeout(() => this.pressButton('A', false), 200);
        } else if (part.partId === 'boton-b' && this.options.onButtonPress) {
          this.options.onButtonPress('B');
          this.pressButton('B', true);
          setTimeout(() => this.pressButton('B', false), 200);
        } else if (part.partId === 'logo-touch' && this.options.onLogoTouch) {
          this.options.onLogoTouch();
          this.touchLogo(true);
          setTimeout(() => this.touchLogo(false), 250);
        }
        this.selectPart(part.partId);
      }
    }
  }

  selectPart(partId) {
    this.onSelectPart(partId);
  }

  setMatrixPixels(grid) {
    if (!grid || !this.ledMeshes.length) return;

    let litCount = 0;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const val = grid[y] && grid[y][x] !== undefined ? grid[y][x] : 0;
        const led = this.ledMeshes[y][x];

        if (val > 0) {
          litCount++;
          const norm = Math.min(1.0, Math.max(0.2, val / 9));
          led.material.color.setHex(0xff3b30);
          led.material.emissive.setHex(0xff1818);
          led.material.emissiveIntensity = norm * 3.5;
        } else {
          led.material.color.setHex(0x220b0d);
          led.material.emissive.setHex(0x000000);
          led.material.emissiveIntensity = 0;
        }
      }
    }

    if (this.matrixGlow) {
      this.matrixGlow.intensity = Math.min(2.5, litCount * 0.12);
    }
  }

  pressButton(buttonName, isPressed) {
    const mesh = buttonName === 'A' ? this.buttonAMesh : this.buttonBMesh;
    if (!mesh) return;
    mesh.position.z = isPressed ? 1.7 : 2.5;
  }

  touchLogo(isTouched) {
    if (!this.logoMesh) return;
    if (isTouched) {
      this.logoMesh.material.emissive.setHex(0xffea79);
      this.logoMesh.material.emissiveIntensity = 2.4;
    } else {
      this.logoMesh.material.emissive.setHex(0x442a00);
      this.logoMesh.material.emissiveIntensity = 0.5;
    }
  }

  setServoAngle(angleDeg) {
    if (this.servoArm) {
      const rad = THREE.MathUtils.degToRad(angleDeg - 90);
      this.servoArm.rotation.z = rad;
    }
  }

  setPotValue(val0to1023) {
    if (this.potKnob) {
      const rad = THREE.MathUtils.degToRad((val0to1023 / 1023) * 270 - 135);
      this.potKnob.rotation.z = -rad;
    }
  }

  setLampIntensity(normVal) {
    if (this.bulbMat) {
      this.bulbMat.emissiveIntensity = 0.2 + normVal * 2.2;
    }
  }

  setAccessory(accessoryType) {
    if (this.servoGroup) this.servoGroup.visible = (accessoryType === 'servo-motor');
    if (this.ultrasonicGroup) this.ultrasonicGroup.visible = (accessoryType === 'ultrasonic');
    if (this.potGroup) this.potGroup.visible = (accessoryType === 'potentiometer');
    if (this.lampGroup) this.lampGroup.visible = (accessoryType === 'light-source');
  }

  getScreenPositions() {
    const result = {};
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    for (const [key, vector] of Object.entries(this.anchors)) {
      const worldPos = vector.clone();
      this.boardGroup.localToWorld(worldPos);
      const projected = worldPos.clone().project(this.camera);

      const isVisible = projected.z < 1.0;
      const screenX = (projected.x * 0.5 + 0.5) * width;
      const screenY = (-projected.y * 0.5 + 0.5) * height;

      result[key] = {
        x: screenX,
        y: screenY,
        visible: isVisible && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height
      };
    }

    return result;
  }

  setView(preset) {
    switch (preset) {
      case 'reset':
      default:
        this.camera.position.set(24, 42, 60);
        this.controls.target.set(0, 1.5, 0);
        break;
    }
    this.controls.update();
  }

  rotateView(direction = 'left', amountDeg = 15) {
    const angle = THREE.MathUtils.degToRad(direction === 'left' ? -amountDeg : amountDeg);
    const pos = this.camera.position;
    const x = pos.x * Math.cos(angle) - pos.z * Math.sin(angle);
    const z = pos.x * Math.sin(angle) + pos.z * Math.cos(angle);
    pos.x = x;
    pos.z = z;
    this.controls.update();
  }

  zoom(direction = 'in', factor = 0.85) {
    if (direction === 'in') {
      this.camera.position.multiplyScalar(factor);
    } else {
      this.camera.position.multiplyScalar(1 / factor);
    }
    this.controls.update();
  }

  animate() {
    this.animationFrameId = requestAnimationFrame(() => this.animate());

    if (this.controls) {
      this.controls.update();
      if (this.options.onCameraAngle) {
        this.options.onCameraAngle(this.controls.getAzimuthalAngle());
      }
    }

    if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }

    const screenPositions = this.getScreenPositions();
    this.onUpdateFrame(screenPositions);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    if (this.controls) this.controls.dispose();
    if (this.renderer) this.renderer.dispose();
  }
}
