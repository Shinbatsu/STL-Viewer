const vertexShaderSrc = `attribute vec3 pos;
attribute vec3 normal;

uniform mat4 worldViewMatrix;
uniform mat4 modelMatrix;
uniform vec3 lightDir;
uniform vec4 ambient;

varying lowp vec4 lighting;

void main() {
    // Вычисляем позицию вершины
    gl_Position = worldViewMatrix * modelMatrix * vec4(pos, 1.0);

    // Трансформируем нормаль и нормализуем
    vec3 norm = normalize(mat3(modelMatrix) * normal);

    // Вычисляем диффузное освещение (Lambert)
    float diff = max(dot(norm, normalize(-lightDir)), 0.0);
    vec4 diffuse = vec4(vec3(diff), 1.0);

    // Итоговое освещение — сумма амбиентного и диффузного
    lighting = ambient + diffuse;
}
`;

const fragmentShaderSrc = `precision mediump float;

uniform vec4 color;

varying lowp vec4 lighting;

void main() {
    // Умножаем базовый цвет на освещение
    gl_FragColor = color * lighting;
}
`;

window.addEventListener('load', () => {
  const requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    ((f) => setTimeout(f, 10));

  const canvas = document.getElementById('c');
  const gl = createContext(canvas);

  const model = new ThreeDObj(0, 0, 0);
  const camera = new Camera(0, 0, 2, 60);
  let vertexArray = { vertices: null, indices: null };

  glSetup(gl);
  setupInteract(camera, model, canvas);
  setupMenu(camera);

  const program = shaderSetup(gl, vertexShaderSrc, fragmentShaderSrc);
  gl.useProgram(program);

  const arrayBuffer = gl.createBuffer();
  const elementBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);

  vertexAttribSetup(gl, program);

  filePrompt((file) => {
    loadModel(file, model, (vtxAry) => {
      vertexArray = vtxAry;
      gl.bindBuffer(gl.ARRAY_BUFFER, arrayBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vtxAry.vertices, gl.STATIC_DRAW);

      if (vtxAry.indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vtxAry.indices, gl.STATIC_DRAW);
      }
    });
  });

  const uniformLocations = {
    worldViewMatrix: gl.getUniformLocation(program, 'worldViewMatrix'),
    modelMatrix: gl.getUniformLocation(program, 'modelMatrix'),
    lightDir: gl.getUniformLocation(program, 'lightDir'),
    ambient: gl.getUniformLocation(program, 'ambient'),
    color: gl.getUniformLocation(program, 'color'),
  };

  function render() {
    resizeCanvas(canvas, gl);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.uniformMatrix4fv(
      uniformLocations.worldViewMatrix,
      false,
      worldViewMatrix(canvas.width / canvas.height, camera)
    );
    gl.uniformMatrix4fv(
      uniformLocations.modelMatrix,
      false,
      new Float32Array(model.mat.transpose().mat)
    );

    // Свет направлен вдоль оси Z в сторону камеры
    gl.uniform3f(uniformLocations.lightDir, 0, 0, -1);

    // Амбиентное освещение — слабый свет, равномерный
    gl.uniform4f(uniformLocations.ambient, 0.2, 0.2, 0.2, 1);

    // Серый цвет базового материала (0.5,0.5,0.5)
    gl.uniform4f(uniformLocations.color, 0.5, 0.5, 0.5, 1);

    if (vertexArray.indices) {
      gl.drawElements(
        gl.TRIANGLES,
        vertexArray.indices.length,
        gl.UNSIGNED_SHORT,
        0
      );
    } else if (vertexArray.vertices) {
      gl.drawArrays(gl.TRIANGLES, 0, vertexArray.vertices.length / 6);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
});

document.oncontextmenu = () => false;
