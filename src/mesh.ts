import { ATTRIB, type FixedFunction } from './vendor/ff/ff';
import { NORMAL_OFFSET_BYTES, STRIDE_BYTES } from './constants';
import { generateCube, generateCylinder, generateSphere, type MeshData } from './geometry';

export class Mesh {
  private readonly vao: WebGLVertexArrayObject;
  private readonly indexCount: number;

  constructor(
    private readonly gl: WebGL2RenderingContext,
    private readonly ff: FixedFunction,
    data: MeshData,
    private readonly cullBackFaces = true,
  ) {
    const vertexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, data.vertices, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer()!;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, data.indices, gl.STATIC_DRAW);

    this.vao = gl.createVertexArray()!;
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.enableVertexAttribArray(ATTRIB.POSITION);
    gl.vertexAttribPointer(ATTRIB.POSITION, 3, gl.FLOAT, false, STRIDE_BYTES, 0);
    gl.enableVertexAttribArray(ATTRIB.NORMAL);
    gl.vertexAttribPointer(ATTRIB.NORMAL, 3, gl.FLOAT, false, STRIDE_BYTES, NORMAL_OFFSET_BYTES);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bindVertexArray(null);

    this.indexCount = data.indices.length;
  }

  static cube(gl: WebGL2RenderingContext, ff: FixedFunction): Mesh {
    return new Mesh(gl, ff, generateCube());
  }

  static sphere(gl: WebGL2RenderingContext, ff: FixedFunction): Mesh {
    return new Mesh(gl, ff, generateSphere(0.5));
  }

  static cylinder(gl: WebGL2RenderingContext, ff: FixedFunction): Mesh {
    return new Mesh(gl, ff, generateCylinder(0.5, 0.5, 1), false);
  }

  draw(): void {
    this.gl.bindVertexArray(this.vao);
    if (!this.cullBackFaces) this.gl.disable(this.gl.CULL_FACE);
    this.ff.drawElements(this.gl.TRIANGLES, this.indexCount, this.gl.UNSIGNED_SHORT, 0);
    if (!this.cullBackFaces) this.gl.enable(this.gl.CULL_FACE);
  }
}

export interface MeshSet {
  cube: Mesh;
  sphere: Mesh;
  cylinder: Mesh;
}

export function createMeshSet(gl: WebGL2RenderingContext, ff: FixedFunction): MeshSet {
  return {
    cube: Mesh.cube(gl, ff),
    sphere: Mesh.sphere(gl, ff),
    cylinder: Mesh.cylinder(gl, ff),
  };
}
