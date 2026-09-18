import * as THREE from "three";

const CONFIG = {
  bgColor: "#0a0a24",
  flameColor: "#aee9ff",
  flameColor2: "#c79bff",
  flameAmt: 0.2,
  colorA: "#aef6cf",
  colorB: "#5fe6a0",
  colorC: "#eafff2",
  opacity: 2,
  pointSize: 50,
  brightness: 1.85,
  drift: 2.35,
  twinkle: 1,
  spin: 0.03,
  repelRadius: 5,
  repelStrength: 0.35,
  scrollPush: 8,
  scrollDrift: 6,
  scrollSpin: 0.1,
  parallax: 0.6,
};

const COUNT = 4200;
const DEPTH = 30;

function hexToVec3(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(
    ((n >> 16) & 255) / 255,
    ((n >> 8) & 255) / 255,
    (n & 255) / 255,
  );
}

const VERTEX_SHADER = `
uniform float uTime; uniform float uSize; uniform float uDrift; uniform float uDepth; uniform float uTwinkle;
uniform vec3 uCursor; uniform float uRepelRadius; uniform float uRepelStrength; uniform float uActivity;
uniform vec3 uColorA; uniform vec3 uColorB; uniform vec3 uColorC;
attribute float aScale; attribute float aPhase; attribute float aPalette; attribute float aBright;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec3 pos = position;
  pos.z = mod(pos.z + uDrift + (uDepth * 0.5), uDepth) - (uDepth * 0.5);

  float tw = sin(uTime * 1.6 + aPhase * 6.2831);
  vTwinkle = (1.0 - uTwinkle) + uTwinkle * (0.55 + 0.45 * tw);

  vec4 modelPosition = modelMatrix * vec4(pos, 1.0);

  vec3 toParticle = modelPosition.xyz - uCursor;
  float dist = length(toParticle);
  float falloff = smoothstep(uRepelRadius, 0.0, dist);
  modelPosition.xyz += normalize(toParticle + vec3(0.0001)) * falloff * uRepelStrength * uActivity;

  vec4 viewPosition = viewMatrix * modelPosition;
  gl_Position = projectionMatrix * viewPosition;
  gl_PointSize = uSize * aScale;
  gl_PointSize *= (1.0 / -viewPosition.z);

  vec3 base = aPalette < 0.5 ? uColorA : (aPalette < 1.5 ? uColorB : uColorC);
  vColor = base * aBright;
}`;

const FRAGMENT_SHADER = `
uniform float uOpacity; uniform float uBrightness;
varying vec3 vColor; varying float vTwinkle;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float strength = pow(1.0 - d * 2.0, 4.0);
  vec3 color = mix(vec3(0.0), vColor, strength);
  gl_FragColor = vec4(color * uBrightness, strength * uOpacity * vTwinkle);
}`;

const FINAL_VERTEX = `
varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position, 1.0); }`;

const FINAL_FRAGMENT = `
uniform float iTime; uniform sampler2D tDiffuse; uniform sampler2D bloomTexture; uniform sampler2D torusTexture; uniform sampler2D haloTexture;
uniform vec3 uBg; uniform vec3 uFlameA; uniform vec3 uFlameB; uniform float uFlameAmt;
varying vec2 vUv;
vec3 warp3d(vec3 pos, float t){ float curv=.8,a=1.9,b=0.7; pos*=2.;
  pos.x+=curv*sin(t+a*pos.y)+t*b; pos.y+=curv*cos(t+a*pos.x);
  pos.y+=curv*sin(t+a*pos.z)+t*b; pos.z+=curv*cos(t+a*pos.y);
  pos.z+=curv*sin(t+a*pos.x)+t*b; pos.x+=curv*cos(t+a*pos.z);
  return 0.5+0.5*cos(pos.xyz+vec3(1,2,4)); }
void main(){
  vec2 uv = 2.*vUv - 1.;
  vec3 w = pow(warp3d(vec3(uv.x, sin(uv.y), uv.y), iTime*1.5), vec3(1.5));
  vec3 flame = 1.5*uFlameA*w.x; flame*=w.y; flame += uFlameB*w.z;
  flame *= smoothstep(0.25, 1., abs(uv.y));
  float md = smoothstep(-0.7, 1., -uv.y*uv.x); flame *= md*md;
  vec3 bg = uBg * (1.0 - 0.4 * length(uv));
  vec3 halo = texture2D(haloTexture, vUv).xyz;
  gl_FragColor = vec4(bg + flame*uFlameAmt + texture2D(bloomTexture, vUv).xyz + texture2D(torusTexture, vUv).xyz + texture2D(tDiffuse, vUv).xyz + halo, 1.);
}`;

