#version 300 es
in vec3 coords;
out vec3 send_coords;

void main() {
  gl_Position = vec4(coords, 1.0);
  send_coords = coords;
}