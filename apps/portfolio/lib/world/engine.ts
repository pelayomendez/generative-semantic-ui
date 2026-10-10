import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Cluster, Edge } from "./cluster";
import { Field, Stars } from "./field";
import { hashString, mulberry32, range } from "./random";
import { DEFAULT_PALETTE, approach, createShared, easeInOutSine } from "./shared";
import type { World, WorldOptions, WorldPalette } from "./types";

const UP = new THREE.Vector3(0, 1, 0);
const BASE_FOV = 55;
/** Oldest off-route leaves are pruned beyond this many clusters. */
const MAX_CLUSTERS = 64;

interface Flight {
  from: THREE.Vector3;
  fromLook: THREE.Vector3;
  ctrl: THREE.Vector3;
  t: number;
  duration: number;
}

/**
 * Mounts a navigable 3D world on `canvas`. Throws if WebGL is unavailable —
 * callers should catch and render a fallback.
 */
export function createWorld(canvas: HTMLCanvasElement, options: WorldOptions = {}): World {
  const palette: WorldPalette = { ...DEFAULT_PALETTE, ...options.palette };
  const reducedMotion =
    options.reducedMotion ?? window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parallax = options.parallax ?? true;
  const focusOffset = options.focusOffset ?? { x: 0.24, y: 0.06 };
  const shared = createShared(palette, reducedMotion);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, options.maxPixelRatio ?? 1.75));
  // AgX rolls bright additive overlaps off to a soft white instead of
  // clipping to a hard, oversaturated red.
  renderer.toneMapping = THREE.AgXToneMapping;
  renderer.toneMappingExposure = 1.15;

  const scene = new THREE.Scene();
  scene.background = shared.colors.background;
  const fog = new THREE.FogExp2(shared.colors.background, 0.0062);
  scene.fog = fog;

  const camera = new THREE.PerspectiveCamera(BASE_FOV, 1, 0.1, 3000);

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.5, 0.7, 0.22);
  if (options.bloom ?? true) composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const stars = new Stars(shared);
  scene.add(stars.points);
  const field = new Field(shared);
  scene.add(field.group);

  // ---- World graph ------------------------------------------------------

  let clock = 0;
  const clusters: Cluster[] = [];
  const root = new Cluster(
    "",
    null,
    new THREE.Vector3(),
    new THREE.Vector3(1, 0, -0.35).normalize(),
    11,
    { az: Math.PI / 2, el: 0.16, dist: 62 },
    0,
    mulberry32(hashString("home")),
    shared,
  );
  clusters.push(root);
  scene.add(root.group);

  function grow(parent: Cluster, key: string, depth: number): Cluster {
    const rng = mulberry32(hashString(`${depth}␟${key}`));
    // Continue roughly along the direction of travel, fanning out; keep the
    // candidate that sits furthest from everything already grown.
    let bestPos = new THREE.Vector3();
    let bestDir = parent.dir.clone();
    let bestScore = -1;
    for (let k = 0; k < 10; k++) {
      const d = parent.dir.clone().applyAxisAngle(UP, range(rng, -1.15, 1.15));
      const side = new THREE.Vector3().crossVectors(d, UP).normalize();
      d.applyAxisAngle(side, range(rng, -0.4, 0.4));
      d.y *= 0.7;
      d.normalize();
      const p = parent.position.clone().addScaledVector(d, range(rng, 64, 86));
      let score = Infinity;
      for (const c of clusters) score = Math.min(score, c.position.distanceTo(p));
      if (score > bestScore) {
        bestScore = score;
        bestPos = p;
        bestDir = d;
      }
    }
    // Frame the new cluster from the side, so the trail back to its
    // parent stays in shot.
    const back = parent.position.clone().sub(bestPos);
    const az = Math.atan2(back.z, back.x) + (rng() < 0.5 ? -1 : 1) * range(rng, 0.9, 1.3);
    const radius = range(rng, 6, 9);
    const cluster = new Cluster(
      key,
      parent,
      bestPos,
      bestDir,
      radius,
      { az, el: range(rng, 0.14, 0.34), dist: radius * range(rng, 4, 4.8) },
      clock,
      rng,
      shared,
    );
    cluster.edge = new Edge(parent, cluster, rng, shared);
    parent.children.push(cluster);
    clusters.push(cluster);
    scene.add(cluster.group, cluster.edge.group);
    return cluster;
  }

  function prune(route: Set<Cluster>) {
    while (clusters.length > MAX_CLUSTERS) {
      const victim = clusters.find((c) => c !== root && c.children.length === 0 && !route.has(c));
      if (!victim) return;
      clusters.splice(clusters.indexOf(victim), 1);
      const siblings = victim.parent!.children;
      siblings.splice(siblings.indexOf(victim), 1);
      scene.remove(victim.group, victim.edge!.group);
      victim.dispose();
    }
  }

  // ---- Camera rig -------------------------------------------------------

  let current = root;
  let flight: Flight | null = null;
  const look = new THREE.Vector3();
  const pointer = new THREE.Vector2();
  const pointerSmooth = new THREE.Vector2();

  function viewpoint(c: Cluster, out: THREE.Vector3) {
    const sway = reducedMotion ? 0 : Math.sin(clock * 0.05) * 0.1;
    const az = c.view.az + sway;
    const el = c.view.el + (reducedMotion ? 0 : Math.sin(clock * 0.04) * 0.02);
    return out
      .set(Math.cos(el) * Math.cos(az), Math.sin(el), Math.cos(el) * Math.sin(az))
      .multiplyScalar(c.view.dist)
      .add(c.position);
  }

  viewpoint(root, camera.position);
  look.copy(root.position);

  function flyTo(target: Cluster) {
    if (target === current && !flight) return;
    current = target;
    const dest = viewpoint(target, new THREE.Vector3());
    const from = camera.position.clone();
    const span = from.distanceTo(dest);
    const side = new THREE.Vector3().subVectors(dest, from).cross(UP).normalize();
    // A gentle arc over and to the side — reads as travel, not a dolly.
    const ctrl = from
      .clone()
      .lerp(dest, 0.5)
      .addScaledVector(UP, span * 0.1)
      .addScaledVector(side, span * 0.04);
    flight = {
      from,
      fromLook: look.clone(),
      ctrl,
      t: 0,
      duration: reducedMotion ? 0.001 : THREE.MathUtils.clamp(2.2 + span / 70, 2.8, 4.6),
    };
  }

  const dest = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const right = new THREE.Vector3();
  const camUp = new THREE.Vector3();

  function updateCamera(dt: number) {
    viewpoint(current, dest);
    let fovKick = 0;
    if (flight) {
      flight.t += dt;
      const p = Math.min(1, flight.t / flight.duration);
      const e = easeInOutSine(p);
      // Quadratic Bézier from → ctrl → (moving) destination.
      const u = 1 - e;
      camera.position
        .copy(flight.from)
        .multiplyScalar(u * u)
        .addScaledVector(flight.ctrl, 2 * u * e)
        .addScaledVector(dest, e * e);
      look.copy(flight.fromLook).lerp(current.position, easeInOutSine(p));
      fovKick = Math.sin(p * Math.PI) * 2;
      if (p >= 1) flight = null;
    } else {
      const k = 1 - Math.exp(-dt * 0.8);
      camera.position.lerp(dest, k);
      look.lerp(current.position, k);
    }

    pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 0.7));
    camera.lookAt(look);
    if (parallax && !reducedMotion) {
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      camUp.setFromMatrixColumn(camera.matrixWorld, 1);
      tmp.copy(right).multiplyScalar(pointerSmooth.x * 0.5).addScaledVector(camUp, pointerSmooth.y * 0.35);
      camera.position.add(tmp);
      camera.lookAt(look);
    }

    const fov = BASE_FOV + fovKick;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }
  }

  // ---- State ------------------------------------------------------------

  let pending = false;
  let energy = 0;
  let route = new Set<Cluster>([root]);

  function applyEmphasis() {
    for (const c of clusters) {
      c.emphasis = c === current ? "current" : route.has(c) ? "path" : "dim";
      if (c.edge) c.edge.emphasis = !route.has(c) ? "dim" : c === current ? "current" : "path";
    }
  }
  applyEmphasis();

  // ---- Loop, sizing, input ----------------------------------------------

  let last = performance.now();
  renderer.setAnimationLoop(() => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    clock += dt;

    energy = approach(energy, pending ? 1 : flight ? 0.6 : 0, dt, 0.8);
    updateCamera(dt);
    for (const c of clusters) {
      c.update(dt, clock, pending);
      c.edge?.update(dt, clock, pending);
    }
    tmp.set(0, 0, -50).applyQuaternion(camera.quaternion).add(camera.position);
    field.update(dt, tmp, energy);
    stars.update(dt, camera.position);
    bloom.strength = 0.5 + energy * 0.1;
    composer.render(dt);
  });

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    bloom.resolution.set(w, h);
    camera.aspect = w / h;
    // Shift the projection so the focused cluster sits beside the host's
    // content column instead of behind it. Narrow screens stay centred.
    const fx = w >= 900 ? focusOffset.x : 0;
    camera.setViewOffset(w, h, -fx * w, focusOffset.y * h, w, h);
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function onPointer(e: PointerEvent) {
    pointer.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
  }
  // Ease the parallax back to centre when the cursor leaves the page or
  // the window loses focus, instead of holding the last edge position.
  function onPointerAway(e?: Event) {
    if (e?.type === "pointerout" && (e as PointerEvent).relatedTarget) return;
    pointer.set(0, 0);
  }
  window.addEventListener("pointermove", onPointer, { passive: true });
  document.addEventListener("pointerout", onPointerAway);
  window.addEventListener("blur", onPointerAway);

  // ---- Public API -------------------------------------------------------

  return {
    setPath(path) {
      let node = root;
      const nextRoute = new Set<Cluster>([root]);
      path.forEach((key, depth) => {
        node = node.children.find((c) => c.key === key) ?? grow(node, key, depth);
        nextRoute.add(node);
      });
      route = nextRoute;
      flyTo(node);
      applyEmphasis();
      prune(route);
    },
    setPending(p) {
      pending = p;
    },
    setPalette(next) {
      Object.assign(palette, next);
      for (const k of Object.keys(shared.colors) as Array<keyof WorldPalette>) {
        shared.colors[k].set(palette[k]);
      }
      fog.color.copy(shared.colors.background);
    },
    dispose() {
      renderer.setAnimationLoop(null);
      ro.disconnect();
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("pointerout", onPointerAway);
      window.removeEventListener("blur", onPointerAway);
      for (const c of clusters) c.dispose();
      field.dispose();
      stars.dispose();
      shared.dot.dispose();
      shared.glow.dispose();
      composer.dispose();
      renderer.dispose();
    },
  };
}
