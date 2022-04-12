uniform sampler2D uTexture;

void main(){

    float textureStrength = texture2D(uTexture, gl_PointCoord).r;

    gl_FragColor = vec4(vec3(0.4, 0.8, 1.), textureStrength * 0.5);


    //gl_FragColor = vec4(1., 1., 1., 0.2);
}