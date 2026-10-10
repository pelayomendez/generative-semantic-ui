import * as THREE from "three";
import { disposeObject, type Shared } from "./shared";

// Ambient plexus: drifting neurons that link up when they come close.
// The volume follows the camera (positions wrap around an anchor), so
// the space always feels inhabited wherever the visitor travels.
export class Field {
  readonly group = new THREE.Group();

  private readonly count: number;
  private readonly size: number;
  private readonly linkDist: number;
  private readonly pos: Float32Array;
  private readonly vel: Float32Array;
  private readonly pointsGeo: THREE.BufferGeometry;
  private readonly pointsMat: THREE.PointsMaterial;
  private readonly linesGeo: THREE.BufferGeometry;
  private readonly linesMat: THREE.LineBasicMaterial;
  private readonly maxSegments: number;

  constructor(
    private readonly shared: Shared,
    { count = 170, size = 220, linkDist = 24 } = {},
  ) {
    this.count = count;
    this.size = size;
    this.linkDist = linkDist;
    this.pos = new Float32Array(count * 3);
    this.vel = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      this.pos[i] = (Math.random() - 0.5) * size;
      this.vel[i] = (Math.random() - 0.5) * 1.6;
    }

    this.pointsGeo = new THREE.BufferGeometry();
    this.pointsGeo.setAttribute("position", new THREE.BufferAttribute(this.pos, 3));
    this.pointsMat = new THREE.PointsMaterial({
      size: 0.8,
      map: shared.dot,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      opacity: 0.55,
    });
    this.group.add(new THREE.Points(this.pointsGeo, this.pointsMat));

    this.maxSegments = count * 5;
    this.linesGeo = new THREE.BufferGeometry();
    this.linesGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(this.maxSegments * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    this.linesGeo.setAttribute(
      "color",
      new THREE.BufferAttribute(new Float32Array(this.maxSegments * 6), 3).setUsage(THREE.DynamicDrawUsage),
    );
    // Additive + per-vertex colour scaled by proximity = per-link fade.
    this.linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const lines = new THREE.LineSegments(this.linesGeo, this.linesMat);
    lines.frustumCulled = false;
    this.group.add(lines);
    this.group.children[0].frustumCulled = false;
  }

  update(dt: number, anchor: THREE.Vector3, energy: number) {
    const { pos, vel, count, size } = this;
    const half = size / 2;
    const motion = this.shared.reducedMotion ? 0.15 : 1;
    const a = [anchor.x, anchor.y, anchor.z];

    for (let i = 0; i < count * 3; i++) {
      pos[i] += vel[i] * dt * motion * (1 + energy * 0.4);
      const rel = pos[i] - a[i % 3];
      if (rel > half) pos[i] -= size;
      else if (rel < -half) pos[i] += size;
    }
    this.pointsGeo.attributes.position.needsUpdate = true;
    this.pointsMat.color.copy(this.shared.colors.node);

    const lp = this.linesGeo.attributes.position.array as Float32Array;
    const lc = this.linesGeo.attributes.color.array as Float32Array;
    const line = this.shared.colors.line;
    const d2max = this.linkDist * this.linkDist;
    const gain = 0.55 + energy * 0.5;
    let seg = 0;
    for (let i = 0; i < count && seg < this.maxSegments; i++) {
      const ix = i * 3;
      for (let j = i + 1; j < count && seg < this.maxSegments; j++) {
        const jx = j * 3;
        const dx = pos[ix] - pos[jx];
        const dy = pos[ix + 1] - pos[jx + 1];
        const dz = pos[ix + 2] - pos[jx + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 > d2max) continue;
        const k = (1 - Math.sqrt(d2) / this.linkDist) * gain;
        const o = seg * 6;
        lp[o] = pos[ix];
        lp[o + 1] = pos[ix + 1];
        lp[o + 2] = pos[ix + 2];
        lp[o + 3] = pos[jx];
        lp[o + 4] = pos[jx + 1];
        lp[o + 5] = pos[jx + 2];
        for (let v = 0; v < 2; v++) {
          lc[o + v * 3] = line.r * k;
          lc[o + v * 3 + 1] = line.g * k;
          lc[o + v * 3 + 2] = line.b * k;
        }
        seg++;
      }
    }
    this.linesGeo.setDrawRange(0, seg * 2);
    this.linesGeo.attributes.position.needsUpdate = true;
    this.linesGeo.attributes.color.needsUpdate = true;
  }

  dispose() {
    disposeObject(this.group);
  }
}

// Distant star dust — a fixed shell beyond the fog, for depth and scale.
export class Stars {
  readonly points: THREE.Points;
  private readonly mat: THREE.PointsMaterial;

  constructor(private readonly shared: Shared, count = 2600) {
    const arr = new Float32Array(count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < count; i++) {
      v.set(Math.random() - 0.5, (Math.random() - 0.5) * 0.7, Math.random() - 0.5)
        .normalize()
        .multiplyScalar(500 + Math.random() * 700);
      v.toArray(arr, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
    this.mat = new THREE.PointsMaterial({
      size: 1.4,
      sizeAttenuation: false,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      fog: false,
    });
    this.points = new THREE.Points(geo, this.mat);
  }

  update(dt: number, cameraPos: THREE.Vector3) {
    // Stars ride with the camera so they read as infinitely far away.
    this.points.position.copy(cameraPos);
    if (!this.shared.reducedMotion) this.points.rotation.y += dt * 0.004;
    this.mat.color.copy(this.shared.colors.line);
  }

  dispose() {
    disposeObject(this.points);
  }
}
