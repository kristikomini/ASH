"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ScreenQuad } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

/*
  Optional real photograph. It is fetched NON-BLOCKINGLY (via fetch, so it never
  delays the page `load` event) and swapped in only if it arrives within the
  timeout — otherwise the procedural plaster texture below is used. Swap this for
  your own architectural photography when deploying, or set to null to disable.
*/
// Local same-origin architectural photo (in /public). Loaded non-blockingly and
// swapped over the procedural default; set to null to keep the procedural texture.
const REMOTE_TEXTURE: string | null = "/hero-light.jpg";

/* On-brand procedural "plaster / rasatura" surface — instant, zero network.
   Light ivory to match the baked hero (this is the pre-swap flash). */
function makePlasterTexture(): THREE.CanvasTexture {
  const size = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!;

  // base vertical gradient (bright ivory → page paper)
  const g = ctx.createLinearGradient(0, 0, 0, size);
  g.addColorStop(0, "#f8f5ee");
  g.addColorStop(0.55, "#f3efe5");
  g.addColorStop(1, "#f4f0e7");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);

  // soft champagne raking light (upper-right) — matches the baked glow
  const rg = ctx.createRadialGradient(760, 280, 40, 760, 280, 720);
  rg.addColorStop(0, "rgba(226,194,136,0.30)");
  rg.addColorStop(1, "rgba(226,194,136,0)");
  ctx.fillStyle = rg;
  ctx.fillRect(0, 0, size, size);

  // subtle trowel streaks — bronze shadows on the light surface
  ctx.globalAlpha = 0.05;
  ctx.strokeStyle = "#8f6f3f";
  for (let i = 0; i < 22; i++) {
    ctx.beginPath();
    const y = Math.random() * size;
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(size * 0.3, y - 40, size * 0.7, y + 40, size, y);
    ctx.lineWidth = 1 + Math.random() * 2;
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // fine grain
  const img = ctx.getImageData(0, 0, size, size);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 14;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
  }
  ctx.putImageData(img, 0, 0);

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  return tex;
}

