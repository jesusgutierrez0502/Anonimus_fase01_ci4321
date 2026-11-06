import type { RGBA } from './vendor/ff/ff';

export const CANVAS_WIDTH = 1024;
export const CANVAS_HEIGHT = 768;

export const STRIDE_BYTES = 6 * 4;
export const NORMAL_OFFSET_BYTES = 3 * 4;

const DEG = Math.PI / 180;

export const SKY_COLOR: RGBA = [0.47, 0.74, 0.92, 1];
export const GROUND_COLOR: RGBA = [0.42, 0.26, 0.13, 1];
export const TARGET_COLOR: RGBA = [1, 0.3, 0.08, 1];

export const CAMERA_POSITION = [0, 6.5, 15] as const;
export const CAMERA_LOOK_AT = [0, 2.5, -15] as const;
export const CAMERA_FOV = Math.PI / 4;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 200;

export const TANK_X_LIMIT = 5;
export const TANK_MOVE_SPEED = 6;
export const TANK_MOVE_ACCEL = 30;

export const ELEVATION_MIN = 5 * DEG;
export const ELEVATION_MAX = 90 * DEG;
export const ELEVATION_START = 45 * DEG;
export const ELEVATION_SPEED = 50 * DEG;
export const ELEVATION_ACCEL = 400 * DEG;

export const FORCE_LEVELS = 3;
export const FORCE_SPEEDS = [14, 19, 25] as const;

export const GRAVITY = 9.8;
export const PHYSICS_STEP = 1 / 120;

export const PROJECTILE_RADIUS = 0.3;
export const PROJECTILE_COLOR: RGBA = [0.08, 0.08, 0.08, 1];

export const TANK_COLORS = {
  body: [0.22, 0.23, 0.25, 1],
  dome: [0.28, 0.29, 0.31, 1],
  barrel: [0.18, 0.19, 0.2, 1],
  muzzle: [0.08, 0.08, 0.09, 1],
  barOn: [0.35, 1, 0.2, 1],
  barOff: [0.05, 0.28, 0.08, 1],
} as const;

export const TANK_DIMENSIONS = {
  bodySize: [1.8, 0.9, 2.4],
  bodyY: 0.45,
  domeSize: [1.3, 0.9, 1.3],
  barrelLength: 2.4,
  barrelDiameter: 0.36,
  muzzleSize: [0.5, 0.25, 0.5],
  barSize: [1.2, 0.16, 0.04],
  barStep: 0.23,
} as const;

export const GROUND = {
  size: [90, 0.2, 100],
  position: [0, -0.1, -25],
} as const;

export const TARGET_RADIUS = 1.1;
export const TARGET_POSITIONS = [
  [-4.5, 3, -13],
  [3.5, 6, -26],
  [-0.5, 4, -40],
] as const;
