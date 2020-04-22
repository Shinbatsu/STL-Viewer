function createContext(canvas) {
  return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

function resizeCanvas(canvas, gl) {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);
  }
}

function glSetup(gl) {
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function vertexAttribSetup(gl, prgm) {
  const posLoc = gl.getAttribLocation(prgm, 'pos');
  const normalLoc = gl.getAttribLocation(prgm, 'normal');

  gl.vertexAttribPointer(posLoc, 3, gl.FLOAT, false, 24, 0);
  gl.enableVertexAttribArray(posLoc);

  gl.vertexAttribPointer(normalLoc, 3, gl.FLOAT, false, 24, 12);
  gl.enableVertexAttribArray(normalLoc);
}

function worldViewMatrix(aspect, camera) {
  const n = 0.1; // near depth
  const f = 200; // far depth
  const r = Math.tan((camera.fov * Math.PI) / 360) * n;
  const t = r / aspect;

  const projection = new Mat4([
    n / r, 0, 0, 0,
    0, n / t, 0, 0,
    0, 0, -(f + n) / (f - n), (-2 * f * n) / (f - n),
    0, 0, -1, 0,
  ]);

  return new Float32Array(projection.mult(camera.mat.inverse()).transpose().mat);
}

function shaderSetup(gl, vtxSrc, fragSrc) {
  const prgm = gl.createProgram();

  const vtx = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vtx, vtxSrc);
  gl.compileShader(vtx);

  if (!gl.getShaderParameter(vtx, gl.COMPILE_STATUS)) {
    alert('Error compiling vertex shader:\n' + gl.getShaderInfoLog(vtx));
  }

  const frag = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(frag, fragSrc);
  gl.compileShader(frag);

  if (!gl.getShaderParameter(frag, gl.COMPILE_STATUS)) {
    alert('Error compiling fragment shader:\n' + gl.getShaderInfoLog(frag));
  }

  gl.attachShader(prgm, vtx);
  gl.attachShader(prgm, frag);
  gl.linkProgram(prgm);

  if (!gl.getProgramParameter(prgm, gl.LINK_STATUS)) {
    alert('Error linking shader program:\n' + gl.getProgramInfoLog(prgm));
  }

  gl.deleteShader(vtx);
  gl.deleteShader(frag);

  return prgm;
}
