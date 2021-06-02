class Vector {
  constructor(x, y, z) {
    this.x = x || 0;
    this.y = y || 0;
    this.z = z || 0;
  }
}

Vector.prototype = {
  minus: function () {
    return new Vector(-this.x, -this.y, -this.z);
  },
  add: function (v) {
    return new Vector(this.x + v.x, this.y + v.y, this.z + v.z);
  },
  sub: function (v) {
    return new Vector(this.x - v.x, this.y - v.y, this.z - v.z);
  },
  mult: function (v) {
    return new Vector(this.x * v.x, this.y * v.y, this.z * v.z);
  },
  smult: function (s) {
    return new Vector(this.x * s, this.y * s, this.z * s);
  },
  equals: function (v) {
    return this.x == v.x && this.y == v.y && this.z == v.z;
  },
  dot: function (v) {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  },
  cross: function (v) {
    return new Vector(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  },
  norm: function () {
    return Math.sqrt(this.dot(this));
  },
  normalize: function () {
    return this.smult(1.0 / this.norm());
  },
  min: function () {
    return Math.min(Math.min(this.x, this.y), this.z);
  },
  max: function () {
    return Math.max(Math.max(this.x, this.y), this.z);
  },
  toAngles: function () {
    return {
      theta: Math.atan2(this.z, this.x),
      phi: Math.asin(this.y / this.norm()),
    };
  },
  angleTo: function (a) {
    return Math.acos(this.dot(a) / (this.norm() * a.norm()));
  },
  toArray: function (n) {
    return [this.x, this.y, this.z].slice(0, n || 3);
  },
  clone: function () {
    return new Vector(this.x, this.y, this.z);
  },
  init: function (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  },
};

/*
  Static Methods
  Vector.randomDirection() returns a vector with a length of 1 and a statistically uniform direction. Vector.lerp() performs linear interpolation between two vectors.
  */

Vector.negative = function (a, b) {
  b.x = -a.x;
  b.y = -a.y;
  b.z = -a.z;
  return b;
};
Vector.add = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x + b.x;
    c.y = a.y + b.y;
    c.z = a.z + b.z;
  } else {
    c.x = a.x + b;
    c.y = a.y + b;
    c.z = a.z + b;
  }
  return c;
};
Vector.subtract = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x - b.x;
    c.y = a.y - b.y;
    c.z = a.z - b.z;
  } else {
    c.x = a.x - b;
    c.y = a.y - b;
    c.z = a.z - b;
  }
  return c;
};
Vector.multiply = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x * b.x;
    c.y = a.y * b.y;
    c.z = a.z * b.z;
  } else {
    c.x = a.x * b;
    c.y = a.y * b;
    c.z = a.z * b;
  }
  return c;
};
Vector.divide = function (a, b, c) {
  if (b instanceof Vector) {
    c.x = a.x / b.x;
    c.y = a.y / b.y;
    c.z = a.z / b.z;
  } else {
    c.x = a.x / b;
    c.y = a.y / b;
    c.z = a.z / b;
  }
  return c;
};
Vector.cross = function (a, b, c) {
  c.x = a.y * b.z - a.z * b.y;
  c.y = a.z * b.x - a.x * b.z;
  c.z = a.x * b.y - a.y * b.x;
  return c;
};
Vector.unit = function (a, b) {
  const norm = a.norm();
  b.x = a.x / norm;
  b.y = a.y / norm;
  b.z = a.z / norm;
  return b;
};
Vector.fromAngles = function (theta, phi) {
  return new Vector(
    Math.cos(theta) * Math.cos(phi),
    Math.sin(phi),
    Math.sin(theta) * Math.cos(phi)
  );
};
Vector.randomDirection = function () {
  return Vector.fromAngles(
    Math.random() * Math.PI * 2,
    Math.asin(Math.random() * 2 - 1)
  );
};
Vector.min = function (a, b) {
  return new Vector(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
};
Vector.max = function (a, b) {
  return new Vector(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
};
Vector.lerp = function (a, b, fraction) {
  return b.sub(a).mult(fraction).add(a);
};
Vector.fromArray = function (a) {
  return new Vector(a[0], a[1], a[2]);
};
Vector.angleBetween = function (a, b) {
  return a.angleTo(b);
};
Vector.ex = new Vector(1, 0, 0);
Vector.ey = new Vector(0, 1, 0);
Vector.ez = new Vector(0, 0, 1);
Vector.one = new Vector(1, 1, 1);
Vector.zero = new Vector(0, 0, 0);

export { Vector };
