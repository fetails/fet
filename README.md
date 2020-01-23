# Achi
Achi is an open source rendering framework that uses webgl.
## Usage
Usage for shaders:
```javascript
let myShader = new AchiShader(AchiContext, [
    "#version 300 es", // Vertex Shader
    "",
    "in vec3 coordinates;",
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
    "",
    "void main() {",
    " color = vec4(1, 0, 0, 1);",
    "}"
]);
console.log("My Program: ", myShader.program);
```