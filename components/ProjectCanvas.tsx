"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform float uTime, uHover;
  uniform vec2 uMouse, uRes, uImageRes;
  uniform sampler2D uTexture;
  uniform vec3 uGold;

  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    float rs = res.x / res.y;
    float ri = img.x / img.y;
    vec2 nw = rs < ri ? vec2(img.x * res.y / img.y, res.y) : vec2(res.x, img.y * res.x / img.x);
    vec2 offset = (rs < ri ? vec2((nw.x - res.x) * 0.5, 0.0) : vec2(0.0, (nw.y - res.y) * 0.5)) / nw;
    return uv * res / nw + offset;
  }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453123); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x), mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x), u.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 z = (uv - 0.5) * (1.0 - uHover * 0.05) + 0.5;      // zoom on hover
    vec2 cuv = coverUv(z, uRes, uImageRes);

    float t = uTime * 0.1;
    vec2 flow = vec2(noise(cuv * 3.0 + t), noise(cuv * 3.0 - t)) - 0.5;
    float d = distance(uv, uMouse);
    float infl = smoothstep(0.5, 0.0, d) * uHover;
    vec2 dir = normalize(uv - uMouse + 1e-4);
    vec2 disp = flow * 0.006 * uHover + dir * infl * 0.03;

    float sh = uHover * 0.006;                               // RGB split
    float r = texture2D(uTexture, cuv + disp + dir * sh).r;
    float g = texture2D(uTexture, cuv + disp).g;
    float b = texture2D(uTexture, cuv + disp - dir * sh).b;
    vec3 col = vec3(r, g, b);

    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    float sheen = smoothstep(0.55, 1.0, lum + infl * 0.4);
    col += uGold * sheen * infl * 0.3;

    float vig = smoothstep(1.3, 0.35, distance(uv, vec2(0.5)));
    col *= mix(1.0, vig, 0.35);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Scene({ url }: { url: string }) {
  const gl = useThree((s) => s.gl);
  const target = useRef({ hover: 0, mx: 0.5, my: 0.5 });
  const [tex, setTex] = useState<THREE.Texture | null>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uHover: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImageRes: { value: new THREE.Vector2(1, 1) },
      uTexture: { value: null as THREE.Texture | null },
      uGold: { value: new THREE.Color("#c6a15b") },
    }),
    []
  );

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    let cancelled = false;
    let loadedTex: THREE.Texture | null = null;
    loader.load(
      url,
      (loaded) => {
        // Unmount raced the load (or StrictMode discarded this pass) → dispose now.
        if (cancelled) {
          loaded.dispose();
          return;
        }
        loaded.colorSpace = THREE.SRGBColorSpace;
        loaded.minFilter = THREE.LinearFilter;
        loaded.magFilter = THREE.LinearFilter;
        loaded.generateMipmaps = false;
        loadedTex = loaded;
        uniforms.uTexture.value = loaded;
        uniforms.uImageRes.value.set(
          loaded.image.width || 1600,
          loaded.image.height || 1067
        );
        setTex(loaded);
      },
      undefined,
      () => {}
    );
    return () => {
      cancelled = true;
      loadedTex?.dispose();
    };
  }, [url, uniforms]);

  useEffect(() => {
    const el = gl.domElement;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current.mx = (e.clientX - r.left) / r.width;
      target.current.my = 1 - (e.clientY - r.top) / r.height;
    };
    const onEnter = () => (target.current.hover = 1);
    const onLeave = () => (target.current.hover = 0);
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [gl]);

  useFrame((state) => {
    const u = uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uHover.value += (target.current.hover - u.uHover.value) * 0.08;
    u.uMouse.value.x += (target.current.mx - u.uMouse.value.x) * 0.1;
    u.uMouse.value.y += (target.current.my - u.uMouse.value.y) * 0.1;
    u.uRes.value.set(gl.domElement.width, gl.domElement.height);
  });

  if (!tex) return null;

  return (
    <ScreenQuad>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function ProjectCanvas({ url }: { url: string }) {
  // Single resize nudge for envs where the initial ResizeObserver is missed.
  useEffect(() => {
    const id = window.setTimeout(
      () => window.dispatchEvent(new Event("resize")),
      120
    );
    return () => clearTimeout(id);
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene url={url} />
    </Canvas>
  );
}