/* Fullscreen triangle — position is already in clip space. */
const vertexShader = /* glsl */ `
  void main() {
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

/*
  The texture is ALREADY colour-graded + vignetted when baked (public/hero-light.jpg),
  so the shader no longer re-grades it (doing so is what crushed the old bright
  photo to black). It now passes the image through and only ADDS life:
    · a slow, drifting warm "raking light" sheen that catches the trowel ridges
    · a warm bloom that follows the cursor, with a soft lens displacement
    · a one-time bottom-up cinematic wipe on first paint
*/
const fragmentShader = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform float uProgress;
  uniform float uHover;
  uniform vec2  uMouse;
  uniform vec2  uRes;
  uniform vec2  uImageRes;
  uniform sampler2D uTexture;
  uniform vec3  uGold;
  uniform vec3  uGoldLight;

  vec2 coverUv(vec2 uv, vec2 res, vec2 img) {
    float rs = res.x / res.y;
    float ri = img.x / img.y;
    vec2 nw = rs < ri
      ? vec2(img.x * res.y / img.y, res.y)
      : vec2(res.x, img.y * res.x / img.x);
    vec2 offset = (rs < ri
      ? vec2((nw.x - res.x) * 0.5, 0.0)
      : vec2(0.0, (nw.y - res.y) * 0.5)) / nw;
    return uv * res / nw + offset;
  }

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 cuv = coverUv(uv, uRes, uImageRes);

    // Tiny organic breathing + a soft lens pull toward the cursor.
    float t = uTime * 0.05;
    vec2 flow = vec2(noise(cuv * 2.0 + t), noise(cuv * 2.0 - t)) - 0.5;
    float d = distance(uv, uMouse);
    float infl = smoothstep(0.5, 0.0, d) * uHover;
    vec2 dir = normalize(uv - uMouse + 1e-4);
    vec2 disp = (flow * 0.004 + dir * infl * 0.014) * mix(0.4, 1.0, uProgress);

    vec3 col = texture2D(uTexture, cuv + disp).rgb;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));

    // Drifting raking light from the upper-right — reinforces the baked glow.
    // Intensities are LOW: the surface is bright ivory and additive gold
    // clips to white quickly.
    float lightPos = uv.x * 0.6 + uv.y * 0.4 + 0.12 * sin(uTime * 0.18 + uv.y * 2.2);
    float band = smoothstep(0.45, 1.05, lightPos);
    float sheen = smoothstep(0.30, 0.95, lum + band * 0.35);
    col += uGold * sheen * band * 0.055;

    // Warm cursor bloom (only where the pointer is) — a soft champagne lift.
    col += uGoldLight * infl * 0.07;
    col *= 1.0 + infl * 0.04;

    // Whisper of a vignette (the baked image already carries most of it).
    float vig = smoothstep(1.3, 0.42, distance(uv, vec2(0.56, 0.44)));
    col *= mix(1.0, vig, 0.08);

    // First-paint bottom-up wipe.
    float reveal = smoothstep(0.0, 1.0, uProgress);
    float alpha = smoothstep(0.0, 0.8, reveal - (1.0 - uv.y) * 0.3 * (1.0 - reveal));

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

function Scene() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(new THREE.Vector2(0.5, 0.5));
  const gl = useThree((s) => s.gl);

  const base = useMemo(() => makePlasterTexture(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uHover: { value: 1 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uRes: { value: new THREE.Vector2(1, 1) },
      uImageRes: {
        value: new THREE.Vector2(base.image.width, base.image.height),
      },
      uTexture: { value: base as THREE.Texture },
      uGold: { value: new THREE.Color("#c6a15b") },
      uGoldLight: { value: new THREE.Color("#e7cf9b") },
    }),
    [base]
  );

  // Cinematic reveal — runs immediately, no network dependency.
  useEffect(() => {
    const tw = gsap.to(uniforms.uProgress, {
      value: 1,
      duration: 2.3,
      ease: "power2.out",
      delay: 0.15,
    });
    return () => {
      tw.kill();
    };
  }, [uniforms]);

  // Non-blocking real-photo swap (fetch never blocks the load event).
  useEffect(() => {
    if (!REMOTE_TEXTURE) return;
    let cancelled = false;
    const ac = new AbortController();
    const timeout = setTimeout(() => ac.abort(), 6000);

    fetch(REMOTE_TEXTURE, { signal: ac.signal, mode: "cors" })
      .then((r) => (r.ok ? r.blob() : Promise.reject()))
      .then((b) => createImageBitmap(b))
      .then((bmp) => {
        if (cancelled) return;
        const cv = document.createElement("canvas");
        cv.width = bmp.width;
        cv.height = bmp.height;
        cv.getContext("2d")!.drawImage(bmp, 0, 0);
        bmp.close();
        const t = new THREE.CanvasTexture(cv);
        t.colorSpace = THREE.SRGBColorSpace;
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        uniforms.uTexture.value = t;
        uniforms.uImageRes.value.set(bmp.width, bmp.height);
      })
      .catch(() => {
        /* offline / blocked → keep procedural plaster */
      })
      .finally(() => clearTimeout(timeout));

    return () => {
      cancelled = true;
      ac.abort();
      clearTimeout(timeout);
    };
  }, [uniforms]);

  // Pointer tracking (window-level so it works behind the foreground text).
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Dispose the procedural texture on unmount.
  useEffect(() => () => base.dispose(), [base]);

  useFrame((state) => {
    const u = uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMouse.value.lerp(pointer.current, 0.06);
    u.uRes.value.set(gl.domElement.width, gl.domElement.height);
  });

  return (
    <ScreenQuad>
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </ScreenQuad>
  );
}

export default function HeroCanvas() {
  // Guard against a missed initial ResizeObserver callback: a few resize events
  // over the first moments make R3F re-measure the container once its listener
  // is attached. Redundant (harmless) where the observer already fired.
  useEffect(() => {
    const fire = () => window.dispatchEvent(new Event("resize"));
    const timers = [80, 300, 800].map((d) => window.setTimeout(fire, d));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <Canvas
      flat
      dpr={[1, 1.75]}
      frameloop="always"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene />
    </Canvas>
  );
}
