# Achi
Achi is an open source rendering framework that uses webgl.
## Usage Renderer
Usage for renderer & setting up canvas.
```html
    <canvas id="myCanvas"></canvas>
```
Once you have setup the canvas, it's about to call Achi!
```javascript
    let achi = new Achi("myCanvas");

    // Clear our window!
    achi.clear();

    // Now you are all set!
```
## Usage Shaders
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