# Achi
Achi is an open source rendering framework that uses webgl.
## Usage
Usage for shaders:
```
let myShader = new AchiShader(AchiContext, [
    "#version 300 es", // Vertex Shader
    "",
    "in vec3 coordinates;",
    "out vec4 send_coords;",
    "",
    "void main() {",
    " gl_Position = vec4(coordinates, 1.0);",
    " send_coords = gl_Position;",
    "}"
], [
    "#version 300 es", // Fragment Shader
    "",
    "precision mediump float;",
    "",
    "out vec4 color;",
    "in vec4 send_coords;",
    "",
    "void main() {",
    " color = vec4(send_coords.x + 0.25, send_coords.y + 0.25, 0.45, 1);",
    "}"
]);
console.log("My Program: ", myShader.program);
```