import * as THREE from "three";
import { range, type Rng } from "./random";
import { approach, disposeObject, easeOutCubic, type Shared } from "./shared";

// A cluster is one region of the world: a neuron-like plexus grown from
// a single step of the visitor's path. Its shape is seeded by the step
// key, so the same question always produces the same structure.

type Archetype = "shell" | "ring" | "lattice";

/** How prominent a cluster or edge should be right now. */
export type Emphasis = "dim" | "path" | "current";

const LEVELS: Record<Emphasis, { points: number; lines: number; glow: number; heat: number }> = {
  dim: { points: 0.28, lines: 0.07, glow: 0.05, heat: 0 },
  path: { points: 0.7, lines: 0.2, glow: 0.3, heat: 0.25 },
  current: { points: 1, lines: 0.34, glow: 0.42, heat: 1 },
};

interface Shape {
  points: THREE.Vector3[];
  /** Index pairs that must be linked regardless of distance (dendrites, rings). */
  links: Array<[number, number]>;
  linkDist: number;
}

function fibonacciShell(rng: Rng, n: number, r: number, out: THREE.Vector3[]) {
  for (let i = 0; i < n; i++) {
    const y = 1 - (2 * (i + 0.5)) / n;
    const rr = Math.sqrt(1 - y * y);
    const phi = i * 2.399963 + range(rng, -0.15, 0.15);
    const k = r * range(rng, 0.9, 1.1);
    out.push(new THREE.Vector3(Math.cos(phi) * rr * k, y * k, Math.sin(phi) * rr * k));
  }
}

function buildShape(rng: Rng, archetype: Archetype, r: number): Shape {
  const points: THREE.Vector3[] = [];
  const links: Array<[number, number]> = [];

  if (archetype === "shell") {
    fibonacciShell(rng, Math.floor(range(rng, 56, 92)), r, points);
    return { points, links, linkDist: r * 0.62 };
  }

  if (archetype === "ring") {
    fibonacciShell(rng, Math.floor(range(rng, 30, 46)), r * 0.72, points);
    const start = points.length;
    const m = Math.floor(range(rng, 54, 80));
    const ringR = r * range(rng, 1.7, 2.2);
    const tilt = new THREE.Euler(range(rng, -0.7, 0.7), 0, range(rng, -0.5, 0.5));
    for (let i = 0; i < m; i++) {
      const a = (i / m) * Math.PI * 2;
      const rr = ringR * range(rng, 0.94, 1.06);
      points.push(
        new THREE.Vector3(Math.cos(a) * rr, range(rng, -0.4, 0.4), Math.sin(a) * rr).applyEuler(tilt),
      );
      if (i > 0) links.push([start + i - 1, start + i]);
    }
    links.push([start + m - 1, start]);
    return { points, links, linkDist: r * 0.6 };
  }

  // lattice: a dense soma with dendrites reaching outwards.
  const n = Math.floor(range(rng, 44, 64));
  for (let i = 0; i < n; i++) {
    const d = new THREE.Vector3(range(rng, -1, 1), range(rng, -1, 1), range(rng, -1, 1)).normalize();
    points.push(d.multiplyScalar(r * Math.pow(rng(), 0.55)));
  }
  const branches = Math.floor(range(rng, 4, 7));
  for (let b = 0; b < branches; b++) {
    const dir = new THREE.Vector3(range(rng, -1, 1), range(rng, -1, 1), range(rng, -1, 1)).normalize();
    let prev = -1;
    const p = dir.clone().multiplyScalar(r * 0.8);
    const steps = Math.floor(range(rng, 4, 8));
    for (let s = 0; s < steps; s++) {
      dir.add(new THREE.Vector3(range(rng, -0.45, 0.45), range(rng, -0.45, 0.45), range(rng, -0.45, 0.45))).normalize();
      p.addScaledVector(dir, r * range(rng, 0.3, 0.5));
      points.push(p.clone());
      const idx = points.length - 1;
      if (prev >= 0) links.push([prev, idx]);
      prev = idx;
    }
  }
  return { points, links, linkDist: r * 0.5 };
}

function linkSegments(shape: Shape): Float32Array {
  const { points, links, linkDist } = shape;
  const pairs: Array<[number, number]> = [...links];
  const maxPer = 4;
  const degree = new Array(points.length).fill(0);
  const d2 = linkDist * linkDist;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      if (degree[i] >= maxPer || degree[j] >= maxPer) continue;
      if (points[i].distanceToSquared(points[j]) < d2) {
        pairs.push([i, j]);
        degree[i]++;
        degree[j]++;
      }
    }
  }
  const out = new Float32Array(pairs.length * 6);
  pairs.forEach(([a, b], k) => {
    points[a].toArray(out, k * 6);
    points[b].toArray(out, k * 6 + 3);
  });
  return out;
}

