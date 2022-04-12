varying vec2 vUv;
uniform float progress;

void main() {
    vUv = uv;

    vec4 mvPosition = modelViewMatrix * vec4(position, 1.);
    gl_Position = projectionMatrix * mvPosition;
}