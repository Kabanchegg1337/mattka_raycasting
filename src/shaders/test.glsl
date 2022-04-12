#define MAX_STEPS 80
#define MAX_DIST 80.
#define SURF_DIST .0001

varying vec2 vUv;

uniform vec4 resolution;
uniform float time;


float sinPatt(vec3 p){
	return 0.1 + abs(sin(p.x) - cos(p.y) + sin(p.z))*1.2 ;
}
float getDist(vec3 p) {
	vec4 s = vec4(0, 0, 0, 2.);
    //s.xz += vec2(2.*cos(time),2.*sin(time));
    float angle = time*0.5;
    float si = sin(angle);
    float co = cos(angle);
    
    float scale = 5.+4.*sin(angle);
    mat2 rotationMatrix = mat2( co, si,
                               	-si,  co);

    //s.w = s.w*(1.2+0.2*sin(angle));
    vec2 p1 = rotationMatrix*p.xz ;
    p = vec3(p1.x,p.y,p1.y); //Apply rotation
    float sphereDist =  length(p-s.xyz)-s.w;

    float d = max(sphereDist,(0.85-sinPatt(p*(scale)))/scale);
    
    return  d;
}
/* float rayMarch(vec3 ro, vec3 rd) {
	float dO=0.;
    
    for(int i=0; i<MAX_STEPS; i++) {
    	vec3 p = ro + rd*dO;
        float dS = getDist(p);
        dO += dS;
        if(dO>MAX_DIST || dS<SURF_DIST) break;
    }
    
    return dO;
} */
/* vec3 getNormal(vec3 p) {
	float d = getDist(p);
    vec2 e = vec2(.01, 0);
    
    vec3 n = d - vec3(
        getDist(p-e.xyy),
        getDist(p-e.yxy),
        getDist(p-e.yyx));
    
    return normalize(n);
} */

vec3 getColor(vec3 p) {
    float amount = clamp((2.7 - length(p)) / 3.0, 0.0, 1.0);
    vec3 col = vec3(0.5, 0.5, 0.5) + vec3(0.5, 0.5, 0.5) * cos(6.28319 * (vec3(0.2, 0.0, 0.0) + amount * vec3(1.0, .9, 0.8)));
    return col*amount ;
}


void main()
{
    /* vec2 uv = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y; */
    vec2 uv = (vUv - vec2(0.5)) * resolution.zw;

	vec3 camPos = vec3(0,0,-10.);
    vec3 ray = normalize(vec3(uv,1.));

    float d=0.;


    vec3 color = vec3(0.);

    for(int i=0; i < 2000; i++) {
    	vec3 p = camPos + ray*d;

        float dS = getDist(p);

        d += dS;

        if(d>2000. || dS<SURF_DIST) break;
        
        color += 0.07*getColor(p);
    }

    gl_FragColor = vec4(color, 1.);
}