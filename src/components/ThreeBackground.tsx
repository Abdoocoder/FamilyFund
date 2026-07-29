import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

const PAID = 0 as const;
const PENDING = 1 as const;
const UNPAID = 2 as const;

const GRID_COLS = 10;
const GRID_ROWS = 7;
const TILE_W = 0.7;
const TILE_D = 0.7;
const TILE_H = 0.04;
const GAP = 0.08;

const gridLayout = [
  [UNPAID, PAID, PAID, PAID, PAID, UNPAID, PAID, PAID, PAID, UNPAID],
  [PAID, PAID, UNPAID, PAID, PAID, PAID, PAID, UNPAID, PAID, PAID],
  [PAID, PAID, PAID, PENDING, PAID, UNPAID, PAID, PAID, PENDING, PAID],
  [UNPAID, PAID, PAID, PAID, PAID, PAID, PAID, PAID, PAID, UNPAID],
  [PAID, PENDING, PAID, UNPAID, PAID, PAID, PENDING, PAID, PAID, PAID],
  [PAID, PAID, PAID, PAID, UNPAID, PAID, PAID, PAID, UNPAID, PAID],
  [UNPAID, PAID, PAID, PAID, PENDING, PAID, PAID, PAID, PAID, UNPAID],
];

const goldColor = new THREE.Color('#d4a843');
const amberColor = new THREE.Color('#c9952e');
const darkWarm = new THREE.Color('#0f0d0b');

function createGlowSprite(
  color: THREE.Color,
  intensity: number,
  size: number,
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  gradient.addColorStop(0, `rgba(${color.r * 255 | 0},${color.g * 255 | 0},${color.b * 255 | 0},${intensity})`);
  gradient.addColorStop(0.3, `rgba(${color.r * 255 | 0},${color.g * 255 | 0},${color.b * 255 | 0},${intensity * 0.4})`);
  gradient.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 128, 128);
  const texture = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(size, size, 1);
  return sprite;
}

