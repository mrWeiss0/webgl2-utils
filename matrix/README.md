# matrix

| class |
| :---- |
| [`AbstractMat`](#class-abstractmat) |
| [`Mat extends AbstractMat`](#class-mat-extend-abstractmat) |
| [`Mat2 extends Mat`](#class-mat2-extends-mat) |
| [`Mat3 extends Mat`](#class-mat3-extends-mat) |
| [`Mat4 extends Mat`](#class-mat4-extends-mat) |
| [`Vec extends AbstractMat`](#class-vec-extends-abstractmat) |
| [`Vec2 extends Vec`](#class-vec2-extends-vec) |
| [`Vec3 extends Vec`](#class-vec3-extends-vec) |
| [`Vec4 extends Vec`](#class-vec4-extends-vec) |
| [`Quat extends Vec4`](#class-quat-extends-vec4) |

`class AbstractMat`
-------------------

This class is the abstract parent of the
matrix and vector classes and implements
the common methods.

Static attribute `n` in subclasses is
the dimension of the matrix or vector
and is used for method implementations

| method | description |
| :----- | :---------- |
| `constructor(...val)` | Create an instance with the values given as a sequence of scalars, arrays or vectors |
| `get val()` | Get the matrix values as a linear array column major order |
| `add(m)` | Component wise addition |
| `sub(m)` | Component wise subtraction |
| `prod(m)` | Component wise product and product per scalar |
| `mul(m)` | Matrix product of two matrices, matrix per vector, or vector dot product |

`class Mat extends AbstractMat`
-------------------------------

Parent class for all matrix classes.
Values are stored column major, as in GLSL.

Implements common methods and private
helper methods for subclasses.

| method | description |
| :----- | :---------- |
| `static get identity()` | Identity matrix |
| `constructor(...val)` | Create a matrix with the given values, similar to GLSL matN constructor. Values can be a column major list of scalars, vectors or arrays, or another matrix.<br> If another matrix is given the values are copied to the output; any values not filled in are copied from the identity matrix.<br> Passing a single value creates a diagonal matrix. |
| `get trace()` | Trace of the matrix |
| `get det()` | Determinant of the matrix |
| `col(i)` | Return the _i_-th column as a VecN |
| `arrayCol(i)` | Return the _i_-th column as an array |
| `transposed()` | Return the transposed matrix |
| `inverse()` | Return the inverse matrix |
| `toString()` | String representation of the matrix, row major order |

`class Mat2 extends Mat`
------------------------

2x2 matrix class.

`class Mat3 extends Mat`
------------------------

3x3 matrix class.

Implements static methods for basic
2D transform matrices.

| method | description |
| :----- | :---------- |
| `static transl(dx=0, dy=0)` | 2D translation |
| `static scale(sx=1, sy=sx)` | 2D scale |
| `static rot(a)` | 2D rotation |
| `static shearX(h)` | 2D shear of the X axis |
| `static shearY(h)` | 2D shear of the Y axis |

`class Mat4 extends Mat`
------------------------

4x4 matrix class.

Implements static methods for
3D transform and projection matrices.

| method | description |
| :----- | :---------- |
| `static transl(dx=0, dy=0, dz=0)` | 3D translation |
| `static scale(sx=1, sy=sx, sz=sx)` |  3D scale |
| `static rotX(a)` | 3D translation around X axis |
| `static rotY(a)` | 3D translation around Y axis |
| `static rotZ(a)` | 3D translation around Z axis |
| `static shearX(hy, hz)` | 3D shear of the X axis |
| `static shearY(hx, hz)` | 3D shear of the Y axis |
| `static shearZ(hx, hy)` | 3D shear of the Z axis |
| `static ortho(w, h, n, f)` | Return the orthogonal projection matrix from a camera space looking towards negative z-axis.<br><br> `w`: half width<br> `h`: half height<br> `n`: near plane<br> `f`: far plane |
| `static persp(w, h, n, f, d = n)` | Return the perspective projection matrix from camera space looking towards negative z-axis.<br><br> `w`: half width  at projection plane<br> `h`: half height at projection plane<br> `n`: near plane<br> `f`: far  plane<br> `d`: projection plane distance |
| `static perspFOV(fov, a, n, f)` | Return the perspective projection matrix from camera space looking towards negative z-axis, given vertical fov and aspect ratio.<br><br> `fov`: vertical field of view in radians<br> `a`: aspect ratio<br> `n`: near plane<br> `f`: far plane |
| `static euler(roll, pitch, yaw)` | Return the rotation matrix for the given euler angles for z-up coordinates (XYZ order) |
| `static lookAt(c, o, upv = new Vec3(0, 1, 0))` | Return the transformation matrix for point `c` looking at point `o`.<br> Invert this matrix to get the corresponding view matrix.<br><br> `c`:   source point<br> `o`: look at point<br> `upv`: upvector |

`class Vec extends AbstractMat`
-------------------------------

Parent class for all vector classes.

Implements common methods and private
helper methods for subclasses.

| method | description |
| :----- | :---------- |
| `constructor(...val)` | Create a vector with the given values, similar to GLSL matN constructor. Values can be a list of scalars, vectors or arrays.<br> A single value creates a vector filled with that value. |
| `get modulo()` | Modulo of the vector |
| `normalize()` | Return a new vector obtained normalizing the current vector |
| `toString()` | String representation of the vector |

`class Vec2 extends Vec`
------------------------

2 elements vector class.

`class Vec3 extends Vec`
------------------------

3 elements vector class.

| method | description |
| :----- | :---------- |
| `cross(v)` | Cross product |

`class Vec4 extends Vec`
------------------------

4 elements vector class.

`class Quat extends Vec4`
-------------------------

Quaternion class.
Overrides the multiplication method
with the quaternion product.
Implements static methods for creating
a quaternion from rotations
and methods for converting a quaternion
to the corresponding rotation matrix.
 
| method | description |
| :----- | :---------- |
| `static fromAngleAxis(a, axis)` | Return a quaternion that represents the rotation of `angle` around `axis`.<br> `axis` can be an array or a Vec3 with the components of the axis direction. |
| `mul(q)` | Return the product of two quaternions |
| `toMat3()` | Return the 3x3 rotation matrix of the quaternion |
| `toMat4()` | Return the 4x4 rotation matrix of the quaternion |
