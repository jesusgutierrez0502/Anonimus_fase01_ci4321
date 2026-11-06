import { vec3, type ReadonlyVec3 } from 'gl-matrix';
import { PHYSICS_STEP, PROJECTILE_COLOR, PROJECTILE_RADIUS } from './constants';
import type { Mesh } from './mesh';
import { pointAt } from './physics';
import { SceneNode } from './scene-node';
import type { Target } from './target';

export class Projectile {
  readonly node: SceneNode;
  readonly radius = PROJECTILE_RADIUS;
  flying = false;

  private readonly origin = vec3.create();
  private readonly velocity = vec3.create();
  private elapsed = 0;
  private accumulator = 0;

  constructor(mesh: Mesh) {
    const diameter = PROJECTILE_RADIUS * 2;
    this.node = new SceneNode({
      mesh,
      color: PROJECTILE_COLOR,
      size: [diameter, diameter, diameter],
    });
  }

  follow(position: ReadonlyVec3): void {
    vec3.copy(this.node.position, position);
  }

  launch(position: ReadonlyVec3, direction: ReadonlyVec3, speed: number): void {
    vec3.copy(this.origin, position);
    vec3.scale(this.velocity, direction, speed);
    this.elapsed = 0;
    this.accumulator = 0;
    this.flying = true;
  }

  reset(): void {
    this.flying = false;
  }

  update(dt: number, targets: readonly Target[]): void {
    if (!this.flying) return;

    this.accumulator += dt;
    while (this.flying && this.accumulator >= PHYSICS_STEP) {
      this.accumulator -= PHYSICS_STEP;
      this.elapsed += PHYSICS_STEP;
      pointAt(this.node.position, this.origin, this.velocity, this.elapsed);
      this.resolveCollisions(targets);
    }
  }

  private resolveCollisions(targets: readonly Target[]): void {
    for (const target of targets) {
      if (!target.alive) continue;
      const reach = target.radius + this.radius;
      if (vec3.squaredDistance(this.node.position, target.node.position) <= reach * reach) {
        target.hit();
        this.flying = false;
        return;
      }
    }

    if (this.node.position[1] <= this.radius) {
      this.node.position[1] = this.radius;
      this.flying = false;
    }
  }
}
