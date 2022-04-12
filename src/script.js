import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import vertex from "./shaders/vertexShader.glsl";
import fragment from "./shaders/fragment.glsl";

export default class Sketch {
    constructor() {
        this.time = 0;
        this.lastTime = 0;

        this.parallax = {
            position: {
                target: {
                    x: 0,
                    y: 0,
                },
                eased: {
                    x: 0,
                    y: 0,
                    multiplier: 2,
                }
            }
        };
        
        this.setRenderer();
        this.setCamera();
	    this.scene = new THREE.Scene();
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
        this.aspect();
        this.render();
        this.mouseEvents();
    }

    setRenderer(){
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0x000000);
        
        this.canvas = document.body.appendChild( this.renderer.domElement );
        this.height = this.canvas.offsetHeight;
        this.width = this.canvas.offsetWidth;
    }
    setCamera(){
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
	    this.camera.position.z = 1;
        const dist = this.camera.position.z;
        const height = 1;
        this.camera.fov = 2*(180 / Math.PI)*Math.atan(height/(2 * dist))
        this.controls = new OrbitControls(this.camera, this.canvas);
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
    render(){
        this.time += 0.01;

        const deltaTime = this.time - this.lastTime;
        this.lastTime = this.time;

        this.parallax.position.eased.x += (this.parallax.position.target.x - this.parallax.position.eased.x) * deltaTime * this.parallax.position.eased.multiplier;
        this.parallax.position.eased.y += (this.parallax.position.target.y - this.parallax.position.eased.y) * deltaTime * this.parallax.position.eased.multiplier;
	    this.material.uniforms.uMouse.value = new THREE.Vector2(this.parallax.position.eased.x, this.parallax.position.eased.y)
        this.renderer.render( this.scene, this.camera );
        this.material.uniforms.time.value = this.time;
        window.requestAnimationFrame(this.render.bind(this));
    }
    mouseEvents(){
        document.addEventListener('mousemove', (e) => {
            const cx = (e.clientX / this.width) - 0.5;
            const cy = (e.clientY / this.height) - 0.5;
            this.parallax.position.target.x = cx;
            this.parallax.position.target.y = cy;
        })
    }
}


const sketch = new Sketch();