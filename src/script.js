import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

import vertex from "./shaders/vertexShader.glsl";
import fragment from "./shaders/test2.glsl";

export default class Sketch {
    constructor() {

        

        this.time = 0;
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	    this.camera.position.z = 1;
	    this.scene = new THREE.Scene();

        

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0xffffff);
        
        this.canvas = document.body.appendChild( this.renderer.domElement );

        this.height = this.canvas.offsetHeight;
        this.width = this.canvas.offsetWidth;

        this.controls = new OrbitControls(this.camera, this.canvas);

        this.gui = new dat.GUI();


        this.addMesh();
        this.aspect();
        this.render();
    }

    aspect() {
        this.imageAspect = 1;
        let a1; let a2;
        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width/this.height) * this.imageAspect;
            a2 = 1;
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

    addMesh() {
        this.geometry = new THREE.PlaneBufferGeometry(1, 1, 10, 10);
        

        this.material = new THREE.MeshNormalMaterial();

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {type: "f", value: 0.},
                progress: {type: "f", value: 0.},
                resolution: {value: new THREE.Vector4()},
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            depthTest: false,
            depthWrite: false,
            alphaTest: false,
        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );

        const dist = this.camera.position.z;
        const height = 1;
        this.camera.fov = 2*(180 / Math.PI)*Math.atan(height/(2 * dist))

        if (window.innerWidth / window.innerHeight > 1) {
            this.mesh.scale.x = this.camera.aspect;
        }
        else {
            this.mesh.scale.y = this.camera.aspect;
        }
        this.camera.updateProjectionMatrix();

        this.scene.add( this.mesh );
    }

    render(){
        this.time += 0.01;
	    this.renderer.render( this.scene, this.camera );
        this.material.uniforms.time.value = this.time;

        window.requestAnimationFrame(this.render.bind(this));
    }
}


const sketch = new Sketch();