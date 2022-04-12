import * as THREE from 'three'
import Experience from './script';

import vertex from "./shaders/vertexShader.glsl";
import fragment from "./shaders/fragment.glsl";

export default class Pane {
    constructor() {
        this.experience = new Experience();
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.height = this.experience.height
        this.width = this.experience.width
        this.time = this.experience.time
        this.parallax = this.experience.parallax
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.aspect();
        this.resize();
    }

    resize(){
        this.aspect();
        /* if (window.innerWidth / window.innerHeight > 1) {
            this.mesh.scale.x = this.camera.aspect;
            this.mesh.scale.y = 1;
        }
        else {
            this.mesh.scale.y = this.camera.aspect
            this.mesh.scale.x = 1;
        } */
    }
    
    aspect() {
        this.imageAspect = 1;
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a2 = (this.width/this.height) * this.imageAspect;
            a1 = 1;
        }
        else {
            a1 = 1;
            a2 = (this.height/this.width) / this.imageAspect;
        }
        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;
    }
    setGeometry(){
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10);
    }
    setMaterial(){
        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {value: new THREE.Vector4()},
                uMouse: {value: new THREE.Vector2(0, 0)}
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: false,
            depthWrite: false,
            alphaTest: false,
        })
    }
    setMesh() {
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        if (window.innerWidth / window.innerHeight > 1) {
            this.mesh.scale.x = this.camera.aspect;
        }
        else {
            this.mesh.scale.y = this.camera.aspect;
        }
        this.camera.updateProjectionMatrix();

        this.scene.add( this.mesh );
    }
    update(time){
        
	    this.material.uniforms.uMouse.value = new THREE.Vector2(this.parallax.position.eased.x, this.parallax.position.eased.y)
        this.material.uniforms.time.value = time;
    }
    
}