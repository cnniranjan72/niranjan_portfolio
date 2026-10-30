import { ElementRef, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float, Html, Lightformer, MeshDistortMaterial, PerformanceMonitor } from "@react-three/drei";
import { Bloom, ChromaticAberration, EffectComposer, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

/*
  One fixed WebGL world behind the whole page. The camera flies along a path of
  keyframes, one per section, driven by scroll position:

  hero → core close-up → ring tunnel (experience) → shape field (skills)
  → data plane (projects) → data streams (github) → globe (contact)
*/

const BG = "#030407";
const COBALT = "#1558C9";
const COBALT_LIGHT = "#4D8AF0";
const LIME = "#D4FF24";
const CORE_POS = new THREE.Vector3(2.2, 0, 0);
const GLOBE_POS = new THREE.Vector3(3, 0, -100);

const pointer = { x: 0, y: 0 };

// Core interaction, shared between the core and the particle field.
const coreFx = { hovering: false, hover: 0, shockAt: -100 };
const smooth01 = (x: number) => {
  const t = THREE.MathUtils.clamp(x, 0, 1);
  return t * t * (3 - 2 * t);
};
if (typeof window !== "undefined") {
  window.addEventListener(
    "pointermove",
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

type Pose = { pos: [number, number, number]; look: [number, number, number] };

const KEYFRAMES = (wide: boolean): { id: string; pose: Pose }[] => [
  { id: "hero", pose: wide ? { pos: [0, 0, 8], look: [0, 0, 0] } : { pos: [2.2, 0, 10], look: [2.2, -1.3, 0] } },
  { id: "about", pose: wide ? { pos: [-1.2, 1.2, 4.4], look: [2.2, 0, 0] } : { pos: [1, 1.2, 5.5], look: [2.2, 0, 0] } },
  { id: "experience", pose: { pos: [0, 0, -8], look: [0, 0, -30] } },
  { id: "education", pose: { pos: [0, 0, -38], look: [0, -0.5, -60] } },
  { id: "skills", pose: { pos: [-3, 1, -46], look: [2, 0, -56] } },
  { id: "portfolio", pose: { pos: [0, 2.5, -64], look: [0, 0, -78] } },
  { id: "github", pose: { pos: [0, 1.2, -80], look: [0, 0, -92] } },
  { id: "contact", pose: wide ? { pos: [0, 0.2, -89], look: [-0.6, 0, -100] } : { pos: [3, 0, -88], look: [3, 0.8, -100] } },
];
const END_POSE = (wide: boolean): Pose =>
  wide ? { pos: [-1.2, 0.5, -91], look: [-0.9, 0, -100] } : { pos: [3, 0.4, -90], look: [3, 0.8, -100] };

/* ---------- Camera journey ---------- */

const INTRO_FROM = new THREE.Vector3(-4, 5, 40);
const INTRO_SECONDS = 2.8;

function CameraJourney({ instant = false, revealed = true }: { instant?: boolean; revealed?: boolean }) {
  const { camera, size } = useThree();
  const wide = size.width / size.height > 1.1;
  const anchors = useRef<{ y: number; pose: Pose }[]>([]);
  // Start far out in space; fly in once the page is revealed.
  const pos = useRef(INTRO_FROM.clone());
  const introStart = useRef<number | null>(null);
  const look = useRef(new THREE.Vector3(0, 0, 0));
  const tmpA = useMemo(() => new THREE.Vector3(), []);
  const tmpB = useMemo(() => new THREE.Vector3(), []);

  useEffect(() => {
    const measure = () => {
      const frames = KEYFRAMES(wide);
      const list = frames
        .map((f) => {
          const el = document.getElementById(f.id);
          if (!el) return null;
          const y = f.id === "hero" ? 0 : el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.55;
          return { y, pose: f.pose };
        })
        .filter(Boolean) as { y: number; pose: Pose }[];
      list.push({ y: Math.max(document.documentElement.scrollHeight - window.innerHeight, 1), pose: END_POSE(wide) });
      anchors.current = list.sort((a, b) => a.y - b.y);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    const id = setInterval(measure, 1500);
    return () => {
      ro.disconnect();
      clearInterval(id);
    };
  }, [wide]);

  useFrame((_, delta) => {
    const list = anchors.current;
    if (list.length < 2) return;
    const y = window.scrollY;
    let i = 0;
    while (i < list.length - 2 && y >= list[i + 1].y) i++;
    const a = list[i];
    const b = list[i + 1];
    const raw = THREE.MathUtils.clamp((y - a.y) / Math.max(b.y - a.y, 1), 0, 1);
    const t = raw * raw * (3 - 2 * raw);

    tmpA.fromArray(a.pose.pos).lerp(tmpB.fromArray(b.pose.pos), t);
    tmpA.x += pointer.x * 0.5;
    tmpA.y += pointer.y * 0.35;
    let rate = 4.5;
    if (!instant) {
      if (!revealed) {
        camera.position.copy(INTRO_FROM);
        camera.lookAt(CORE_POS);
        return;
      }
      introStart.current ??= performance.now();
      const elapsed = (performance.now() - introStart.current) / 1000;
      // Ease into the journey: a slow, accelerating glide for the first seconds.
      if (elapsed < INTRO_SECONDS) rate = 0.9 + (elapsed / INTRO_SECONDS) * 3.6;
    }
    const k = instant ? 1 : 1 - Math.exp(-delta * rate);
    pos.current.lerp(tmpA, k);

    tmpA.fromArray(a.pose.look).lerp(tmpB.fromArray(b.pose.look), t);
    look.current.lerp(tmpA, k);

    camera.position.copy(pos.current);
    camera.lookAt(look.current);
  });
  return null;
}

/* ---------- Core (hero / about) ---------- */

function Core() {
  const group = useRef<THREE.Group>(null);
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const ringC = useRef<THREE.Mesh>(null);
  const sats = useRef<(THREE.Mesh | null)[]>([]);
  const satDefs = useMemo(
    () => [
      { r: 2.6, speed: 0.6, euler: new THREE.Euler(Math.PI / 2.3, 0.2, 0), size: 0.07, color: LIME, phase: 0 },
      { r: 3.0, speed: -0.4, euler: new THREE.Euler(Math.PI / 1.7, -0.5, 0), size: 0.055, color: COBALT_LIGHT, phase: 2 },
      { r: 3.45, speed: 0.25, euler: new THREE.Euler(Math.PI / 2, 0.9, 0.4), size: 0.045, color: "#ffffff", phase: 4 },
    ],
    []
  );
  const v = useMemo(() => new THREE.Vector3(), []);
  const hit = useRef<THREE.Mesh>(null);
  const distort = useRef<ElementRef<typeof MeshDistortMaterial>>(null);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const clock = useThree((st) => st.clock);

  // Click the core to send a shockwave through the particle field.
  useEffect(() => {
    const down = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && e.button === 0 && coreFx.hovering) coreFx.shockAt = clock.elapsedTime;
    };
    window.addEventListener("pointerdown", down);
    return () => window.removeEventListener("pointerdown", down);
  }, [clock]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const g = group.current;

    // Hover: raycast the global pointer against an invisible hit sphere, hero only.
    let over = false;
    if (hit.current && window.scrollY < window.innerHeight * 0.6) {
      ndc.set(pointer.x, pointer.y);
      state.raycaster.setFromCamera(ndc, state.camera);
      over = state.raycaster.intersectObject(hit.current, false).length > 0;
    }
    if (over !== coreFx.hovering) {
      coreFx.hovering = over;
      document.documentElement.classList.toggle("core-hover", over);
    }
    coreFx.hover = THREE.MathUtils.lerp(coreFx.hover, over ? 1 : 0, 1 - Math.exp(-delta * 6));
    const since = t - coreFx.shockAt;
    const shock = since >= 0 && since < 2 ? Math.exp(-since * 3.2) * Math.sin(since * 18) : 0;
    if (distort.current) {
      distort.current.distort = 0.38 + coreFx.hover * 0.22 + Math.max(0, shock) * 0.3;
      // Ripple faster while hovered (the material advances its own time at the base speed).
      distort.current.time += delta * coreFx.hover * 2.2;
    }

    if (g) {
      g.scale.setScalar(1 + coreFx.hover * 0.07 + shock * 0.14);
      g.rotation.y += delta * (0.15 + coreFx.hover * 0.35 + (since >= 0 && since < 1.5 ? (1.5 - since) * 1.4 : 0));
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.y * 0.4, 0.05);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.x * 0.3, 0.05);
    }
    if (shell.current) {
      shell.current.rotation.x = t * 0.12;
      shell.current.rotation.y = -t * 0.18;
    }
    if (inner.current) inner.current.scale.setScalar((1 + Math.sin(t * 2.2) * 0.06) * (1 + coreFx.hover * 0.6));
    if (ringA.current) ringA.current.rotation.z += delta * 0.35;
    if (ringB.current) ringB.current.rotation.z -= delta * 0.22;
    if (ringC.current) ringC.current.rotation.z += delta * 0.12;
    satDefs.forEach((s, i) => {
      const m = sats.current[i];
      if (!m) return;
      const ang = t * s.speed + s.phase;
      m.position.copy(v.set(Math.cos(ang) * s.r, Math.sin(ang) * s.r, 0).applyEuler(s.euler));
    });
  });

  return (
    <group ref={group} position={CORE_POS}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.35, 32]} />
          <MeshDistortMaterial ref={distort} color={COBALT} metalness={0.95} roughness={0.12} distort={0.38} speed={1.8} envMapIntensity={1.4} />
        </mesh>
        <mesh ref={inner}>
          <sphereGeometry args={[0.32, 32, 32]} />
          <meshBasicMaterial color={LIME} toneMapped={false} />
        </mesh>
      </Float>
      {/* invisible hit target for hover/click */}
      <mesh ref={hit} visible={false}>
        <sphereGeometry args={[1.7, 16, 16]} />
        <meshBasicMaterial />
      </mesh>
      <mesh ref={shell}>
        <icosahedronGeometry args={[2.05, 1]} />
        <meshBasicMaterial color={COBALT_LIGHT} wireframe transparent opacity={0.22} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0.2, 0]}>
        <torusGeometry args={[2.6, 0.008, 16, 220]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, -0.5, 0]}>
        <torusGeometry args={[3.0, 0.005, 16, 220]} />
        <meshBasicMaterial color={COBALT_LIGHT} transparent opacity={0.8} toneMapped={false} />
      </mesh>
      <mesh ref={ringC} rotation={[Math.PI / 2, 0.9, 0.4]}>
        <torusGeometry args={[3.45, 0.004, 16, 260]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.25} />
      </mesh>
      {satDefs.map((s, i) => (
        <mesh key={i} ref={(el) => (sats.current[i] = el)}>
          <sphereGeometry args={[s.size, 16, 16]} />
          <meshBasicMaterial color={s.color} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Ring tunnel (experience) ---------- */

function Tunnel() {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const rails = useRef<(THREE.Mesh | null)[]>([]);
  const COUNT = 18;
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Full brightness on approach; dimmed once inside, where cards sit on top of it.
    const inside = smooth01((-5 - state.camera.position.z) / 8);
    const k = 1 - inside * 0.6;
    rings.current.forEach((r) => {
      const m = r?.material as THREE.MeshBasicMaterial | undefined;
      if (m) m.opacity = (m.userData.base as number) * k;
    });
    rails.current.forEach((r) => {
      const m = r?.material as THREE.MeshBasicMaterial | undefined;
      if (m) m.opacity = 0.35 * k;
    });
    rings.current.forEach((r, i) => {
      if (!r) return;
      r.rotation.z = t * (i % 2 ? 0.15 : -0.12) + i * 0.4;
      const s = 1 + Math.sin(t * 1.4 + i * 0.6) * 0.04;
      r.scale.set(s, s, 1);
    });
  });
  return (
    <group>
      {Array.from({ length: COUNT }, (_, i) => {
        const z = -8 - i * 1.8;
        const color = i % 3 === 0 ? LIME : i % 3 === 1 ? COBALT_LIGHT : "#ffffff";
        return (
          <mesh key={i} ref={(el) => (rings.current[i] = el)} position={[0, 0, z]}>
            <torusGeometry args={[4.2, i % 3 === 0 ? 0.018 : 0.008, 8, i % 2 ? 6 : 120]} />
            <meshBasicMaterial color={color} transparent opacity={i % 3 === 2 ? 0.3 : 0.85} userData={{ base: i % 3 === 2 ? 0.3 : 0.85 }} toneMapped={false} />
          </mesh>
        );
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return (
          <mesh key={`rail${i}`} ref={(el) => (rails.current[i] = el)} position={[Math.cos(a) * 4.2, Math.sin(a) * 4.2, -24]}>
            <boxGeometry args={[0.012, 0.012, 34]} />
            <meshBasicMaterial color={COBALT_LIGHT} transparent opacity={0.35} />
          </mesh>
        );
      })}
    </group>
  );
}

/* ---------- Shape field (skills) ---------- */

function ShapeField() {
  const shapes = useMemo(() => {
    const out: { pos: [number, number, number]; kind: number; scale: number; color: string; wire: boolean }[] = [];
    let seed = 7;
    const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    for (let i = 0; i < 22; i++) {
      const side = i % 2 ? 1 : -1;
      out.push({
        pos: [side * (2.5 + rnd() * 5), (rnd() - 0.5) * 7, -44 - rnd() * 20],
        kind: i % 4,
        scale: 0.3 + rnd() * 0.7,
        color: i % 3 === 0 ? LIME : COBALT_LIGHT,
        wire: i % 2 === 0,
      });
    }
    return out;
  }, []);
  return (
    <group>
      {shapes.map((s, i) => (
        <Float key={i} position={s.pos} speed={1 + (i % 5) * 0.3} rotationIntensity={2} floatIntensity={1.5}>
          <mesh scale={s.scale}>
            {s.kind === 0 && <octahedronGeometry args={[1, 0]} />}
            {s.kind === 1 && <icosahedronGeometry args={[1, 0]} />}
            {s.kind === 2 && <torusKnotGeometry args={[0.7, 0.22, 90, 12]} />}
            {s.kind === 3 && <boxGeometry args={[1.2, 1.2, 1.2]} />}
            {s.wire ? (
              <meshBasicMaterial color={s.color} wireframe transparent opacity={0.7} toneMapped={false} />
            ) : (
              <meshStandardMaterial color={s.color === LIME ? "#9cbf12" : COBALT} metalness={0.9} roughness={0.2} envMapIntensity={1.2} />
            )}
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ---------- Data plane (projects) ---------- */

function DataPlane() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(120, 120, LIME, COBALT);
    const mats = Array.isArray(g.material) ? g.material : [g.material];
    mats.forEach((m) => {
      m.transparent = true;
      m.opacity = 0.35;
    });
    return g;
  }, []);
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.z = -80 + ((state.clock.elapsedTime * 0.8) % 1);
  });
  return (
    <group ref={ref} position={[0, -2.5, -80]}>
      <primitive object={grid} />
    </group>
  );
}

/* ---------- Data streams (github) ---------- */

function DataStreams() {
  const COUNT = 90;
  const mesh = useRef<THREE.InstancedMesh>(null);
  const items = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: (i % 2 ? 1 : -1) * (6.5 + Math.random() * 8),
        z: -74 - Math.random() * 14,
        y: Math.random() * 14 - 7,
        speed: 1 + Math.random() * 3,
        len: 0.3 + Math.random() * 1.4,
        lime: i % 4 === 0,
      })),
    []
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    const c = new THREE.Color();
    items.forEach((it, i) => m.setColorAt(i, c.set(it.lime ? LIME : COBALT_LIGHT)));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [items]);

  useFrame((state, delta) => {
    const m = mesh.current;
    if (!m) return;
    const mat = m.material as THREE.MeshBasicMaterial;
    mat.opacity = smooth01((-71 - state.camera.position.z) / 6);
    m.visible = mat.opacity > 0.01;
    if (!m.visible) return;
    items.forEach((it, i) => {
      it.y += it.speed * delta;
      if (it.y > 7) it.y = -7;
      dummy.position.set(it.x, it.y, it.z);
      dummy.scale.set(1, it.len, 1);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    });
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]}>
      <boxGeometry args={[0.025, 1, 0.025]} />
      <meshBasicMaterial toneMapped={false} transparent opacity={0} />
    </instancedMesh>
  );
}

