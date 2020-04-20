function setupInteract(camera, model, canvas) {
  let mousedown = false;
  let mouseButton = 0;

  const rotateModel = (x, y, z) => {
    model.rotate(x.x, x.y, x.z).rotate(y.x, y.y, y.z);
  };

  const rotateModelZ = (z) => {
    model.rotate(z.x, z.y, z.z);
  };

  const rotateCameraOrbit = (x, y, z) => {
    if (mouseButton === 0) {
      camera.rotate(-x.x, -x.y, -x.z).rotate(-y.x, -y.y, -y.z);
    } else if (mouseButton === 2) {
      camera.rotate(-z.x, -z.y, -z.z);
    }
  };

  const rotateCameraFree = (e) => {
    if (mouseButton === 0) {
      camera.rotate(e.movementY / 1000, e.movementX / 1000, 0);
    } else if (mouseButton === 2) {
      camera.rotate(0, 0, e.movementX / 300);
    }
  };

  canvas.addEventListener('mousedown', (e) => {
    mousedown = true;
    mouseButton = e.button;
    e.preventDefault();
  });

  canvas.addEventListener('mouseup', () => {
    mousedown = false;
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!mousedown) return;

    const mat3 = new Mat3(camera.mat);
    const x = mat3.mult(new Vec3(1, 0, 0)).mult(e.movementY / 300);
    const y = mat3.mult(new Vec3(0, 1, 0)).mult(e.movementX / 300);
    const z = mat3.mult(new Vec3(0, 0, 1)).mult(-e.movementX / 300);

    if (e.ctrlKey) {
      if (mouseButton === 0) {
        rotateModel(x, y, z);
      } else if (mouseButton === 2) {
        rotateModelZ(z);
      }
    } else {
      if (camera.mode === ORBIT) {
        rotateCameraOrbit(x, y, z);
      } else if (camera.mode === FREE) {
        rotateCameraFree(e);
      }
    }
  });

  canvas.addEventListener('wheel', (e) => {
    model.mat = model.mat.mult(new Mat4(Math.pow(1.001, -e.deltaY)));
    model.mat.mat[15] = 1;
  });

  const movement = new Vec3();
  const speed = 0.01;

  // Dictionaries for key down and key up
  const keyDownActions = {
    a: () => (movement.x = -1),
    h: () => (movement.x = -1),
    d: () => (movement.x = 1),
    l: () => (movement.x = 1),
    q: () => (movement.y = -1),
    j: () => (movement.y = -1),
    e: () => (movement.y = 1),
    k: () => (movement.y = 1),
    w: () => (movement.z = -1),
    s: () => (movement.z = 1),
  };

  const keyUpActions = {
    a: () => (movement.x = 0),
    d: () => (movement.x = 0),
    h: () => (movement.x = 0),
    l: () => (movement.x = 0),
    q: () => (movement.y = 0),
    e: () => (movement.y = 0),
    j: () => (movement.y = 0),
    k: () => (movement.y = 0),
    w: () => (movement.z = 0),
    s: () => (movement.z = 0),
  };

  window.addEventListener('keydown', (e) => {
    const action = keyDownActions[e.key];
    if (action) action();
  });

  window.addEventListener('keyup', (e) => {
    const action = keyUpActions[e.key];
    if (action) action();
  });

  setInterval(() => {
    if (camera.mode === FREE) {
      camera.move(movement.x * speed, movement.y * speed, movement.z * speed);
    }
  }, 10);
}
