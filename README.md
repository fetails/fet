# Achi
Achi is an open source rendering framework that uses webgl.
## Usage Renderer
Usage for renderer & setting up canvas.
```html
<canvas id="myCanvas"></canvas>
```
Once you have setup the canvas, it's about to call Achi!
```javascript
let achi = new Achi("#myCanvas");

// Clear our window!
achi.clear();

// Now you are all set!
```
## Usage Shaders
```javascript
// Example shader
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
## Another Example
```javascript
let achi = new Achi("#mycanvas");
achi.create();
let shader = new AchiShader(achi, [
                "#version 300 es", // Vertex Shader
                "",
                "",
                "in vec3 coordinates;",
                "out vec3 send_coords;",
                "",
                "",
                "void main() {",
                " gl_Position = vec4(coordinates, 1.0);",
                " send_coords = vec3(coordinates.x + 0.45, coordinates.y + 0.45, coordinates.z + 0.25);",
                "}"
            ], [
                "#version 300 es", // Fragment Shader
                "",
                "precision mediump float;",
                "precision mediump int;",
                "",
                "out vec4 color;",
                "in vec3 send_coords;",
                "",
                "",
                "void main() {",
                " color = vec4(send_coords.x, send_coords.y, send_coords.z, 1);",
                "}"
            ]);
let loop = function()
{
    achi.clear();
    achi.begin();
    shader.begin();
    achi.render();
    shader.end();
    achi.end();
    requestAnimationFrame(loop);
};
loop();```
## Screenshot
![Achi Early](https://i.imgur.com/YksWqN0.png)