/* ---------- Globe (contact) ---------- */

const R = 2.6;
const latLon = (lat: number, lon: number, r = R) => {
  const la = THREE.MathUtils.degToRad(lat);
  const lo = THREE.MathUtils.degToRad(lon);
  return new THREE.Vector3(Math.cos(la) * Math.cos(lo) * r, Math.sin(la) * r, -Math.cos(la) * Math.sin(lo) * r);
};
const HOME = latLon(12.97, 77.59); // Bangalore
const CITIES: [number, number][] = [
  [37.77, -122.42], // San Francisco
  [40.71, -74.0], // New York
  [51.51, -0.13], // London
  [52.52, 13.4], // Berlin
  [25.2, 55.27], // Dubai
  [1.35, 103.82], // Singapore
  [35.68, 139.69], // Tokyo
  [-33.87, 151.21], // Sydney
];
// Yaw that turns Bangalore toward the camera, which views the globe from slightly to its left.
const HOME_YAW = Math.atan2(-HOME.x, HOME.z) - 0.42;

function Globe() {
  const group = useRef<THREE.Group>(null);
  const pulses = useRef<(THREE.Mesh | null)[]>([]);
  const halo = useRef<THREE.Mesh>(null);
  const label = useRef<HTMLDivElement>(null);
  const tmp = useMemo(() => new THREE.Vector3(), []);
  const normal = useMemo(() => new THREE.Vector3(), []);

  const dots = useMemo(() => {
    const n = 2200;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      arr[i * 3] = Math.cos(theta) * Math.sin(phi) * R;
      arr[i * 3 + 1] = Math.cos(phi) * R;
      arr[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * R;
    }
    return arr;
  }, []);

  const arcs = useMemo(
    () =>
      CITIES.map(([lat, lon], i) => {
        const b = latLon(lat, lon);
        const mid = HOME.clone().add(b).normalize().multiplyScalar(R + HOME.distanceTo(b) * 0.42);
        const curve = new THREE.QuadraticBezierCurve3(HOME.clone(), mid, b);
        const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(64));
        const mat = new THREE.LineBasicMaterial({ color: i % 3 === 0 ? "#ffffff" : LIME, transparent: true, opacity: 0.55, toneMapped: false });
        return { line: new THREE.Line(geo, mat), curve, end: b, speed: 0.22 + (i % 4) * 0.05, offset: i / CITIES.length };
      }),
    []
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    // Sway around Bangalore instead of spinning it out of view.
    g.rotation.y = HOME_YAW + Math.sin(t * 0.18) * 0.35 + pointer.x * 0.12;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.y * 0.2 + 0.12, 0.05);

    arcs.forEach((a, i) => {
      const m = pulses.current[i];
      if (!m) return;
      const k = (t * a.speed + a.offset) % 1;
      m.position.copy(a.curve.getPoint(k));
      m.scale.setScalar(0.6 + Math.sin(k * Math.PI) * 0.9);
    });
    if (halo.current) {
      const p = (t * 0.8) % 1;
      halo.current.scale.setScalar(1 + p * 2.4);
      (halo.current.material as THREE.MeshBasicMaterial).opacity = (1 - p) * 0.9;
    }

    // Label: only near the contact section and while Bangalore faces the camera.
    if (label.current) {
      tmp.copy(HOME);
      g.localToWorld(tmp);
      normal.copy(tmp).sub(g.getWorldPosition(new THREE.Vector3())).normalize();
      const toCam = state.camera.position.clone().sub(tmp).normalize();
      const facing = smooth01((normal.dot(toCam) - 0.15) / 0.3);
      const near = smooth01((-84 - state.camera.position.z) / 4);
      label.current.style.opacity = String(facing * near);
    }
  });

  return (
    <group position={GLOBE_POS}>
      <group ref={group}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={dots.length / 3} array={dots} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial color={COBALT_LIGHT} size={0.035} sizeAttenuation transparent opacity={0.95} toneMapped={false} />
        </points>
        <mesh>
          <sphereGeometry args={[R - 0.04, 48, 48]} />
          <meshBasicMaterial color={BG} transparent opacity={0.85} />
        </mesh>
        {arcs.map((a, i) => (
          <group key={i}>
            <primitive object={a.line} />
            <mesh ref={(el) => (pulses.current[i] = el)}>
              <sphereGeometry args={[0.035, 10, 10]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            <mesh position={a.end}>
              <sphereGeometry args={[0.03, 8, 8]} />
              <meshBasicMaterial color={COBALT_LIGHT} toneMapped={false} />
            </mesh>
          </group>
        ))}
        {/* Bangalore */}
        <group position={HOME} quaternion={new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), HOME.clone().normalize())}>
          <mesh>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color={LIME} toneMapped={false} />
          </mesh>
          <mesh ref={halo}>
            <ringGeometry args={[0.09, 0.12, 40]} />
            <meshBasicMaterial color={LIME} transparent toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <Html center position={[0, 0, 0.05]} zIndexRange={[1, 0]} pointerEvents="none">
            <div ref={label} className="globe-label" style={{ opacity: 0 }}>
              <span className="globe-label-dot" /> Bangalore · IST
            </div>
          </Html>
        </group>
      </group>
      <mesh rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[3.5, 0.008, 8, 220]} />
        <meshBasicMaterial color={LIME} toneMapped={false} />
      </mesh>
    </group>
  );
}

