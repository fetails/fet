#version 300 es
precision mediump float;

out vec4 outColor;  // you can pick any name\n' +
in vec3 send_coords;

void main() {
    outColor = vec4(send_coords.x + 0.25, send_coords.y + 0.25, 0.75, 1);
}