import React, { Component, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

type DeviceTier = 'desktop' | 'laptop' | 'tablet' | 'mobile';

interface CameraProfile {
  tier: DeviceTier;
  fov: number;
  startX: number;
  startY: number;
  startZ: number;
  heroX: number;
  heroY: number;
  heroZ: number;
  orbitX: number;
  orbitY: number;
  pointerStrength: number;
  particleCount: number;
  sceneScale: number;
  dpr: [number, number];
}

function getCameraProfile(width: number): CameraProfile {
  if (width >= 1440) {
    return {
      tier: 'desktop',
      fov: 44,
      startX: -1.4,
      startY: 2.1,
      startZ: 15.2,
      heroX: 0.25,
      heroY: 0.45,
      heroZ: 9.6,
      orbitX: 0.55,
      orbitY: 0.16,
      pointerStrength: 0.65,
      particleCount: 84,
      sceneScale: 1,
      dpr: [1, 1.5],
    };
  }
  if (width >= 1024) {
    return {
      tier: 'laptop',
      fov: 46,
      startX: -1.0,
      startY: 1.8,
      startZ: 14.4,
      heroX: 0.15,
      heroY: 0.4,
      heroZ: 10.1,
      orbitX: 0.38,
      orbitY: 0.12,
      pointerStrength: 0.45,
      particleCount: 60,
      sceneScale: 0.94,
      dpr: [1, 1.4],
    };
  }
  if (width >= 640) {
    return {
      tier: 'tablet',
      fov: 50,
      startX: 0,
      startY: 1.4,
      startZ: 13.6,
      heroX: 0,
      heroY: 0.35,
      heroZ: 10.6,
      orbitX: 0.18,
      orbitY: 0.08,
      pointerStrength: 0,
      particleCount: 38,
      sceneScale: 0.85,
      dpr: [1, 1.25],
    };
  }
  return {
    tier: 'mobile',
    fov: 56,
    startX: 0,
    startY: 1.0,
    startZ: 12.8,
    heroX: 0,
    heroY: 0.25,
    heroZ: 10.8,
    orbitX: 0.08,
    orbitY: 0.05,
    pointerStrength: 0,
    particleCount: 22,
    sceneScale: 0.72,
    dpr: [1, 1.2],
  };
}

class WebGLErrorBoundary extends Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

function checkWebGLSupport(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

/**
 * Floating Angular Black & Crimson 3D Geometric Monolith Shards
 */
const AngularShards3D: React.FC<{ scale: number }> = ({ scale }) => {
  const groupRef = useRef<THREE.Group>(null);

  const shardSpecs = useMemo(
    () => [
      { pos: [3.6, 0.8, -2.4] as [number, number, number], rot: [0.12, -0.32, -0.22] as [number, number, number], size: [2.1, 6.2, 0.22] as [number, number, number], color: '#140506', edge: '#FF101A', edgeOp: 0.55 },
      { pos: [5.4, -0.4, -4.6] as [number, number, number], rot: [-0.08, -0.42, -0.26] as [number, number, number], size: [2.8, 7.6, 0.28] as [number, number, number], color: '#380205', edge: '#E60012', edgeOp: 0.42 },
      { pos: [-5.2, 1.4, -6.5] as [number, number, number], rot: [0.16, 0.35, 0.18] as [number, number, number], size: [1.6, 4.8, 0.18] as [number, number, number], color: '#100405', edge: '#650000', edgeOp: 0.45 },
      { pos: [1.8, -2.6, -5.8] as [number, number, number], rot: [0.3, -0.2, -0.34] as [number, number, number], size: [3.2, 1.1, 0.16] as [number, number, number], color: '#180506', edge: '#FF101A', edgeOp: 0.38 },
    ],
    []
  );

  const geometries = useMemo(
    () =>
      shardSpecs.map((spec) => {
        const box = new THREE.BoxGeometry(...spec.size);
        const edges = new THREE.EdgesGeometry(box);
        return { box, edges };
      }),
    [shardSpecs]
  );

  useEffect(() => {
    return () => {
      geometries.forEach(({ box, edges }) => {
        box.dispose();
        edges.dispose();
      });
    };
  }, [geometries]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y = Math.sin(t * 0.42) * 0.18;
    groupRef.current.rotation.z = Math.sin(t * 0.22) * 0.025;
  });

  return (
    <group ref={groupRef} scale={scale}>
      {shardSpecs.map((spec, idx) => (
        <group key={idx} position={spec.pos} rotation={spec.rot}>
          <mesh geometry={geometries[idx].box}>
            <meshStandardMaterial
              color={spec.color}
              roughness={0.55}
              metalness={0.45}
            />
          </mesh>
          <lineSegments geometry={geometries[idx].edges}>
            <lineBasicMaterial color={spec.edge} transparent opacity={spec.edgeOp} />
          </lineSegments>
        </group>
      ))}
    </group>
  );
};

/**
 * 3D Network Connection Arcs & Traveling Glowing Crimson Data Packets
 */
const NetworkArcs3D: React.FC<{ scale: number }> = ({ scale }) => {
  const packetRefs = useRef<Array<THREE.Mesh | null>>([]);

  const { curves, lines, nodePoints } = useMemo(() => {
    const cList = [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.8, -1.8, -3.5),
        new THREE.Vector3(-2.4, 0.6, -2.2),
        new THREE.Vector3(2.2, -0.4, -1.8),
        new THREE.Vector3(6.6, 1.8, -3.6),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-6.2, 2.5, -5.2),
        new THREE.Vector3(-1.2, 1.4, -3.8),
        new THREE.Vector3(3.1, 2.2, -2.8),
        new THREE.Vector3(7.0, -1.2, -4.4),
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-4.5, -2.9, -4.8),
        new THREE.Vector3(0.2, -1.6, -2.8),
        new THREE.Vector3(4.2, -2.1, -3.2),
        new THREE.Vector3(6.4, 0.6, -5.0),
      ]),
    ];

    const lineObjs = cList.map((curve, idx) => {
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(56));
      const mat = new THREE.LineBasicMaterial({
        color: idx === 0 ? '#FF101A' : '#E60012',
        transparent: true,
        opacity: idx === 0 ? 0.36 : 0.22,
      });
      return new THREE.Line(geo, mat);
    });

    const nodes = [
      new THREE.Vector3(-6.8, -1.8, -3.5),
      new THREE.Vector3(-2.4, 0.6, -2.2),
      new THREE.Vector3(2.2, -0.4, -1.8),
      new THREE.Vector3(6.6, 1.8, -3.6),
      new THREE.Vector3(-1.2, 1.4, -3.8),
      new THREE.Vector3(3.1, 2.2, -2.8),
      new THREE.Vector3(0.2, -1.6, -2.8),
    ];

    return { curves: cList, lines: lineObjs, nodePoints: nodes };
  }, []);

  useEffect(() => {
    return () => {
      lines.forEach((l) => {
        l.geometry.dispose();
        (l.material as THREE.Material).dispose();
      });
    };
  }, [lines]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    curves.forEach((curve, idx) => {
      const mesh = packetRefs.current[idx];
      if (!mesh) return;
      const speed = 0.095 + idx * 0.025;
      const u = (t * speed + idx * 0.31) % 1;
      mesh.position.copy(curve.getPointAt(u));
    });
  });

  return (
    <group scale={scale}>
      {lines.map((lineObj, i) => (
        <primitive key={i} object={lineObj} />
      ))}
      {nodePoints.map((pt, i) => (
        <mesh key={`node-${i}`} position={pt}>
          <octahedronGeometry args={[0.095, 0]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#FF101A' : '#FFFFFF'} />
        </mesh>
      ))}
      {curves.map((_, i) => (
        <mesh
          key={`packet-${i}`}
          ref={(el) => {
            packetRefs.current[i] = el;
          }}
        >
          <sphereGeometry args={[0.085, 10, 10]} />
          <meshBasicMaterial color="#FF101A" toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

/**
 * Instanced Floating 3D Geometric Particles (Single Draw Call, Adaptive Count)
 */
const FloatingParticles3D: React.FC<{ count: number }> = ({ count }) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const items: Array<{
      x: number;
      y: number;
      z: number;
      scale: number;
      speed: number;
      phase: number;
      isRed: boolean;
    }> = [];
    for (let i = 0; i < count; i++) {
      // Deterministic pseudo-random distribution so renders are clean & reproducible
      const s1 = Math.sin(i * 12.9898) * 43758.5453;
      const s2 = Math.sin(i * 78.233) * 19341.231;
      const s3 = Math.sin(i * 45.164) * 91823.711;
      const r1 = s1 - Math.floor(s1);
      const r2 = s2 - Math.floor(s2);
      const r3 = s3 - Math.floor(s3);

      items.push({
        x: (r1 - 0.5) * 18,
        y: (r2 - 0.5) * 11,
        z: -1.5 - r3 * 12,
        scale: 0.035 + (i % 5) * 0.015,
        speed: 0.25 + (i % 7) * 0.06,
        phase: i * 0.83,
        isRed: i % 3 !== 0,
      });
    }
    return items;
  }, [count]);

  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const red = new THREE.Color('#FF101A');
    const dimWhite = new THREE.Color('#8E8E98');
    particles.forEach((p, idx) => {
      mesh.setColorAt(idx, p.isRed ? red : dimWhite);
    });
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [particles]);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      dummy.position.set(
        p.x + Math.sin(t * p.speed + p.phase) * 0.22,
        p.y + Math.cos(t * p.speed * 0.8 + p.phase) * 0.26,
        p.z
      );
      dummy.rotation.set(t * 0.3 + p.phase, t * 0.25, 0);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshBasicMaterial transparent opacity={0.68} />
    </instancedMesh>
  );
};

