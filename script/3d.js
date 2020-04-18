class ThreeDObj {
  constructor(x, y, z) {
    this.mat = new Mat4([1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1]);
  }

  static rotationMatrix(x, y, z) {
    const c = Math.cos, s = Math.sin;
    const cx = c(x), sx = s(x);
    const cy = c(y), sy = s(y);
    const cz = c(z), sz = s(z);

    return new Mat4([
      cy * cz,
      sx * sy * cz - cx * sz,
      cx * sy * cz + sx * sz,
      0,
      cy * sz,
      sx * sy * sz + cx * cz,
      cx * sy * sz - sx * cz,
      0,
      -sy,
      sx * cy,
      cx * cy,
      0,
      0,
      0,
      0,
      1,
    ]);
  }

  rotate(x, y, z) {
    const r = ThreeDObj.rotationMatrix(x, y, z);
    this.mat = r.mult(this.mat);
    return this;
  }

  resetRotation() {
    this.mat.mat = [
      1, 0, 0, this.mat.mat[3],
      0, 1, 0, this.mat.mat[7],
      0, 0, 1, this.mat.mat[11],
      0, 0, 0, 1,
    ];
    return this;
  }
}

class Camera extends ThreeDObj {
  constructor(x, y, z, fov) {
    super(x, y, z);
    this.fov = fov;
    this.mode = ORBIT;
  }

  rotate(x, y, z) {
    const r = ThreeDObj.rotationMatrix(x, y, z);
    if (this.mode === ORBIT) {
      this.mat = r.mult(this.mat);
    } else if (this.mode === FREE) {
      this.mat = this.mat.mult(r);
    }
    return this;
  }

  move(x, y, z) {
    const xv = new Mat3(this.mat).mult(new Vec3(1, 0, 0)).mult(x);
    const yv = new Mat3(this.mat).mult(new Vec3(0, 1, 0)).mult(y);
    const zv = new Mat3(this.mat).mult(new Vec3(0, 0, 1)).mult(z);

    const pos = new Vec3(this.mat.mat[3], this.mat.mat[7], this.mat.mat[11])
      .add(xv)
      .add(yv)
      .add(zv);

    this.mat.mat[3] = pos.x;
    this.mat.mat[7] = pos.y;
    this.mat.mat[11] = pos.z;

    return this;
  }
}