/* ---------- Particles spanning the whole journey ---------- */

const particleVertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uShock;
  uniform vec3 uShockOrigin;
  attribute float aScale;
  attribute float aSeed;
  varying float vAlpha;
  varying float vMix;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.3 + aSeed * 6.2831) * 0.2;
    p.x += cos(uTime * 0.2 + aSeed * 6.2831) * 0.2;
    // Expanding ring pushed out from the core after a click.
    vec3 away = p - uShockOrigin;
    float dist = length(away);
    float wave = exp(-pow(dist - uShock * 10.0, 2.0) / 3.0) * exp(-uShock * 1.1);
    p += normalize(away + 1e-4) * wave * 1.8;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aScale * uPixelRatio * (28.0 / -mv.z);
    float fade = smoothstep(40.0, 4.0, -mv.z);
    vAlpha = fade * (0.35 + 0.65 * abs(sin(uTime * 0.8 + aSeed * 40.0))) + wave * 0.9;
    vMix = aSeed;
  }
`;

const particleFragment = /* glsl */ `
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  varying float vAlpha;
  varying float vMix;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float strength = smoothstep(0.5, 0.0, d);
    vec3 color = mix(uColorA, uColorB, step(0.82, vMix));
    gl_FragColor = vec4(color, strength * vAlpha);
  }
