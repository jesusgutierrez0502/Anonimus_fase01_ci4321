export interface MeshData {
  vertices: Float32Array;
  indices: Uint16Array;
}

export function generateCube(): MeshData {
  const faces = [
    { n: [0, 0, 1], u: [1, 0, 0], v: [0, 1, 0] },
    { n: [0, 0, -1], u: [-1, 0, 0], v: [0, 1, 0] },
    { n: [1, 0, 0], u: [0, 0, -1], v: [0, 1, 0] },
    { n: [-1, 0, 0], u: [0, 0, 1], v: [0, 1, 0] },
    { n: [0, 1, 0], u: [1, 0, 0], v: [0, 0, -1] },
    { n: [0, -1, 0], u: [1, 0, 0], v: [0, 0, 1] },
  ];
  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ];

  const vertices: number[] = [];
  const indices: number[] = [];

  faces.forEach((face, f) => {
    for (const [a, b] of corners) {
      vertices.push(
        0.5 * (face.n[0] + a * face.u[0] + b * face.v[0]),
        0.5 * (face.n[1] + a * face.u[1] + b * face.v[1]),
        0.5 * (face.n[2] + a * face.u[2] + b * face.v[2]),
        face.n[0],
        face.n[1],
        face.n[2],
      );
    }
    const base = f * 4;
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  });

  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}

export function generateSphere(radius = 0.6, sectorCount = 36, stackCount = 18): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];

  const sectorStep = (2 * Math.PI) / sectorCount;
  const stackStep = Math.PI / stackCount;

  for (let i = 0; i <= stackCount; ++i) {
    const stackAngle = Math.PI / 2 - i * stackStep;
    const xy = radius * Math.cos(stackAngle);
    const z = radius * Math.sin(stackAngle);

    for (let j = 0; j <= sectorCount; ++j) {
      const sectorAngle = j * sectorStep;

      const x = xy * Math.cos(sectorAngle);
      const y = xy * Math.sin(sectorAngle);

      const nx = x / radius;
      const ny = y / radius;
      const nz = z / radius;

      vertices.push(x, y, z, nx, ny, nz);
    }
  }

  for (let i = 0; i < stackCount; ++i) {
    let k1 = i * (sectorCount + 1);
    let k2 = k1 + sectorCount + 1;

    for (let j = 0; j < sectorCount; ++j, ++k1, ++k2) {
      if (i !== 0) {
        indices.push(k1, k2, k1 + 1);
      }
      if (i !== stackCount - 1) {
        indices.push(k1 + 1, k2, k2 + 1);
      }
    }
  }

  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}

export function generateCylinder(baseRadius = 0.5, topRadius = 0.5, height = 1.0, sectorCount = 36): MeshData {
  const vertices: number[] = [];
  const indices: number[] = [];

  const sectorStep = (2 * Math.PI) / sectorCount;

  for (let i = 0; i <= 1; ++i) {
    const y = -height / 2 + i * height;

    for (let j = 0; j <= sectorCount; ++j) {
      const sectorAngle = j * sectorStep;
      const x = (i === 0 ? baseRadius : topRadius) * Math.cos(sectorAngle);
      const z = (i === 0 ? baseRadius : topRadius) * Math.sin(sectorAngle);

      const nx = Math.cos(sectorAngle);
      const ny = 0;
      const nz = Math.sin(sectorAngle);

      vertices.push(x, y, z, nx, ny, nz);
    }
  }

  for (let j = 0; j < sectorCount; ++j) {
    const k1 = j;
    const k2 = j + sectorCount + 1;

    indices.push(k1, k1 + 1, k2);
    indices.push(k2, k1 + 1, k2 + 1);
  }

  const baseCenterIndex = vertices.length / 6;
  vertices.push(0, -height / 2, 0, 0, -1, 0);

  for (let j = 0; j < sectorCount; ++j) {
    const sectorAngle = j * sectorStep;
    const x = baseRadius * Math.cos(sectorAngle);
    const z = baseRadius * Math.sin(sectorAngle);
    vertices.push(x, -height / 2, z, 0, -1, 0);
  }

  for (let j = 0; j < sectorCount; ++j) {
    const current = baseCenterIndex + 1 + j;
    const next = baseCenterIndex + 1 + ((j + 1) % sectorCount);
    indices.push(baseCenterIndex, next, current);
  }

  const topCenterIndex = vertices.length / 6;
  vertices.push(0, height / 2, 0, 0, 1, 0);

  for (let j = 0; j < sectorCount; ++j) {
    const sectorAngle = j * sectorStep;
    const x = topRadius * Math.cos(sectorAngle);
    const z = topRadius * Math.sin(sectorAngle);
    vertices.push(x, height / 2, z, 0, 1, 0);
  }

  for (let j = 0; j < sectorCount; ++j) {
    const current = topCenterIndex + 1 + j;
    const next = topCenterIndex + 1 + ((j + 1) % sectorCount);
    indices.push(topCenterIndex, current, next);
  }

  return { vertices: new Float32Array(vertices), indices: new Uint16Array(indices) };
}
