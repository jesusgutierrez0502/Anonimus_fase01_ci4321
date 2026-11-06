import { vec3, type ReadonlyVec3 } from 'gl-matrix';
import { GRAVITY } from './constants';

export function pointAt(out: vec3, origin: ReadonlyVec3, velocity: ReadonlyVec3, t: number): vec3 {
  vec3.scaleAndAdd(out, origin, velocity, t);
  out[1] -= 0.5 * GRAVITY * t * t;
  return out;
}
