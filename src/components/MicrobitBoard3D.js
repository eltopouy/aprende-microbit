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
    this.buttonAMesh = null;
    this.buttonBMesh = null;
    this.logoMesh = null;
    this.servoGroup = null;
    this.servoArm = null;
    this.ultrasonicGroup = null;
    this.potGroup = null;
    this.potKnob = null;
    this.lampGroup = null;

    // Component anchors in 3D world coordinates
    this.anchors = {};
    this.clickableParts = [];

    this.isHoveredPart = null;
    this.selectedPart = null;
    this.onSelectPart = options.onSelectPart || (() => {});
    this.onUpdateFrame = options.onUpdateFrame || (() => {});

    this.animationFrameId = null;
    this.init();
  }

  init() {
    const width = this.container.clientWidth || 800;
    const height = this.container.clientHeight || 600;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf6eddd); // Mismo tono cálido de la web de referencia

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    this.camera.position.set(0, 0, 160);

    // 3. Renderer
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

    // 4. Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minDistance = 60;
    this.controls.maxDistance = 260;
    this.controls.maxPolarAngle = Math.PI * 0.9;
    this.controls.minPolarAngle = 0.1;

    // 5. Lighting
    this.setupLighting();

    // 6. Build micro:bit v2 3D Model
    this.buildMicrobit();

    // 7. Build Accessories (Servo, Sonar, Pot, Lamp)
    this.buildAccessories();

    this.scene.add(this.boardGroup);

    // Event listeners
    this.setupEvents();

    // Start loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff7ea, 2.2);
    mainLight.position.set(60, 90, 120);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    mainLight.shadow.bias = -0.0005;
    this.scene.add(mainLight);

    const rimLight = new THREE.DirectionalLight(0xb0d0ff, 1.0);
    rimLight.position.set(-80, -60, -90);
    this.scene.add(rimLight);

    const fillLight = new THREE.PointLight(0xffeacc, 0.8, 200);
    fillLight.position.set(0, -50, 60);
    this.scene.add(fillLight);
  }

  buildMicrobit() {
    // Proporciones exactas de BBC micro:bit v2: ~52mm ancho x ~42mm alto x 1.6mm PCB
    const pcbWidth = 52;
    const pcbHeight = 42;
    const pcbDepth = 1.6;

    // --- PCB Base con esquinas redondeadas ---
    const shape = new THREE.Shape();
    const radius = 4;
    const w2 = pcbWidth / 2;
    const h2 = pcbHeight / 2;

    shape.moveTo(-w2 + radius, -h2);
    shape.lineTo(w2 - radius, -h2);
    shape.absarc(w2 - radius, -h2 + radius, radius, -Math.PI / 2, 0, false);
    shape.lineTo(w2, h2 - radius);
    shape.absarc(w2 - radius, h2 - radius, radius, 0, Math.PI / 2, false);
    shape.lineTo(-w2 + radius, h2);
    shape.absarc(-w2 + radius, h2 - radius, radius, Math.PI / 2, Math.PI, false);
    shape.lineTo(-w2, -h2 + radius);
    shape.absarc(-w2 + radius, -h2 + radius, radius, Math.PI, Math.PI * 1.5, false);

    const extrudeSettings = {
      depth: pcbDepth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.4,
      bevelThickness: 0.4
    };

    const pcbGeo = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    pcbGeo.center();

    // Material de PCB negro satinado icónico de micro:bit v2
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.55,
      metalness: 0.2
    });

    const pcbMesh = new THREE.Mesh(pcbGeo, pcbMat);
    pcbMesh.receiveShadow = true;
    pcbMesh.castShadow = true;
    pcbMesh.userData = { partId: 'procesador', name: 'Placa BBC micro:bit v2' };
    this.clickableParts.push(pcbMesh);
    this.boardGroup.add(pcbMesh);

    // --- Conector de Borde Dorado (Edge Connector) ---
    this.buildEdgeConnector(pcbWidth, pcbHeight, pcbDepth);

    // --- Matriz LED 5x5 ---
    this.buildLedMatrix();

    // --- Botones A y B ---
    this.buildButtons();

    // --- Logo Dorado Táctil (v2) ---
    this.buildLogoTouch();

    // --- Micrófono MEMS con LED rojo de sonido ---
    this.buildMicrophone();

    // --- Componentes Traseros (Procesador, Altavoz, USB, Brújula) ---
    this.buildBackComponents();

    // Registro de anclajes principales para líneas guías SVG
    this.anchors['part:matrix'] = new THREE.Vector3(0, 4, pcbDepth + 0.8);
    this.anchors['part:matrix-center'] = new THREE.Vector3(0, 4, pcbDepth + 0.8);
    this.anchors['part:button-a'] = new THREE.Vector3(-19.5, 3.5, pcbDepth + 1.5);
    this.anchors['part:button-b'] = new THREE.Vector3(19.5, 3.5, pcbDepth + 1.5);
    this.anchors['part:logo'] = new THREE.Vector3(0, 15.5, pcbDepth + 0.6);
    this.anchors['part:edge'] = new THREE.Vector3(0, -18.5, pcbDepth + 0.5);
    this.anchors['part:pin-0'] = new THREE.Vector3(-21, -18.5, pcbDepth + 0.5);
    this.anchors['part:speaker'] = new THREE.Vector3(13, 8, -pcbDepth - 1.2);
    this.anchors['part:processor'] = new THREE.Vector3(0, 3, -pcbDepth - 1.0);
    this.anchors['part:accel-chip'] = new THREE.Vector3(-14, 5, -pcbDepth - 0.8);
    this.anchors['part:compass-chip'] = new THREE.Vector3(-14, 5, -pcbDepth - 0.8);
  }

  buildEdgeConnector(pcbWidth, pcbHeight, pcbDepth) {
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf5b731,
      metalness: 0.88,
      roughness: 0.28
    });

    const edgeGroup = new THREE.Group();
    edgeGroup.position.set(0, -pcbHeight / 2 + 3.8, pcbDepth / 2 + 0.1);

    // Pines grandes con orificios: 0, 1, 2, 3V, GND
    const largePadX = [-21, -11, 0, 11, 21];
    const padLabels = ['P0', 'P1', 'P2', '3V', 'GND'];

    largePadX.forEach((x, idx) => {
      // Almohadilla rectangular
      const padGeo = new THREE.PlaneGeometry(6.2, 7.2);
      const padMesh = new THREE.Mesh(padGeo, goldMat);
      padMesh.position.set(x, 0, 0.05);
      padMesh.userData = { partId: 'conector-borde', name: `Pin ${padLabels[idx]}` };
      this.clickableParts.push(padMesh);
      edgeGroup.add(padMesh);

      // Orificio central oscuro para simular perforación de pinza
      const holeGeo = new THREE.CircleGeometry(1.6, 24);
      const holeMat = new THREE.MeshBasicMaterial({ color: 0x111215 });
      const holeMesh = new THREE.Mesh(holeGeo, holeMat);
      holeMesh.position.set(x, 0.5, 0.08);
      edgeGroup.add(holeMesh);
    });

    // Pequeñas pistas delgadas entre pines
    for (let i = -24; i <= 24; i += 2.2) {
      if (largePadX.some(x => Math.abs(x - i) < 3.2)) continue;
      const stripeGeo = new THREE.PlaneGeometry(0.9, 5.0);
      const stripeMesh = new THREE.Mesh(stripeGeo, goldMat);
      stripeMesh.position.set(i, -1.0, 0.04);
      edgeGroup.add(stripeMesh);
    }

    this.boardGroup.add(edgeGroup);
  }

  buildLedMatrix() {
    const matrixGroup = new THREE.Group();
    matrixGroup.position.set(0, 3.8, 1.1);

    const ledSpacing = 4.2; // Distancia entre centros de LEDs
    this.ledMeshes = [];

    // Geometría del LED SMD
    const ledGeo = new THREE.BoxGeometry(1.8, 1.8, 0.8);

    for (let y = 0; y < 5; y++) {
      this.ledMeshes[y] = [];
      for (let x = 0; x < 5; x++) {
        const posX = (x - 2) * ledSpacing;
        const posY = (2 - y) * ledSpacing;

        // Material por defecto (apagado)
        const ledMat = new THREE.MeshStandardMaterial({
          color: 0x241113,
          emissive: 0x000000,
          roughness: 0.4,
          metalness: 0.1
        });

        const ledMesh = new THREE.Mesh(ledGeo, ledMat);
        ledMesh.position.set(posX, posY, 0);
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

    this.boardGroup.add(matrixGroup);
  }

  buildButtons() {
    const buttonMat = new THREE.MeshStandardMaterial({
      color: 0x222429,
      roughness: 0.35,
      metalness: 0.3
    });

    const housingMat = new THREE.MeshStandardMaterial({
      color: 0xa0a3a8,
      metalness: 0.85,
      roughness: 0.25
    });

    // --- Botón A (Izquierda) ---
    const housingGeo = new THREE.BoxGeometry(6.4, 6.4, 2.2);
    const housingA = new THREE.Mesh(housingGeo, housingMat);
    housingA.position.set(-19.5, 3.5, 1.2);
    this.boardGroup.add(housingA);

    const capGeo = new THREE.CylinderGeometry(2.0, 2.0, 1.8, 28);
    capGeo.rotateX(Math.PI / 2);
    this.buttonAMesh = new THREE.Mesh(capGeo, buttonMat);
    this.buttonAMesh.position.set(-19.5, 3.5, 2.4);
    this.buttonAMesh.userData = { partId: 'boton-a', name: 'Botón Pulsador A' };
    this.clickableParts.push(this.buttonAMesh);
    this.boardGroup.add(this.buttonAMesh);

    // --- Botón B (Derecha) ---
    const housingB = new THREE.Mesh(housingGeo, housingMat);
    housingB.position.set(19.5, 3.5, 1.2);
    this.boardGroup.add(housingB);

    this.buttonBMesh = new THREE.Mesh(capGeo, buttonMat.clone());
    this.buttonBMesh.position.set(19.5, 3.5, 2.4);
    this.buttonBMesh.userData = { partId: 'boton-b', name: 'Botón Pulsador B' };
    this.clickableParts.push(this.buttonBMesh);
    this.boardGroup.add(this.buttonBMesh);
  }

  buildLogoTouch() {
    // Logo táctil en forma de cara / logotipo micro:bit en oro
    const logoShape = new THREE.Shape();
    logoShape.moveTo(-5.5, -2.5);
    logoShape.lineTo(5.5, -2.5);
    logoShape.quadraticCurveTo(6.5, 0, 5.5, 2.5);
    logoShape.lineTo(-5.5, 2.5);
    logoShape.quadraticCurveTo(-6.5, 0, -5.5, -2.5);

    const logoGeo = new THREE.ShapeGeometry(logoShape);
    const logoMat = new THREE.MeshStandardMaterial({
      color: 0xf5b731,
      metalness: 0.9,
      roughness: 0.25,
      emissive: 0x000000
    });

    this.logoMesh = new THREE.Mesh(logoGeo, logoMat);
    this.logoMesh.position.set(0, 15.5, 0.95);
    this.logoMesh.userData = { partId: 'logo-touch', name: 'Logo Táctil Capacitivo' };
    this.clickableParts.push(this.logoMesh);
    this.boardGroup.add(this.logoMesh);
  }

  buildMicrophone() {
    // Micrófono orificio y LED indicador
    const micHoleGeo = new THREE.CircleGeometry(0.7, 18);
    const micMat = new THREE.MeshBasicMaterial({ color: 0x080808 });
    const micHole = new THREE.Mesh(micHoleGeo, micMat);
    micHole.position.set(12.5, 15.5, 0.92);
    micHole.userData = { partId: 'microfono', name: 'Micrófono MEMS' };
    this.clickableParts.push(micHole);
    this.boardGroup.add(micHole);

    // Pequeño LED rojo de actividad
    const ledMicGeo = new THREE.CircleGeometry(0.5, 16);
    this.micLedMat = new THREE.MeshBasicMaterial({ color: 0x330000 });
    const micLed = new THREE.Mesh(ledMicGeo, this.micLedMat);
    micLed.position.set(14.5, 15.5, 0.92);
    this.boardGroup.add(micLed);
  }

  buildBackComponents() {
    // Procesador Principal nRF52833 en el reverso (Z negativo)
    const icGeo = new THREE.BoxGeometry(8, 8, 1.2);
    const icMat = new THREE.MeshStandardMaterial({
      color: 0x1f232b,
      roughness: 0.45,
      metalness: 0.3
    });

    const cpuMesh = new THREE.Mesh(icGeo, icMat);
    cpuMesh.position.set(0, 3, -1.4);
    cpuMesh.userData = { partId: 'procesador', name: 'Microcontrolador nRF52833' };
    this.clickableParts.push(cpuMesh);
    this.boardGroup.add(cpuMesh);

    // Altavoz electromagnético trasero (v2)
    const speakerGeo = new THREE.CylinderGeometry(5.2, 5.2, 1.8, 32);
    speakerGeo.rotateX(Math.PI / 2);
    const speakerMat = new THREE.MeshStandardMaterial({
      color: 0xd9dde4,
      metalness: 0.8,
      roughness: 0.3
    });

    const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
    speakerMesh.position.set(13, 8, -1.8);
    speakerMesh.userData = { partId: 'altavoz', name: 'Altavoz Posterior v2' };
    this.clickableParts.push(speakerMesh);
    this.boardGroup.add(speakerMesh);

    // Chip Acelerómetro y Brújula MEMS
    const sensorGeo = new THREE.BoxGeometry(3.5, 3.5, 1.0);
    const sensorMesh = new THREE.Mesh(sensorGeo, icMat);
    sensorMesh.position.set(-14, 5, -1.3);
    sensorMesh.userData = { partId: 'acelerometro', name: 'Sensor LSM303AGR (Movimiento y Brújula)' };
    this.clickableParts.push(sensorMesh);
    this.boardGroup.add(sensorMesh);

    // Conector Micro USB
    const usbGeo = new THREE.BoxGeometry(7.5, 5.5, 3.0);
    const usbMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const usbMesh = new THREE.Mesh(usbGeo, usbMat);
    usbMesh.position.set(0, 20.5, 0.4);
    this.boardGroup.add(usbMesh);

    // Botón de Reset posterior
    const rstGeo = new THREE.CylinderGeometry(1.6, 1.6, 1.2, 20);
    rstGeo.rotateX(Math.PI / 2);
    const rstMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const rstMesh = new THREE.Mesh(rstGeo, rstMat);
    rstMesh.position.set(-8, 14, -1.5);
    this.boardGroup.add(rstMesh);
  }

  buildAccessories() {
    // 1. Servomotor SG90 9g
    this.servoGroup = new THREE.Group();
    this.servoGroup.position.set(42, 6, 0);

    const servoBodyGeo = new THREE.BoxGeometry(12, 22, 12);
    const servoMat = new THREE.MeshStandardMaterial({ color: 0x1e6fd9, roughness: 0.4 });
    const servoBody = new THREE.Mesh(servoBodyGeo, servoMat);
    this.servoGroup.add(servoBody);

    // Brazo del servo (Horn) blanco giratorio
    this.servoArm = new THREE.Group();
    this.servoArm.position.set(0, 7, 7);

    const hornGeo = new THREE.BoxGeometry(3.5, 16, 1.8);
    hornGeo.translate(0, 6, 0);
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const hornMesh = new THREE.Mesh(hornGeo, hornMat);
    this.servoArm.add(hornMesh);
    this.servoGroup.add(this.servoArm);

    this.servoGroup.visible = false;
    this.scene.add(this.servoGroup);
    this.anchors['part:servo'] = new THREE.Vector3(42, 14, 8);

    // 2. Sensor Ultrasónico HC-SR04
    this.ultrasonicGroup = new THREE.Group();
    this.ultrasonicGroup.position.set(-45, 10, 0);

    const sonicPcbGeo = new THREE.BoxGeometry(4, 20, 42);
    const sonicPcbMat = new THREE.MeshStandardMaterial({ color: 0x1d528f, roughness: 0.5 });
    const sonicPcb = new THREE.Mesh(sonicPcbGeo, sonicPcbMat);
    this.ultrasonicGroup.add(sonicPcb);

    // Dos transductores cilíndricos (ojos del sensor)
    const eyeGeo = new THREE.CylinderGeometry(7, 7, 10, 24);
    eyeGeo.rotateZ(Math.PI / 2);
    const eyeMat = new THREE.MeshStandardMaterial({ color: 0xc4c7cc, metalness: 0.8, roughness: 0.25 });

    const eyeLeft = new THREE.Mesh(eyeGeo, eyeMat);
    eyeLeft.position.set(-5, 0, -11);
    this.ultrasonicGroup.add(eyeLeft);

    const eyeRight = new THREE.Mesh(eyeGeo, eyeMat);
    eyeRight.position.set(-5, 0, 11);
    this.ultrasonicGroup.add(eyeRight);

    this.ultrasonicGroup.visible = false;
    this.scene.add(this.ultrasonicGroup);
    this.anchors['part:ultrasonic'] = new THREE.Vector3(-45, 10, 0);

    // 3. Potenciómetro rotatorio
    this.potGroup = new THREE.Group();
    this.potGroup.position.set(-42, -10, 0);

    const potBaseGeo = new THREE.CylinderGeometry(8, 8, 7, 24);
    const potBaseMat = new THREE.MeshStandardMaterial({ color: 0x3d7be0, roughness: 0.4 });
    const potBase = new THREE.Mesh(potBaseGeo, potBaseMat);
    this.potGroup.add(potBase);

    // Perilla giratoria
    this.potKnob = new THREE.Group();
    const knobGeo = new THREE.CylinderGeometry(7, 7, 8, 24);
    const knobMat = new THREE.MeshStandardMaterial({ color: 0x1f2228, roughness: 0.3 });
    const knobMesh = new THREE.Mesh(knobGeo, knobMat);
    this.potKnob.add(knobMesh);

    // Muesca indicadora blanca
    const notchGeo = new THREE.BoxGeometry(1.2, 5, 8.2);
    notchGeo.translate(0, 4, 0);
    const notchMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const notch = new THREE.Mesh(notchGeo, notchMat);
    this.potKnob.add(notch);

    this.potKnob.position.set(0, 0, 4);
    this.potGroup.add(this.potKnob);

    this.potGroup.visible = false;
    this.scene.add(this.potGroup);
    this.anchors['part:pot'] = new THREE.Vector3(-42, -10, 6);

    // 4. Lámpara de luz ambiental
    this.lampGroup = new THREE.Group();
    this.lampGroup.position.set(40, -12, 10);

    const bulbGeo = new THREE.SphereGeometry(6, 24, 24);
    this.bulbMat = new THREE.MeshStandardMaterial({
      color: 0xffec99,
      emissive: 0xffcc00,
      emissiveIntensity: 0.8
    });
    const bulbMesh = new THREE.Mesh(bulbGeo, this.bulbMat);
    this.lampGroup.add(bulbMesh);

    this.lampGroup.visible = false;
    this.scene.add(this.lampGroup);
    this.anchors['part:light-source'] = new THREE.Vector3(40, -12, 10);
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
      const part = intersects[0].object.userData;
      this.isHoveredPart = part;
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
        this.selectPart(part.partId);
      }
    }
  }

  selectPart(partId) {
    this.selectedPart = partId;
    this.onSelectPart(partId);
  }

  // Actualiza los 25 píxeles de la matriz LED con intensidades de 0 a 9
  setMatrixPixels(grid) {
    if (!grid || !this.ledMeshes.length) return;

    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 5; x++) {
        const val = grid[y] && grid[y][x] !== undefined ? grid[y][x] : 0;
        const led = this.ledMeshes[y][x];

        if (val > 0) {
          // Normalizar brillo del 1 al 9
          const norm = Math.min(1.0, Math.max(0.15, val / 9));
          led.material.color.setHex(0xff3b30);
          led.material.emissive.setHex(0xff1e14);
          led.material.emissiveIntensity = norm * 2.8;
        } else {
          led.material.color.setHex(0x241113);
          led.material.emissive.setHex(0x000000);
          led.material.emissiveIntensity = 0;
        }
      }
    }
  }

  // Presionar visualmente los botones físicos A y B
  pressButton(buttonName, isPressed) {
    const mesh = buttonName === 'A' ? this.buttonAMesh : this.buttonBMesh;
    if (!mesh) return;
    const targetZ = isPressed ? 1.7 : 2.4;
    mesh.position.z = targetZ;
  }

  // Tocar el logo capacitivo
  touchLogo(isTouched) {
    if (!this.logoMesh) return;
    if (isTouched) {
      this.logoMesh.material.emissive.setHex(0xffea79);
      this.logoMesh.material.emissiveIntensity = 1.6;
    } else {
      this.logoMesh.material.emissive.setHex(0x000000);
      this.logoMesh.material.emissiveIntensity = 0;
    }
  }

  // Girar el brazo del servomotor según el ángulo (0 a 180 grados)
  setServoAngle(angleDeg) {
    if (this.servoArm) {
      const rad = THREE.MathUtils.degToRad(angleDeg - 90);
      this.servoArm.rotation.z = rad;
    }
  }

  // Girar la perilla del potenciómetro
  setPotValue(val0to1023) {
    if (this.potKnob) {
      const rad = THREE.MathUtils.degToRad((val0to1023 / 1023) * 270 - 135);
      this.potKnob.rotation.z = -rad;
    }
  }

  // Ajustar brillo de lámpara
  setLampIntensity(normVal) {
    if (this.bulbMat) {
      this.bulbMat.emissiveIntensity = 0.2 + normVal * 1.8;
    }
  }

  // Activa o desactiva accesorios según la lección
  setAccessory(accessoryType) {
    if (this.servoGroup) this.servoGroup.visible = (accessoryType === 'servo-motor');
    if (this.ultrasonicGroup) this.ultrasonicGroup.visible = (accessoryType === 'ultrasonic');
    if (this.potGroup) this.potGroup.visible = (accessoryType === 'potentiometer');
    if (this.lampGroup) this.lampGroup.visible = (accessoryType === 'light-source');
  }

  // Proyecta coordenadas 3D a la pantalla 2D para las líneas guía SVG y HUD
  getScreenPositions() {
    const result = {};
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    for (const [key, vector] of Object.entries(this.anchors)) {
      const worldPos = vector.clone();
      // Aplica transformaciones de la placa
      this.boardGroup.localToWorld(worldPos);

      // Proyecta a espacio de cámara (-1 a +1)
      const projected = worldPos.clone().project(this.camera);

      // Comprobar si está delante de la cámara
      const isVisible = projected.z < 1.0;

      // Convertir a píxeles de pantalla
      const screenX = (projected.x * 0.5 + 0.5) * width;
      const screenY = (-projected.y * 0.5 + 0.5) * height;

      result[key] = {
        x: screenX,
        y: screenY,
        visible: isVisible && screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height,
        depth: projected.z
      };
    }

    return result;
  }

  // Controles de cámara rápidos (Vistas fijas)
  setView(preset) {
    switch (preset) {
      case 'front':
        this.camera.position.set(0, 0, 160);
        this.controls.target.set(0, 0, 0);
        break;
      case 'perspective':
        this.camera.position.set(40, -50, 140);
        this.controls.target.set(0, 0, 0);
        break;
      case 'back':
        this.camera.position.set(0, 0, -160);
        this.controls.target.set(0, 0, 0);
        break;
      case 'reset':
      default:
        this.camera.position.set(0, -15, 150);
        this.controls.target.set(0, 0, 0);
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

    this.controls.update();
    this.renderer.render(this.scene, this.camera);

    // Notificar al controlador principal para actualizar líneas líderes SVG
    const screenPositions = this.getScreenPositions();
    this.onUpdateFrame(screenPositions);
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
  }
}
