import { TARGET_COLOR, TARGET_RADIUS } from './constants';
import type { Mesh } from './mesh';
import { SceneNode } from './scene-node';

export class Target {
  readonly node: SceneNode;
  readonly radius = TARGET_RADIUS;

  constructor(mesh: Mesh, position: readonly [number, number, number]) {
    const diameter = TARGET_RADIUS * 2;
    this.node = new SceneNode({
      mesh,
      color: TARGET_COLOR,
      position,
      size: [diameter, diameter, diameter],
    });
  }

  get alive(): boolean {
    return this.node.visible;
  }

  hit(): void {
    this.node.visible = false;
  }

  reset(): void {
    this.node.visible = true;
  }
}
