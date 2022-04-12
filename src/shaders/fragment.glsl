varying vec2 vUv;

uniform vec4 resolution;
uniform float time;
uniform vec2 uMouse;

mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;
    
    return mat4(oc * axis.x * axis.x + c,           oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
                oc * axis.x * axis.y + axis.z * s,  oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
                oc * axis.z * axis.x - axis.y * s,  oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
                0.0,                                0.0,                                0.0,                                1.0);
}
vec3 rotate(vec3 v, vec3 axis, float angle) {
	mat4 m = rotationMatrix(axis, angle);
	return (m * vec4(v, 1.0)).xyz;
}

float sphere(vec3 p){
    return length(p) - (1.5 - sin(time) * 0.3);
}

float sineCrazy(vec3 p) {
    return 1. - abs(sin(p.x) + cos(p.y) + sin(p.z)) * 1.2;
}

float scene(vec3 p) {
    float scale = 5. + 4.*sin(time);
    vec3 mouseModified = vec3(p.x + uMouse.x * 2., p.y + uMouse.y * 2., p.z);
    vec3 finalPosition = rotate(mouseModified, vec3(-1., 0.5, 1.5), time * 0.15);

    return max(sphere(finalPosition), sineCrazy( 0.85 - (finalPosition * scale)) / scale);
}


vec3 getColor(vec3 p) {
    float amount = clamp((2.7 - length(p)) / 3.0, 0.0, 1.0);
    vec3 color = vec3(0.5) + vec3(0.5) * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * vec3(1., 0.9, 0.8)));
    return color * amount;
}

void main(){
    vec2 uv = (vUv - vec2(0.5)) * resolution.zw;

    vec3 camPos = vec3(0, 0, -10.); //Camera position

    vec3 ray = normalize(vec3(uv, 1.)); //Ray

    float rayLength = 0.; //Ray length

    vec3 color = vec3(0.);

    for (int i = 0; i < 80; i++) {
        vec3 rayPos = camPos + ray * rayLength; //Current ray position

        float curDist = scene(rayPos); //Current distance

        rayLength += curDist; //Ray length

        if (curDist < 0.0001 || rayLength > 80.0) break;
        color += 0.12 * getColor(rayPos); //Brightness * color
    }

    gl_FragColor = vec4(color, 1.);
}