export type StarfieldTunnelHandle = {
  dispose: () => void;
};

export function initStarfieldTunnel(
  canvas: HTMLCanvasElement,
): StarfieldTunnelHandle | false {
  if (typeof window === "undefined" || !window.WebGLRenderingContext) {
    return false;
  }

  THREE.ColorManagement.enabled = false;

  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
  } catch {
    return false;
  }

  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.setClearColor(0x000000, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    80,
  );
  camera.position.set(0, 0, 5);

  const positions = new Float32Array(COUNT * 3);
  const palette = new Float32Array(COUNT);
  const bright = new Float32Array(COUNT);
  const scales = new Float32Array(COUNT);
  const phases = new Float32Array(COUNT);
  for (let i = 0; i < COUNT; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 24;
    positions[i3 + 1] = (Math.random() - 0.5) * 16;
    positions[i3 + 2] = (Math.random() - 0.5) * 30;
    palette[i] = Math.floor(Math.random() * 3);
    bright[i] = 0.7 + Math.random() * 0.6;
    scales[i] = 0.5 + Math.pow(Math.random(), 1.4) * 2.5;
    phases[i] = Math.random();
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("aScale", new THREE.Float32BufferAttribute(scales, 1));
  geometry.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("aPalette", new THREE.Float32BufferAttribute(palette, 1));
  geometry.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));

  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    toneMapped: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uTime: { value: 0 },
      uSize: { value: CONFIG.pointSize },
      uOpacity: { value: 0 },
      uDrift: { value: 0 },
      uDepth: { value: DEPTH },
      uTwinkle: { value: CONFIG.twinkle },
      uCursor: { value: new THREE.Vector3() },
      uRepelRadius: { value: CONFIG.repelRadius },
      uRepelStrength: { value: CONFIG.repelStrength },
      uActivity: { value: 0 },
      uColorA: { value: hexToVec3(CONFIG.colorA) },
      uColorB: { value: hexToVec3(CONFIG.colorB) },
      uColorC: { value: hexToVec3(CONFIG.colorC) },
      uBrightness: { value: CONFIG.brightness },
    },
    vertexShader: VERTEX_SHADER,
    fragmentShader: FRAGMENT_SHADER,
  });

  const points = new THREE.Points(geometry, material);
  const group = new THREE.Group();
  group.add(points);
  scene.add(group);

  const blackTex = new THREE.DataTexture(
    new Uint8Array([0, 0, 0, 255]),
    1,
    1,
    THREE.RGBAFormat,
  );
  blackTex.colorSpace = THREE.NoColorSpace;
  blackTex.needsUpdate = true;

  const sceneTarget = new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
    depthBuffer: true,
    stencilBuffer: false,
  });
  sceneTarget.texture.colorSpace = THREE.NoColorSpace;

  const finalMaterial = new THREE.ShaderMaterial({
    depthTest: false,
    depthWrite: false,
    toneMapped: false,
    uniforms: {
      iTime: { value: 0 },
      tDiffuse: { value: sceneTarget.texture },
      torusTexture: { value: blackTex },
      bloomTexture: { value: blackTex },
      haloTexture: { value: blackTex },
      uBg: { value: hexToVec3(CONFIG.bgColor) },
      uFlameA: { value: hexToVec3(CONFIG.flameColor) },
      uFlameB: { value: hexToVec3(CONFIG.flameColor2) },
      uFlameAmt: { value: CONFIG.flameAmt },
    },
    vertexShader: FINAL_VERTEX,
    fragmentShader: FINAL_FRAGMENT,
  });

  const finalScene = new THREE.Scene();
  const finalCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), finalMaterial);
  finalScene.add(quad);

  const POINTER = {
    ndc: new THREE.Vector2(),
    world: new THREE.Vector3(),
    target: new THREE.Vector3(),
    activity: 0,
    active: false,
    lastMove: 0,
  };
  const raycastDir = new THREE.Vector3();

  function onPointerMove(e: MouseEvent) {
    POINTER.ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
    POINTER.ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
    POINTER.active = true;
    POINTER.lastMove = performance.now();
  }

  function onPointerOut() {
    POINTER.active = false;
  }

  window.addEventListener("mousemove", onPointerMove, { passive: true });
  window.addEventListener("mouseout", onPointerOut, { passive: true });

  function updatePointer() {
    if (POINTER.active) {
      raycastDir
        .set(POINTER.ndc.x, POINTER.ndc.y, 0.5)
        .unproject(camera)
        .sub(camera.position)
        .normalize();
      const t = -camera.position.z / raycastDir.z;
      if (Math.abs(raycastDir.z) > 1e-4 && t > 0 && Number.isFinite(t)) {
        POINTER.target.copy(camera.position).addScaledVector(raycastDir, t);
      } else {
        POINTER.target.set(0, 0, 0);
      }
    } else {
      POINTER.target.set(0, 0, 0);
    }
    POINTER.world.lerp(POINTER.target, 0.12);
    const idle = (performance.now() - POINTER.lastMove) / 1000;
    const want = POINTER.active && idle < 3 ? 1 : 0;
    POINTER.activity += (want - POINTER.activity) * 0.06;
  }

  let scrollTarget = 0;
  let scrollSmooth = 0;
  let scrollCurrent = 0;

  function updateScrollTarget() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollTarget = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
  }

  window.addEventListener("scroll", updateScrollTarget, { passive: true });
  updateScrollTarget();

  const mouseSmooth = { x: 0, y: 0 };
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  function resizeTargets() {
    const pr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.floor(window.innerWidth * pr));
    const h = Math.max(1, Math.floor(window.innerHeight * pr));
    sceneTarget.setSize(w, h);
  }

  function onResize() {
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    resizeTargets();
    updateScrollTarget();
  }

  window.addEventListener("resize", onResize, { passive: true });
  resizeTargets();

  let t0 = performance.now() / 1000;
  const appearStart = performance.now();
  let rafId = 0;

  function renderFrame(now: number, dt: number, animate: boolean) {
    const t = now / 1000;

    if (animate) {
      scrollSmooth += (scrollTarget - scrollSmooth) * 0.1;
      scrollCurrent += (scrollSmooth - scrollCurrent) * 0.06;
      mouseSmooth.x += (POINTER.ndc.x - mouseSmooth.x) * 0.06;
      mouseSmooth.y += (POINTER.ndc.y - mouseSmooth.y) * 0.06;
      updatePointer();

      material.uniforms.uTime.value = t;
      material.uniforms.uDrift.value +=
        dt * (CONFIG.drift + scrollCurrent * CONFIG.scrollDrift);
      material.uniforms.uCursor.value.copy(POINTER.world);
      material.uniforms.uActivity.value = POINTER.activity;

      const elapsed = now - appearStart;
      const fade = Math.min(1, Math.max(0, (elapsed - 300) / 1400));
      material.uniforms.uOpacity.value = fade * CONFIG.opacity;

      camera.position.set(
        mouseSmooth.x * CONFIG.parallax,
        mouseSmooth.y * CONFIG.parallax,
        5 - scrollCurrent * CONFIG.scrollPush,
      );
      camera.lookAt(
        mouseSmooth.x * CONFIG.parallax,
        mouseSmooth.y * CONFIG.parallax,
        -10,
      );
      group.rotation.z += dt * (CONFIG.spin + scrollCurrent * CONFIG.scrollSpin);
      finalMaterial.uniforms.iTime.value = t;
    } else {
      material.uniforms.uOpacity.value = CONFIG.opacity;
    }

    renderer.setRenderTarget(sceneTarget);
    renderer.render(scene, camera);
    renderer.setRenderTarget(null);
    renderer.render(finalScene, finalCamera);
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    const now = performance.now();
    const t = now / 1000;
    const dt = Math.min(0.05, t - t0);
    t0 = t;
    renderFrame(now, dt, true);
  }

  if (reduceMotion) {
    renderFrame(performance.now(), 0, false);
  } else {
    rafId = requestAnimationFrame(tick);
  }

  return {
    dispose() {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseout", onPointerOut);
      window.removeEventListener("scroll", updateScrollTarget);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      finalMaterial.dispose();
      quad.geometry.dispose();
      blackTex.dispose();
      sceneTarget.dispose();
      renderer.dispose();
    },
  };
}
