import { vec3 } from 'gl-matrix';
import {
  ELEVATION_ACCEL,
  ELEVATION_MAX,
  ELEVATION_MIN,
  ELEVATION_SPEED,
  ELEVATION_START,
  FORCE_LEVELS,
  TANK_COLORS,
  TANK_DIMENSIONS,
  TANK_MOVE_ACCEL,
  TANK_MOVE_SPEED,
  TANK_X_LIMIT,
} from './constants';
import type { MeshSet } from './mesh';
import { SceneNode } from './scene-node';

function approach(current: number, target: number, maxDelta: number): number {
  if (current < target) return Math.min(current + maxDelta, target);
  return Math.max(current - maxDelta, target);
}

export class Tank {
  readonly root = new SceneNode();
  x = 0;
  elevation = ELEVATION_START;
  forceLevel = 1;

  private moveDir = 0;
  private aimDir = 0;
  private velocityX = 0;
  private velocityElevation = 0;

  private readonly dome: SceneNode;
  private readonly scratch = vec3.create();
  private readonly bars: SceneNode[] = [];

  constructor(meshes: MeshSet) {
    const d = TANK_DIMENSIONS;

    const body = this.root.add(
      new SceneNode({
        mesh: meshes.cube,
        color: TANK_COLORS.body,
        position: [0, d.bodyY, 0],
        size: d.bodySize,
      }),
    );

    for (let i = 0; i < FORCE_LEVELS; i++) {
      this.bars.push(
        body.add(
          new SceneNode({
            mesh: meshes.cube,
            color: TANK_COLORS.barOff,
            position: [0, (i - 1) * d.barStep, d.bodySize[2] / 2 + d.barSize[2] / 2],
            size: d.barSize,
          }),
        ),
      );
    }

    this.dome = body.add(
      new SceneNode({
        mesh: meshes.sphere,
        color: TANK_COLORS.dome,
        position: [0, d.bodySize[1] / 2, 0],
        size: d.domeSize,
      }),
    );

    const barrel = this.dome.add(
      new SceneNode({
        mesh: meshes.cylinder,
        color: TANK_COLORS.barrel,
        position: [0, d.barrelLength / 2, 0],
        size: [d.barrelDiameter, d.barrelLength, d.barrelDiameter],
      }),
    );

    barrel.add(
      new SceneNode({
        mesh: meshes.cylinder,
        color: TANK_COLORS.muzzle,
        position: [0, d.barrelLength / 2 - d.muzzleSize[1] / 2, 0],
        size: d.muzzleSize,
      }),
    );

    this.apply();
  }

  setIntent(moveDir: number, aimDir: number): void {
    this.moveDir = moveDir;
    this.aimDir = aimDir;
  }

  setForceLevel(level: number): void {
    this.forceLevel = Math.min(Math.max(level, 1), FORCE_LEVELS);
  }

  cycleForceLevel(): void {
    this.forceLevel = (this.forceLevel % FORCE_LEVELS) + 1;
  }

  reset(): void {
    this.x = 0;
    this.elevation = ELEVATION_START;
    this.forceLevel = 1;
    this.moveDir = 0;
    this.aimDir = 0;
    this.velocityX = 0;
    this.velocityElevation = 0;
    this.apply();
  }

  update(dt: number): void {
    this.velocityX = approach(this.velocityX, this.moveDir * TANK_MOVE_SPEED, TANK_MOVE_ACCEL * dt);
    this.x += this.velocityX * dt;
    if (this.x > TANK_X_LIMIT || this.x < -TANK_X_LIMIT) {
      this.x = Math.sign(this.x) * TANK_X_LIMIT;
      this.velocityX = 0;
    }

    this.velocityElevation = approach(
      this.velocityElevation,
      this.aimDir * ELEVATION_SPEED,
      ELEVATION_ACCEL * dt,
    );
    this.elevation += this.velocityElevation * dt;
    if (this.elevation > ELEVATION_MAX || this.elevation < ELEVATION_MIN) {
      this.elevation = Math.min(Math.max(this.elevation, ELEVATION_MIN), ELEVATION_MAX);
      this.velocityElevation = 0;
    }

    this.apply();
  }

  muzzlePosition(out: vec3): vec3 {
    return vec3.transformMat4(out, [0, TANK_DIMENSIONS.barrelLength, 0], this.dome.world);
  }

  aimDirection(out: vec3): vec3 {
    vec3.transformMat4(out, [0, 1, 0], this.dome.world);
    vec3.transformMat4(this.scratch, [0, 0, 0], this.dome.world);
    return vec3.normalize(out, vec3.subtract(out, out, this.scratch));
  }

  private apply(): void {
    this.root.position[0] = this.x;
    this.dome.rotation[0] = this.elevation - Math.PI / 2;

    this.bars.forEach((bar, i) => {
      bar.color = i < this.forceLevel ? TANK_COLORS.barOn : TANK_COLORS.barOff;
    });
  }
}