/**
 * Responsive Cinematic Camera Rig:
 * 1. Wide establishing shot -> smooth dolly-in to hero
 * 2. Gentle horizontal orbit + desktop pointer parallax
 * 3. Smooth scroll-driven depth arcs across portfolio sections
 */
const CinematicCameraRig: React.FC<{
  profile: CameraProfile;
  ready: boolean;
}> = ({ profile, ready }) => {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  const introRef = useRef({
    x: profile.startX,
    y: profile.startY,
    z: profile.startZ,
  });
  const scrollOffsetRef = useRef({ x: 0, y: 0, z: 0, lookY: 0 });
  const lookTarget = useRef(new THREE.Vector3(0.4, 0.1, -3.5));

  // Sync dynamic responsive FOV on resize
  useEffect(() => {
    const persp = camera as THREE.PerspectiveCamera;
    persp.fov = profile.fov;
    persp.updateProjectionMatrix();
  }, [camera, profile.fov]);

  // Pointer parallax listener (desktop & laptop only)
  useEffect(() => {
    if (profile.pointerStrength <= 0) {
      pointer.current = { x: 0, y: 0 };
      return;
    }
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [profile.pointerStrength]);

  // Hero establishing dolly-in once PageLoader finishes
  useEffect(() => {
    if (!ready) {
      introRef.current.x = profile.startX;
      introRef.current.y = profile.startY;
      introRef.current.z = profile.startZ;
      return;
    }

    const tween = gsap.to(introRef.current, {
      x: profile.heroX,
      y: profile.heroY,
      z: profile.heroZ,
      duration: 2.3,
      delay: 0.15,
      ease: 'power3.out',
    });

    return () => {
      tween.kill();
    };
  }, [ready, profile.heroX, profile.heroY, profile.heroZ, profile.startX, profile.startY, profile.startZ]);

  // Continuous Scroll-Driven Camera Arcs across Sections
  useEffect(() => {
    const isCompact = profile.tier === 'mobile' || profile.tier === 'tablet';
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.4,
      },
    });

    tl.to(scrollOffsetRef.current, {
      x: isCompact ? 0 : 1.15,
      y: -0.6,
      z: isCompact ? -0.9 : -2.1,
      lookY: -0.2,
      duration: 0.35,
      ease: 'none',
    })
      .to(scrollOffsetRef.current, {
        x: isCompact ? 0 : -1.1,
        y: 0.45,
        z: isCompact ? -1.4 : -3.2,
        lookY: 0.1,
        duration: 0.35,
        ease: 'none',
      })
      .to(scrollOffsetRef.current, {
        x: 0,
        y: -0.15,
        z: -0.6,
        lookY: 0,
        duration: 0.3,
        ease: 'none',
      });

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [profile.tier]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const smooth = Math.min(1, delta * 3.4);

    const orbitX = Math.sin(t * 0.28) * profile.orbitX;
    const orbitY = Math.cos(t * 0.22) * profile.orbitY;

    const targetX =
      introRef.current.x +
      scrollOffsetRef.current.x +
      orbitX +
      pointer.current.x * profile.pointerStrength;
    const targetY =
      introRef.current.y +
      scrollOffsetRef.current.y +
      orbitY -
      pointer.current.y * (profile.pointerStrength * 0.45);
    const targetZ = introRef.current.z + scrollOffsetRef.current.z;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, smooth);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, smooth);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, smooth);

    const lookX = profile.tier === 'desktop' || profile.tier === 'laptop' ? 0.55 : 0;
    lookTarget.current.x = THREE.MathUtils.lerp(lookTarget.current.x, lookX, smooth);
    lookTarget.current.y = THREE.MathUtils.lerp(
      lookTarget.current.y,
      scrollOffsetRef.current.lookY,
      smooth
    );
    camera.lookAt(lookTarget.current);
  });

  return null;
};