`;

function Particles({ count }: { count: number }) {
  const { gl } = useThree();
  const [positions, scales, seeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sc = new Float32Array(count);
    const sd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 5 + Math.pow(Math.random(), 0.6) * 14;
      const a = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = Math.sin(a) * r * 0.65;
      pos[i * 3 + 2] = 10 - Math.random() * 125;
      sc[i] = Math.random() * 1.6 + 0.4;
      sd[i] = Math.random();
    }
    return [pos, sc, sd];
  }, [count]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColorA: { value: new THREE.Color(COBALT_LIGHT) },
      uColorB: { value: new THREE.Color(LIME) },
      uShock: { value: 100 },
      uShockOrigin: { value: CORE_POS.clone() },
    }),
    [gl]
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uShock.value = state.clock.elapsedTime - coreFx.shockAt;
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-aScale" count={count} array={scales} itemSize={1} />
        <bufferAttribute attach="attributes-aSeed" count={count} array={seeds} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={particleVertex}
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ---------- Canvas ---------- */

/**
 * Compile every shader in the scene off the main thread (KHR_parallel_shader_compile where
 * available) before the render loop starts, so the preloader does not stutter.
 */
function AsyncCompile({ onDone }: { onDone: () => void }) {
  const { gl, scene, camera } = useThree();
  const done = useRef(onDone);
  done.current = onDone;
  useEffect(() => {
    let cancelled = false;
    const finish = () => !cancelled && done.current();
    // Give the scene graph one tick to mount, then compile.
    const id = setTimeout(() => {
      gl.compileAsync(scene, camera).then(finish, finish);
    }, 0);
    return () => {
      cancelled = true;
      clearTimeout(id);
    };
  }, [gl, scene, camera]);
  return null;
}

/** Reduced motion: render on demand, only when the page scrolls or resizes. */
function DemandInvalidator() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    const on = () => invalidate();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    const id = setInterval(on, 1000);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      clearInterval(id);
    };
  }, [invalidate]);
  return null;
}

export default function WorldScene({ active = true, revealed = true }: { active?: boolean; revealed?: boolean }) {
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const maxDpr = isMobile ? 1.5 : 1.75;
  const [dpr, setDpr] = useState(isMobile ? 1.25 : 1.5);
  // Post-processing is the most expensive part; slow devices lose it first.
  const [effects, setEffects] = useState(!isMobile);
  const [compiled, setCompiled] = useState(false);
  // Judge performance only once the scene has settled; the first frames (uploads, warm-up) are
  // always slow and would otherwise trigger needless resolution changes and buffer reallocations.
  const [monitor, setMonitor] = useState(false);
  useEffect(() => {
    if (!compiled) return;
    const id = setTimeout(() => setMonitor(true), 4000);
    return () => clearTimeout(id);
  }, [compiled]);
  return (
    <Canvas
      frameloop={!active || !compiled ? "never" : reduced ? "demand" : "always"}
      // Canvas is fixed-size; skip re-measuring on every scroll event.
      resize={{ scroll: false, debounce: { scroll: 0, resize: 150 } }}
      dpr={dpr}
      camera={{ position: [0, 0, 8], fov: 45, near: 0.1, far: 80 }}
      gl={{ antialias: !isMobile, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        // Error checks make three.js wait on the GPU for every shader link; keep them for dev only.
        gl.debug.checkShaderErrors = import.meta.env.DEV;
      }}
    >
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 6, 34]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-2, -2, 3]} intensity={30} color={LIME} />
      <pointLight position={[6, 3, 2]} intensity={40} color={COBALT_LIGHT} />
      <pointLight position={[0, 4, -52]} intensity={60} color={COBALT_LIGHT} distance={30} />
      <pointLight position={[-4, -2, -56]} intensity={40} color={LIME} distance={25} />

      {monitor && (
      <PerformanceMonitor
        flipflops={3}
        onIncline={() => setDpr((d) => Math.min(d + 0.25, maxDpr))}
        onDecline={() => {
          setDpr(1);
          setEffects(false);
        }}
        onFallback={() => {
          setDpr(1);
          setEffects(false);
        }}
      />
      )}
      {reduced && <DemandInvalidator />}
      <CameraJourney instant={reduced} revealed={revealed} />
      {!compiled && <AsyncCompile onDone={() => setCompiled(true)} />}
      <Core />
      <Tunnel />
      <ShapeField />
      <DataPlane />
      <DataStreams />
      <Globe />
      <Particles count={isMobile ? 2200 : 5200} />

      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer form="circle" intensity={4} position={[0, 5, -9]} scale={2} />
          <Lightformer form="circle" intensity={2} color={COBALT_LIGHT} position={[-5, 1, -1]} scale={2} />
          <Lightformer form="ring" intensity={3} color={LIME} position={[10, 1, 0]} scale={8} />
          <Lightformer form="rect" intensity={1.5} position={[-5, -1, -1]} scale={[10, 2, 1]} />
        </group>
      </Environment>

      {effects && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.55} luminanceSmoothing={0.2} intensity={1.3} radius={0.75} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0006, 0.0009)}
            radialModulation={false}
            modulationOffset={0}
          />
          <Vignette eskil={false} offset={0.25} darkness={0.75} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