export function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, container.clientWidth / container.clientHeight, 0.1, 50);
    camera.position.set(6, 7, 11);
    camera.lookAt(0, -0.5, 0);

    const ambientLight = new THREE.AmbientLight(0x2a1a0a, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffddaa, 1.3);
    mainLight.position.set(5, 12, 8);
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x886644, 0.5);
    fillLight.position.set(-5, 3, -5);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xd4a843, 0.7);
    rimLight.position.set(-2, -1, 8);
    scene.add(rimLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.4,
      0.3,
      0.1,
    );
    composer.addPass(bloom);

    // ─── Payment Grid ────────────────────────────────────
    const gridGroup = new THREE.Group();
    gridGroup.position.y = -0.5;
    scene.add(gridGroup);

    const tileGeo = new THREE.BoxGeometry(TILE_W, TILE_H, TILE_D);
    const paidMat = new THREE.MeshPhysicalMaterial({
      color: amberColor,
      emissive: amberColor,
      emissiveIntensity: 0.3,
      metalness: 0.3,
      roughness: 0.4,
      transparent: true,
      opacity: 0.92,
      clearcoat: 0.2,
      clearcoatRoughness: 0.3,
    });
    const unpaidMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2218,
      metalness: 0.2,
      roughness: 0.6,
      transparent: true,
      opacity: 0.5,
    });
    const pendingTileMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2a1a,
      emissive: goldColor,
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.5,
      transparent: true,
      opacity: 0.8,
    });

    const sphereGeo = new THREE.SphereGeometry(0.15, 20, 20);
    const sphereMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      metalness: 0.9,
      roughness: 0.15,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      emissive: goldColor,
      emissiveIntensity: 0.1,
    });

    const gridWidth = GRID_COLS * (TILE_W + GAP) - GAP;
    const gridDepth = GRID_ROWS * (TILE_D + GAP) - GAP;
    const offsetX = -gridWidth / 2 + TILE_W / 2;
    const offsetZ = -gridDepth / 2 + TILE_D / 2;

    const paidSprites: THREE.Sprite[] = [];
    const pendingMeshes: THREE.Mesh[] = [];

    for (let r = 0; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        const state = gridLayout[r]?.[c] ?? UNPAID;
        const x = offsetX + c * (TILE_W + GAP);
        const z = offsetZ + r * (TILE_D + GAP);
        const mat = state === PAID ? paidMat : state === PENDING ? pendingTileMat : unpaidMat;
        const tile = new THREE.Mesh(tileGeo, mat);
        tile.position.set(x, 0, z);
        gridGroup.add(tile);

        if (state === PAID) {
          const glow = createGlowSprite(amberColor, 0.5, 0.6);
          glow.position.set(x, TILE_H / 2, z);
          gridGroup.add(glow);
          paidSprites.push(glow);
        }

        if (state === PENDING) {
          const sphere = new THREE.Mesh(sphereGeo, sphereMat);
          sphere.position.set(x, TILE_H / 2 + 0.15, z);
          gridGroup.add(sphere);
          pendingMeshes.push(sphere);

          const glow = createGlowSprite(goldColor, 0.4, 0.4);
          glow.position.set(x, TILE_H / 2 + 0.15, z);
          gridGroup.add(glow);
        }
      }
    }

    // ─── Gold Family Tree ────────────────────────────────
    const leftGroup = new THREE.Group();
    leftGroup.position.set(-4.2, 0.2, 0);
    scene.add(leftGroup);

    const goldMatAsset = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
      emissive: goldColor,
      emissiveIntensity: 0.05,
    });

    const trunkGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.7, 8);
    const trunk = new THREE.Mesh(trunkGeo, goldMatAsset);
    trunk.position.y = 0.35;
    leftGroup.add(trunk);

    const branchAngles = [
      { angle: 0, len: 0.4, y: 0.5 },
      { angle: Math.PI * 0.5, len: 0.35, y: 0.55 },
      { angle: Math.PI * 0.25, len: 0.3, y: 0.6 },
      { angle: -Math.PI * 0.3, len: 0.38, y: 0.45 },
    ];
    for (const ba of branchAngles) {
      const branchGeo = new THREE.CylinderGeometry(0.03, 0.05, ba.len, 6);
      const branch = new THREE.Mesh(branchGeo, goldMatAsset);
      branch.position.set(Math.cos(ba.angle) * ba.len * 0.3, ba.y, Math.sin(ba.angle) * ba.len * 0.3);
      branch.rotation.z = Math.cos(ba.angle) * 0.5;
      branch.rotation.x = Math.sin(ba.angle) * 0.5;
      leftGroup.add(branch);
    }

    const canopyPositions = [
      { y: 0.75, scale: 0.35 },
      { y: 0.9, scale: 0.25 },
      { y: 0.6, scale: 0.3, x: 0.2, z: 0.15 },
      { y: 0.65, scale: 0.28, x: -0.18, z: -0.12 },
    ];
    for (const cp of canopyPositions) {
      const leafGeo = new THREE.SphereGeometry(0.2, 12, 12);
      const leafMat = new THREE.MeshPhysicalMaterial({
        color: goldColor,
        metalness: 0.7,
        roughness: 0.2,
        emissive: goldColor,
        emissiveIntensity: 0.08,
        clearcoat: 0.3,
      });
      const leaf = new THREE.Mesh(leafGeo, leafMat);
      leaf.position.set(cp.x || 0, cp.y, cp.z || 0);
      leaf.scale.set(cp.scale, cp.scale * 1.2, cp.scale);
      leftGroup.add(leaf);
    }

    const baseGeo = new THREE.CylinderGeometry(0.2, 0.25, 0.05, 8);
    const baseMat = new THREE.MeshPhysicalMaterial({
      color: 0x8a7a3a,
      metalness: 0.6,
      roughness: 0.3,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.025;
    leftGroup.add(base);

    // ─── Vault Container ─────────────────────────────────
    const rightGroup = new THREE.Group();
    rightGroup.position.set(4.5, 0.1, 0.5);
    scene.add(rightGroup);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xddaa66,
      transparent: true,
      opacity: 0.12,
      metalness: 0.1,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.5,
      side: THREE.DoubleSide,
      emissive: 0x886633,
      emissiveIntensity: 0.03,
    });

    const safeBoxGeo = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const safeBox = new THREE.Mesh(safeBoxGeo, glassMat);
    safeBox.position.y = 0.4;
    rightGroup.add(safeBox);

    const edgeMat = new THREE.LineBasicMaterial({
      color: 0xd4a843,
      transparent: true,
      opacity: 0.2,
    });
    const edgesGeo = new THREE.EdgesGeometry(safeBoxGeo);
    const edges = new THREE.LineSegments(edgesGeo, edgeMat);
    edges.position.copy(safeBox.position);
    rightGroup.add(edges);

    const lockMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 0.3,
    });
    const lockRingGeo = new THREE.TorusGeometry(0.12, 0.025, 12, 16);
    const lockRing = new THREE.Mesh(lockRingGeo, lockMat);
    lockRing.position.set(0.4, 0.4, 0);
    lockRing.rotation.y = Math.PI / 2;
    rightGroup.add(lockRing);
    const lockPinGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.16, 8);
    const lockPin = new THREE.Mesh(lockPinGeo, lockMat);
    lockPin.position.set(0.4, 0.33, 0);
    rightGroup.add(lockPin);

    const safeGlow = createGlowSprite(new THREE.Color('#c9952e'), 0.25, 1.5);
    safeGlow.position.set(0, 0.4, 0);
    rightGroup.add(safeGlow);

    // ─── KPI Bars ────────────────────────────────────────
    const bgGroup = new THREE.Group();
    bgGroup.position.set(0, 0.5, -2);
    scene.add(bgGroup);

    const barMat1 = new THREE.MeshPhysicalMaterial({
      color: amberColor,
      emissive: amberColor,
      emissiveIntensity: 0.15,
      metalness: 0.3,
      roughness: 0.5,
      transparent: true,
      opacity: 0.5,
    });
    const barMat2 = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      emissive: goldColor,
      emissiveIntensity: 0.1,
      metalness: 0.2,
      roughness: 0.5,
      transparent: true,
      opacity: 0.4,
    });
    const barMat3 = new THREE.MeshPhysicalMaterial({
      color: 0x8a7a3a,
      emissive: 0x8a7a3a,
      emissiveIntensity: 0.08,
      metalness: 0.2,
      roughness: 0.5,
      transparent: true,
      opacity: 0.35,
    });
    const barMats = [barMat1, barMat2, barMat3];

    const bars: { mesh: THREE.Mesh; baseHeight: number; speed: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const h = 0.5 + Math.random() * 1.5;
      const barGeo = new THREE.BoxGeometry(0.3, h, 0.3);
      const bar = new THREE.Mesh(barGeo, barMats[i % 3]);
      const x = -2.5 + i * 0.8;
      bar.position.set(x, h / 2, 0);
      bgGroup.add(bar);
      bars.push({ mesh: bar, baseHeight: h, speed: 0.3 + Math.random() * 0.4 });
    }

    // ─── Wave Particle Field ─────────────────────────────
    const PARTICLE_COUNT = 2500;
    const particleSpread = 20;
    const particleHeight = 4;

    const particlePositions = new Float32Array(PARTICLE_COUNT * 3);
    const particleColors = new Float32Array(PARTICLE_COUNT * 3);
    const particleSizes = new Float32Array(PARTICLE_COUNT);
    const particleBaseY = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const x = (Math.random() - 0.5) * particleSpread;
      const z = (Math.random() - 0.5) * particleSpread;
      particlePositions[i3] = x;
      particlePositions[i3 + 1] = (Math.random() - 0.5) * particleHeight;
      particlePositions[i3 + 2] = z;
      particleBaseY[i] = particlePositions[i3 + 1];
      particleSizes[i] = 0.02 + Math.random() * 0.04;

      particleColors[i3] = 0.3 + Math.random() * 0.3;
      particleColors[i3 + 1] = 0.2 + Math.random() * 0.3;
      particleColors[i3 + 2] = 0.0;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
    particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    particles.position.y = 2;
    particles.position.z = -2;
    scene.add(particles);

    // ─── Connection Constellation ────────────────────────
    const NODE_COUNT = 30;
    const nodeSpread = 8;
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      nodePositions.push(new THREE.Vector3(
        (Math.random() - 0.5) * nodeSpread,
        0.5 + Math.random() * 2.5,
        (Math.random() - 0.5) * nodeSpread,
      ));
    }

    const connectionPairs: [number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const connections = 1 + Math.floor(Math.random() * 3);
      for (let c = 0; c < connections; c++) {
        const j = Math.floor(Math.random() * NODE_COUNT);
        if (j !== i && !connectionPairs.some(p => (p[0] === i && p[1] === j) || (p[0] === j && p[1] === i))) {
          connectionPairs.push([i, j]);
        }
      }
    }

    const lineVerts: number[] = [];
    for (const [a, b] of connectionPairs) {
      lineVerts.push(nodePositions[a].x, nodePositions[a].y, nodePositions[a].z);
      lineVerts.push(nodePositions[b].x, nodePositions[b].y, nodePositions[b].z);
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lineVerts, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0xd4a843,
      transparent: true,
      opacity: 0.06,
    });
    const lines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lines);

    const nodeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const nodeMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      emissive: goldColor,
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: 0.4,
    });
    const nodeMeshes: THREE.Mesh[] = [];
    for (const pos of nodePositions) {
      const mesh = new THREE.Mesh(nodeGeo, nodeMat);
      mesh.position.copy(pos);
      scene.add(mesh);
      nodeMeshes.push(mesh);
    }

    // ─── Gold Coins ──────────────────────────────────────
    const COIN_COUNT = 8;
    const coinMat = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      metalness: 0.9,
      roughness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      emissive: goldColor,
      emissiveIntensity: 0.05,
    });
    const coinEdgeMat = new THREE.MeshPhysicalMaterial({
      color: 0x8a7a3a,
      metalness: 0.7,
      roughness: 0.3,
    });

    interface CoinData {
      group: THREE.Group;
      body: THREE.Mesh;
      rim: THREE.Mesh;
      orbitAngle: number;
      orbitRadius: number;
      orbitSpeed: number;
      floatOffset: number;
      floatSpeed: number;
    }
    const coins: CoinData[] = [];

    for (let i = 0; i < COIN_COUNT; i++) {
      const coinGroup = new THREE.Group();
      const coinBodyGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
      const body = new THREE.Mesh(coinBodyGeo, coinMat);
      body.rotation.x = Math.PI / 2;
      coinGroup.add(body);

      const rimGeo = new THREE.TorusGeometry(0.22, 0.025, 8, 24);
      const rim = new THREE.Mesh(rimGeo, coinEdgeMat);
      rim.rotation.x = Math.PI / 2;
      coinGroup.add(rim);

      const coinGlow = createGlowSprite(goldColor, 0.15, 0.6);
      coinGlow.position.x = 0.3;
      coinGroup.add(coinGlow);

      coinGroup.position.set(
        (Math.random() - 0.5) * 3,
        1.5 + Math.random() * 2,
        (Math.random() - 0.5) * 3,
      );
      scene.add(coinGroup);

      coins.push({
        group: coinGroup,
        body,
        rim,
        orbitAngle: Math.random() * Math.PI * 2,
        orbitRadius: 1.5 + Math.random() * 2,
        orbitSpeed: 0.1 + Math.random() * 0.15,
        floatOffset: Math.random() * Math.PI * 2,
        floatSpeed: 0.3 + Math.random() * 0.4,
      });
    }

    // ─── Orbit Ring ──────────────────────────────────────
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: amberColor,
      emissive: amberColor,
      emissiveIntensity: 0.08,
      transparent: true,
      opacity: 0.1,
      metalness: 0.3,
      roughness: 0.5,
      side: THREE.DoubleSide,
    });
    const ringGeo = new THREE.TorusGeometry(
      Math.max(gridWidth, gridDepth) * 0.65,
      0.02,
      8,
      64,
    );
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = -0.3;
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    const ringMat2 = new THREE.MeshPhysicalMaterial({
      color: goldColor,
      emissive: goldColor,
      emissiveIntensity: 0.04,
      transparent: true,
      opacity: 0.05,
      metalness: 0.5,
      roughness: 0.3,
      side: THREE.DoubleSide,
    });
    const ringGeo2 = new THREE.TorusGeometry(
      Math.max(gridWidth, gridDepth) * 0.75,
      0.015,
      8,
      64,
    );
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.position.y = 0.2;
    ring2.rotation.x = Math.PI / 2 + 0.1;
    scene.add(ring2);

    // ─── Spring-Damped Mouse ─────────────────────────────
    const mouseSpring = { x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 };
    const SPRING_K = 0.08;
    const SPRING_D = 0.14;
    const handleMouse = (e: MouseEvent) => {
      mouseSpring.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseSpring.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    // ─── Animate ─────────────────────────────────────────
    const clock = new THREE.Clock();
    let animId: number;

    function getScrollProgress() {
      const docEl = document.documentElement;
      const scrollTop = window.scrollY || docEl.scrollTop || 0;
      const docHeight = Math.max(docEl.scrollHeight - window.innerHeight, 1);
      return Math.min(scrollTop / docHeight, 1);
    }

    let smoothScroll = 0;

    function animate() {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      const rawScroll = getScrollProgress();
      smoothScroll += (rawScroll - smoothScroll) * 0.05;

      const fx = -(mouseSpring.x - mouseSpring.tx) * SPRING_K - mouseSpring.vx * SPRING_D;
      mouseSpring.vx += fx;
      mouseSpring.x += mouseSpring.vx;
      const fy = -(mouseSpring.y - mouseSpring.ty) * SPRING_K - mouseSpring.vy * SPRING_D;
      mouseSpring.vy += fy;
      mouseSpring.y += mouseSpring.vy;

      camera.position.x = 6 + mouseSpring.x * 0.8 - smoothScroll * 2;
      camera.position.y = 7 - mouseSpring.y * 0.3 + smoothScroll * 1.5;
      camera.lookAt(0, -0.5 + smoothScroll * 0.3, 0);

      paidMat.emissiveIntensity = 0.25 + 0.15 * Math.sin(t * 0.5);

      gridGroup.rotation.y = Math.sin(t * 0.08) * 0.04;

      for (const pm of pendingMeshes) {
        pm.position.y = TILE_H / 2 + 0.15 + 0.05 * Math.sin(t * 1.5 + pm.position.x);
      }

      leftGroup.rotation.y = Math.sin(t * 0.12) * 0.06;
      leftGroup.position.y = 0.2 + 0.04 * Math.sin(t * 0.4);

      safeBox.rotation.y = Math.sin(t * 0.1) * 0.05;
      edges.rotation.copy(safeBox.rotation);
      lockRing.rotation.z = Math.PI / 2 + Math.sin(t * 0.15) * 0.05;
      rightGroup.position.y = 0.1 + 0.03 * Math.sin(t * 0.35 + 1);

      for (const b of bars) {
        const h = b.baseHeight + 0.2 * Math.sin(t * b.speed + b.mesh.position.x);
        b.mesh.scale.y = h / b.baseHeight;
      }

      const posArr = particles.geometry.attributes.position.array as Float32Array;
      const sizeArr = particles.geometry.attributes.size.array as Float32Array;
      const colArr = particles.geometry.attributes.color.array as Float32Array;

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const base = particleBaseY[i];
        const x = posArr[i3];
        const z = posArr[i3 + 2];

        const wave1 = Math.sin(x * 0.4 + t * 0.3) * 0.3;
        const wave2 = Math.sin(z * 0.5 + t * 0.4) * 0.3;
        const wave3 = Math.sin((x + z) * 0.3 + t * 0.2) * 0.2;

        const distFromMouse = Math.sqrt(
          (x - mouseSpring.x * 5) ** 2 + (z - mouseSpring.y * 5) ** 2,
        );
        const ripple = Math.exp(-distFromMouse * 0.3) * Math.sin(t * 2 - distFromMouse * 0.5) * 0.3;

        posArr[i3 + 1] = base + wave1 + wave2 + wave3 + ripple;

        const waveInfluence = Math.abs(wave1 + wave2 + wave3);
        sizeArr[i] = (0.02 + waveInfluence * 0.06) * (1 + Math.max(0, ripple) * 0.5);

        colArr[i3] = 0.3 + Math.max(0, ripple) * 0.4;
        colArr[i3 + 1] = 0.2 + waveInfluence * 0.5 + Math.max(0, ripple) * 0.3;
        colArr[i3 + 2] = 0.0;
      }

      particles.geometry.attributes.position.needsUpdate = true;
      particles.geometry.attributes.size.needsUpdate = true;
      particles.geometry.attributes.color.needsUpdate = true;

      lineMat.opacity = 0.04 + 0.04 * Math.sin(t * 0.2);

      nodeMeshes.forEach((nm, idx) => {
        nm.scale.setScalar(1 + 0.3 * Math.sin(t * 0.5 + idx * 0.4));
        const mat = nm.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.15 + 0.25 * Math.sin(t * 0.3 + idx * 0.5);
      });

      for (const coin of coins) {
        coin.orbitAngle += coin.orbitSpeed * 0.01;
        coin.group.position.x = Math.cos(coin.orbitAngle + t * 0.5) * coin.orbitRadius;
        coin.group.position.z = Math.sin(coin.orbitAngle + t * 0.7) * coin.orbitRadius;
        const floatRaw = Math.sin(t * coin.floatSpeed + coin.floatOffset);
        coin.group.position.y = 1.5 + floatRaw * 0.6;
        const tiltX = Math.sin(t * 0.4 + coin.floatOffset);
        const tiltZ = Math.cos(t * 0.3 + coin.floatOffset);
        coin.group.rotation.x = tiltX * 0.3;
        coin.group.rotation.z = tiltZ * 0.2;
        const spin = t * 0.5 + coin.floatOffset;
        coin.body.rotation.z = spin;
        coin.rim.rotation.z = spin;
        const floatPhase = (floatRaw + 1) * 0.5;
        const mat = coin.body.material as THREE.MeshPhysicalMaterial;
        mat.emissiveIntensity = 0.03 + floatPhase * 0.06;
      }

      ring.rotation.z = Math.sin(t * 0.06) * 0.05;
      ring.material.opacity = 0.08 + 0.04 * Math.sin(t * 0.3);
      ring2.rotation.z = Math.sin(t * 0.04 + 0.5) * 0.08;
      ring2.material.opacity = 0.04 + 0.03 * Math.sin(t * 0.25 + 0.5);

      paidSprites.forEach((sprite, idx) => {
        sprite.material.opacity = 0.3 + 0.3 * Math.sin(t * 0.4 + idx * 0.3);
      });

      scene.fog = smoothScroll > 0.1
        ? new THREE.FogExp2(0x0f0d0b, 0.02 + smoothScroll * 0.06)
        : null;

      composer.render();
    }

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
      bloom.setSize(w, h);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();
    animate();

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouse);
      cancelAnimationFrame(animId);
      renderer.dispose();
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
}
