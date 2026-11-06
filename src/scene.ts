import { vec3 } from 'gl-matrix';
import { FORCE_SPEEDS, GROUND, GROUND_COLOR, TARGET_POSITIONS } from './constants';
import { createMeshSet } from './mesh';
import { Projectile } from './projectile';
import { SceneNode } from './scene-node';
import { Tank } from './tank';
import { Target } from './target';
import type { FixedFunction } from './vendor/ff/ff';

export class Scene {
  readonly root = new SceneNode();
  readonly tank: Tank;
  readonly projectile: Projectile;
  readonly targets: Target[];

  private readonly muzzle = vec3.create();
  private readonly direction = vec3.create();

  constructor(gl: WebGL2RenderingContext, ff: FixedFunction) {
    const meshes = createMeshSet(gl, ff);

    this.root.add(
      new SceneNode({
        mesh: meshes.cube,
        color: GROUND_COLOR,
        position: GROUND.position,
        size: GROUND.size,
      }),
    );

    this.tank = new Tank(meshes);
    this.root.add(this.tank.root);

    this.targets = TARGET_POSITIONS.map((position) => new Target(meshes.sphere, position));
    for (const target of this.targets) this.root.add(target.node);

    this.projectile = new Projectile(meshes.sphere);
    this.root.add(this.projectile.node);

    this.root.updateWorld(null);
    this.syncProjectile();
  }

  fire(): void {
    if (this.projectile.flying) return;
    this.tank.muzzlePosition(this.muzzle);
    this.tank.aimDirection(this.direction);
    this.projectile.launch(this.muzzle, this.direction, FORCE_SPEEDS[this.tank.forceLevel - 1]);
  }

  reset(): void {
    this.tank.reset();
    this.projectile.reset();
    for (const target of this.targets) target.reset();
    this.root.updateWorld(null);
    this.syncProjectile();
  }

  update(dt: number): void {
    this.tank.update(dt);
    this.root.updateWorld(null);
    this.projectile.update(dt, this.targets);
    this.syncProjectile();
  }

  draw(ff: FixedFunction): void {
    this.root.draw(ff);
  }

  private syncProjectile(): void {
    if (!this.projectile.flying) this.projectile.follow(this.tank.muzzlePosition(this.muzzle));
    this.projectile.node.updateWorld(this.root.world);
  }
}
