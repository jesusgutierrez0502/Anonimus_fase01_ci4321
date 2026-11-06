import './style.css';
import { mat4 } from 'gl-matrix';
import { createFixedFunction, LIGHTING, type FixedFunction } from './vendor/ff/ff';
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_LOOK_AT,
  CAMERA_NEAR,
  CAMERA_POSITION,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  SKY_COLOR,
} from './constants';
import { Input } from './input';
import { Scene } from './scene';

const MAX_DT = 0.1;

function getContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
  const gl = canvas.getContext('webgl2');
  if (!gl) throw new Error('WebGL2 is not available.');
  return gl;
}

function setupState(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): void {
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(...SKY_COLOR);
  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
}

function setupCameraAndLight(ff: FixedFunction): void {
  ff.enable(LIGHTING);
  ff.setGlobalAmbient([0.3, 0.3, 0.3, 1]);
  ff.setLight(0, { position: [0.5, 1, 0.6, 0], diffuse: [1, 1, 1, 1] });
  ff.enableLight(0);

  ff.setViewMatrix(mat4.lookAt(mat4.create(), CAMERA_POSITION, CAMERA_LOOK_AT, [0, 1, 0]));
  ff.setProjectionMatrix(
    mat4.perspective(mat4.create(), CAMERA_FOV, CANVAS_WIDTH / CANVAS_HEIGHT, CAMERA_NEAR, CAMERA_FAR),
  );
}

function run(canvas: HTMLCanvasElement): void {
  const gl = getContext(canvas);
  const ff = createFixedFunction(gl, { debug: true });
  const input = new Input(window);

  setupState(gl, canvas);
  setupCameraAndLight(ff);

  const scene = new Scene(gl, ff);
  const forceKeys = ['Digit1', 'Digit2', 'Digit3'];

  function processInput(): void {
    const move = Number(input.isDown('ArrowRight')) - Number(input.isDown('ArrowLeft'));
    const aim = Number(input.isDown('ArrowUp')) - Number(input.isDown('ArrowDown'));
    scene.tank.setIntent(move, aim);

    forceKeys.forEach((key, i) => {
      if (input.wasPressed(key)) scene.tank.setForceLevel(i + 1);
    });
    if (input.wasPressed('Space')) scene.fire();
    if (input.wasPressed('KeyF')) scene.tank.cycleForceLevel();
    if (input.wasPressed('KeyR')) scene.reset();

    input.endFrame();
  }

  function update(dt: number): void {
    scene.update(dt);
  }

  function render(): void {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    scene.draw(ff);
  }

  let last: number | null = null;
  function frame(now: number): void {
    if (last === null) last = now;
    const dt = Math.min((now - last) / 1000, MAX_DT);
    last = now;
    processInput();
    update(dt);
    render();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

const canvas = document.createElement('canvas');
document.getElementById('stage')!.append(canvas);
run(canvas);