export class Cluster {
  readonly group = new THREE.Group();
  readonly children: Cluster[] = [];
  edge: Edge | null = null;
  emphasis: Emphasis = "dim";

  private readonly pointsMat: THREE.PointsMaterial;
  private readonly linesMat: THREE.LineBasicMaterial;
  private readonly coreMat: THREE.SpriteMaterial;
  private readonly glowMat: THREE.SpriteMaterial;
  private readonly glow: THREE.Sprite;
  private readonly core: THREE.Sprite;
  private readonly nucleus: THREE.LineSegments;
  private readonly nucleusMat: THREE.LineBasicMaterial;
  private readonly spin: THREE.Vector3;
  private appear = 0;
  private heat = 0;

  constructor(
    readonly key: string,
    readonly parent: Cluster | null,
    readonly position: THREE.Vector3,
    /** Direction of travel into this cluster; children continue roughly along it. */
    readonly dir: THREE.Vector3,
    readonly radius: number,
    /** Camera framing around this cluster. */
    readonly view: { az: number; el: number; dist: number },
    readonly born: number,
    rng: Rng,
    private readonly shared: Shared,
  ) {
    const archetypes: Archetype[] = ["shell", "ring", "lattice"];
    const archetype = parent ? archetypes[Math.floor(rng() * archetypes.length)] : "shell";
    const shape = buildShape(rng, archetype, radius);

    const pointsGeo = new THREE.BufferGeometry().setFromPoints(shape.points);
    this.pointsMat = new THREE.PointsMaterial({
      size: range(rng, 0.9, 1.3),
      map: shared.dot,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.group.add(new THREE.Points(pointsGeo, this.pointsMat));

    const linesGeo = new THREE.BufferGeometry();
    linesGeo.setAttribute("position", new THREE.BufferAttribute(linkSegments(shape), 3));
    this.linesMat = new THREE.LineBasicMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.group.add(new THREE.LineSegments(linesGeo, this.linesMat));

    // Nucleus: a soft lit point rather than geometry, so it never reads
    // as faceted under bloom.
    this.coreMat = new THREE.SpriteMaterial({
      map: shared.glow,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.core = new THREE.Sprite(this.coreMat);
    this.core.scale.setScalar(radius * 0.7);
    this.group.add(this.core);

    // A small seeded polyhedron inside the light, drawn by its edges only,
    // so each nucleus has its own crystalline signature.
    const solids = [
      (r: number) => new THREE.TetrahedronGeometry(r),
      (r: number) => new THREE.OctahedronGeometry(r),
      (r: number) => new THREE.IcosahedronGeometry(r),
      (r: number) => new THREE.DodecahedronGeometry(r),
      (r: number) => new THREE.IcosahedronGeometry(r, 1),
    ];
    const solid = solids[Math.floor(rng() * solids.length)](radius * range(rng, 0.18, 0.26));
    this.nucleusMat = new THREE.LineBasicMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.nucleus = new THREE.LineSegments(new THREE.EdgesGeometry(solid), this.nucleusMat);
    solid.dispose();
    this.group.add(this.nucleus);

    this.glowMat = new THREE.SpriteMaterial({
      map: shared.glow,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.glow = new THREE.Sprite(this.glowMat);
    this.glow.scale.setScalar(radius * 2.6);
    this.group.add(this.glow);

    this.spin = new THREE.Vector3(range(rng, -0.04, 0.04), range(rng, 0.04, 0.12), range(rng, -0.03, 0.03));
    this.group.rotation.set(rng() * Math.PI, rng() * Math.PI, 0);
    this.group.position.copy(position);
    this.group.scale.setScalar(0.001);
  }

  update(dt: number, time: number, pending: boolean) {
    const c = this.shared.colors;
    const level = LEVELS[this.emphasis];
    this.appear = Math.min(1, this.appear + dt / (this.shared.reducedMotion ? 0.2 : 2.4));
    this.heat = approach(this.heat, level.heat, dt, 3);

    const grow = easeOutCubic(this.appear);
    const forming = pending && this.emphasis === "current";
    const breathe = forming ? 1 + Math.sin(time * 1.8) * 0.025 : 1;
    this.group.scale.setScalar(Math.max(0.001, grow * breathe));

    if (!this.shared.reducedMotion) {
      this.group.rotation.x += this.spin.x * dt;
      this.group.rotation.y += this.spin.y * dt * (forming ? 1.6 : 1);
      this.group.rotation.z += this.spin.z * dt;
    }

    this.pointsMat.opacity = approach(this.pointsMat.opacity, level.points * grow, dt, 4);
    this.linesMat.opacity = approach(this.linesMat.opacity, level.lines * grow, dt, 4);
    this.coreMat.opacity = approach(this.coreMat.opacity, (0.2 + this.heat * 0.5) * grow, dt, 4);
    const pulse = forming ? 0.8 + Math.sin(time * 2.2) * 0.2 : 1;
    this.glowMat.opacity = approach(this.glowMat.opacity, level.glow * grow * pulse, dt, 6);

    this.pointsMat.color.copy(c.node).lerp(c.accent, this.heat * 0.15);
    this.linesMat.color.copy(c.line).lerp(c.accent, this.heat * 0.35);
    this.coreMat.color.copy(c.node).lerp(c.accent, this.heat);
    this.nucleusMat.opacity = approach(this.nucleusMat.opacity, (0.25 + this.heat * 0.35) * grow, dt, 4);
    // Same tint as the nucleus light, so the solid reads as part of it.
    this.nucleusMat.color.copy(this.coreMat.color);
    if (!this.shared.reducedMotion) {
      this.nucleus.rotation.y -= dt * 0.5;
      this.nucleus.rotation.x += dt * 0.2;
    }
    this.glowMat.color.copy(c.line).lerp(c.accent, this.heat);
  }

  dispose() {
    disposeObject(this.group);
    this.edge?.dispose();
  }
}

// The trail between a cluster and its parent: a curved synapse drawn
// progressively, dotted like a flight path, with a pulse travelling it
// while it sits on the active route.
export class Edge {
  readonly group = new THREE.Group();
  emphasis: Emphasis = "dim";

  private readonly curve: THREE.CubicBezierCurve3;
  private readonly line: THREE.Line;
  private readonly lineMat: THREE.LineBasicMaterial;
  private readonly dots: THREE.Points;
  private readonly dotsMat: THREE.PointsMaterial;
  private readonly dotCount: number;
  private readonly pulse: THREE.Sprite;
  private readonly pulseMat: THREE.SpriteMaterial;
  private readonly segments = 96;
  private growth = 0;
  private heat = 0;
  private readonly phase: number;

  constructor(from: Cluster, to: Cluster, rng: Rng, private readonly shared: Shared) {
    const a = from.position;
    const b = to.position;
    const span = a.distanceTo(b);
    const bend = () =>
      new THREE.Vector3(range(rng, -1, 1), range(rng, -0.6, 0.6), range(rng, -1, 1)).multiplyScalar(span * 0.18);
    this.curve = new THREE.CubicBezierCurve3(
      a.clone(),
      a.clone().addScaledVector(from.dir, span * 0.35).add(bend()),
      b.clone().addScaledVector(to.dir, -span * 0.35).add(bend()),
      b.clone(),
    );

    this.lineMat = new THREE.LineBasicMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(this.curve.getPoints(this.segments)),
      this.lineMat,
    );
    this.group.add(this.line);

    this.dotCount = Math.max(8, Math.floor(span / 2.4));
    this.dotsMat = new THREE.PointsMaterial({
      size: 0.7,
      map: shared.dot,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.dots = new THREE.Points(
      new THREE.BufferGeometry().setFromPoints(this.curve.getSpacedPoints(this.dotCount)),
      this.dotsMat,
    );
    this.group.add(this.dots);

    this.pulseMat = new THREE.SpriteMaterial({
      map: shared.glow,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0,
    });
    this.pulse = new THREE.Sprite(this.pulseMat);
    this.pulse.scale.setScalar(3.2);
    this.group.add(this.pulse);
    this.phase = rng();
  }

  update(dt: number, time: number, pending: boolean) {
    const c = this.shared.colors;
    const level = LEVELS[this.emphasis];
    this.growth = Math.min(1, this.growth + dt / (this.shared.reducedMotion ? 0.2 : 2.6));
    this.heat = approach(this.heat, this.emphasis === "dim" ? 0 : 1, dt, 3);
    const g = easeOutCubic(this.growth);

    this.line.geometry.setDrawRange(0, Math.ceil(g * (this.segments + 1)));
    this.dots.geometry.setDrawRange(0, Math.ceil(g * (this.dotCount + 1)));

    this.lineMat.opacity = approach(this.lineMat.opacity, 0.1 + this.heat * 0.4, dt, 4);
    this.dotsMat.opacity = approach(this.dotsMat.opacity, 0.15 + this.heat * 0.75, dt, 4);
    this.lineMat.color.copy(c.line).lerp(c.accent, this.heat);
    this.dotsMat.color.copy(c.line).lerp(c.accent, this.heat * 0.8);

    // The pulse runs the active route towards the current step; faster
    // while the next step is still being composed.
    const speed = pending && this.emphasis === "current" ? 0.55 : 0.25;
    const u = this.shared.reducedMotion ? 1 : (time * speed + this.phase) % 1;
    this.curve.getPoint(Math.min(u, g), this.pulse.position);
    this.pulseMat.color.copy(c.accent);
    this.pulseMat.opacity = approach(this.pulseMat.opacity, level.heat > 0 ? 0.9 : 0, dt, 5);
  }

  dispose() {
    disposeObject(this.group);
  }
}
