varying vec2 vUv;

uniform vec4 resolution;
uniform float time;

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

float sphere(vec3 p) {
    return length(p) - 0.3;
}


float sineCrazy(vec3 p) {

    /* return 1. - (sin(p.x * p.x + p.y * p.y)); */
    return 1. - (sin(p.x) + sin(p.y) + sin(p.z)) * 1.2;
}

float scene(vec3 p) {

    vec3 p1 = rotate(p, vec3(1.,1.,1.), time/1.); //Make rotation of sphere
    float scale = 30. + 20. * sin(time/4.);
    return max(sphere(p1), (0.85 - sineCrazy(p1 * scale)) / scale); // return max of sphere & noise

}



vec3 getColorAmount(vec3 p) {
    float amount = clamp((2.7 - length(p))/3., 0., 1.);
    vec3 col = 0.5 + 0.5 * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * vec3(1.0, 1.0, 0.5)));
    return col * amount;
}

vec3 getNormal(vec3 p){
    vec2 o = vec2(0.001,0.);

    return normalize(
        vec3(
            scene(p + o.xyy) - scene(p - o.xyy),
            scene(p + o.yxy) - scene(p - o.yxy),
            scene(p + o.yyx) - scene(p - o.yyx)
        )
    );
}

void main() {
    vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);

    vec2 p = newUV - vec2(0.5);


    vec3 camPos = vec3(0., 0., 2.);

    vec3 ray = normalize(vec3(p, -1.));

    vec3 rayPos = camPos;

    float rayLen = 0.;

    /* vec3 light = vec3(-1.,1.,1.); */

    vec3 color = vec3(0.);

    for(int i; i <= 80; i++) {
        float curDist = scene(rayPos);

        rayLen += curDist;

        rayPos = camPos + ray * rayLen;

        if (rayLen > 80. || curDist < 0.0001) break;
        
        /* if (rayLen > 80. || curDist < 0.0001) {

            vec3 n = getNormal(rayPos);

            float diff = dot(n, light);


            color = getColor(diff);
            color = getColor(2. * length(rayPos));
            
        } */
        color += 0.04 * getColorAmount(rayPos);
    }

    gl_FragColor = vec4(color, 1.);
}