interface Scene3DProps {
  ready?: boolean;
}

export const Scene3D: React.FC<Scene3DProps> = ({ ready = true }) => {
  const reducedMotion = useReducedMotion();
  const [webglSupported, setWebglSupported] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);
  const [profile, setProfile] = useState<CameraProfile>(() =>
    getCameraProfile(typeof window !== 'undefined' ? window.innerWidth : 1440)
  );

  useEffect(() => {
    setWebglSupported(checkWebGLSupport());
    const onResize = () => {
      setProfile(getCameraProfile(window.innerWidth));
    };
    const onVisibility = () => {
      setTabVisible(!document.hidden);
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  const fallback = (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-[#080808]"
      aria-hidden="true"
    >
      <div className="cr-tech-grid absolute inset-0 opacity-60" />
    </div>
  );

  if (reducedMotion || !webglSupported) {
    return fallback;
  }

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none bg-[#080808]"
      aria-hidden="true"
    >
      <WebGLErrorBoundary fallback={fallback}>
        <Canvas
          frameloop={tabVisible ? 'always' : 'never'}
          dpr={profile.dpr}
          camera={{
            position: [profile.startX, profile.startY, profile.startZ],
            fov: profile.fov,
            near: 0.1,
            far: 60,
          }}
          gl={{
            antialias: profile.tier !== 'mobile',
            powerPreference: 'high-performance',
            alpha: false,
          }}
        >
          <color attach="background" args={['#080808']} />
          <fog attach="fog" args={['#0A0304', 9, 28]} />

          {/* Atmospheric Black & Crimson Studio Lighting */}
          <ambientLight intensity={0.35} color="#FFFFFF" />
          <directionalLight position={[5, 7, 6]} intensity={0.9} color="#FFFFFF" />
          <pointLight position={[4.2, 1.5, 1.2]} intensity={3.4} distance={18} color="#FF101A" />
          <pointLight position={[-5, -2, -2]} intensity={1.4} distance={16} color="#650000" />

          {/* Subtle Crimson Perspective Floor Grid */}
          <gridHelper
            args={[36, 36, '#650000', '#240909']}
            position={[0, -3.9, -4]}
          />

          <AngularShards3D scale={profile.sceneScale} />
          <NetworkArcs3D scale={profile.sceneScale} />
          <FloatingParticles3D count={profile.particleCount} />
          <CinematicCameraRig profile={profile} ready={ready} />
        </Canvas>
      </WebGLErrorBoundary>

      {/* Atmospheric vignette keeping foreground typography ultra-legible */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 68% 42%, rgba(255, 16, 26, 0.08) 0%, rgba(8, 8, 8, 0.58) 72%, rgba(8, 8, 8, 0.82) 100%)',
        }}
      />
    </div>
  );
};
