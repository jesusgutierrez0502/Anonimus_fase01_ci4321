import { mat3, mat4, vec3, type ReadonlyVec3 } from 'gl-matrix';
import type { FixedFunction, RGBA } from './vendor/ff/ff';
import type { Mesh } from './mesh';

export interface SceneNodeOptions {
  mesh?: Mesh;
  color?: RGBA;
  position?: ReadonlyVec3;
  rotation?: ReadonlyVec3;
  size?: ReadonlyVec3;
}

export class SceneNode {
  readonly position = vec3.create();
  readonly rotation = vec3.create();
  readonly size = vec3.fromValues(1, 1, 1);
  readonly local = mat4.create();
  readonly world = mat4.create();
  readonly children: SceneNode[] = [];
  mesh: Mesh | null;
  color: RGBA;
  visible = true;

  private readonly shapeMatrix = mat4.create();
  private readonly normalMatrix = mat3.create();

  constructor(options: SceneNodeOptions = {}) {
    this.mesh = options.mesh ?? null;
    this.color = options.color ?? [1, 1, 1, 1];
    if (options.position) vec3.copy(this.position, options.position);
    if (options.rotation) vec3.copy(this.rotation, options.rotation);
    if (options.size) vec3.copy(this.size, options.size);
  }

  add(child: SceneNode): SceneNode {
    this.children.push(child);
    return child;
  }

  updateWorld(parentWorld: mat4 | null): void {
    mat4.fromTranslation(this.local, this.position);
    mat4.rotateY(this.local, this.local, this.rotation[1]);
    mat4.rotateX(this.local, this.local, this.rotation[0]);
    mat4.rotateZ(this.local, this.local, this.rotation[2]);

    if (parentWorld) mat4.multiply(this.world, parentWorld, this.local);
    else mat4.copy(this.world, this.local);

    for (const child of this.children) child.updateWorld(this.world);
  }

  draw(ff: FixedFunction): void {
    if (!this.visible) return;

    if (this.mesh) {
      mat4.scale(this.shapeMatrix, this.world, this.size);
      ff.setMaterial({ ambient: this.color, diffuse: this.color });
      ff.setModelMatrix(this.shapeMatrix);
      ff.setNormalMatrix(mat3.normalFromMat4(this.normalMatrix, this.shapeMatrix)!);
      this.mesh.draw();
    }

    for (const child of this.children) child.draw(ff);
  }
}
