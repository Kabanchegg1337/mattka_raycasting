import * as THREE from 'three'
import Experience from './script';
import particlesVertex from './shaders/particles/vertex.glsl';
import particlesFragment from './shaders/particles/fragment.glsl';

import mask from './img/particleMask.png'
export default class Particles {
    constructor(){
        this.experience = new Experience();
        this.camera = this.experience.camera
        this.scene = this.experience.scene
        this.parallax = this.experience.parallax

        this.count = 20000;
        
        this.setGeometry();
        this.setMaterial();
        this.setMesh();
    }
    setGeometry(){
        this.geometry = new THREE.BufferGeometry();

        const positions = new Float32Array(this.count * 3)

        for(let i = 0; i < this.count; i++){
            positions[i * 3 + 0] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
        }

        this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    }
    setMaterial(){
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {value: this.time},
                uTexture: {value: new THREE.TextureLoader().load(mask)}
            },
            vertexShader: particlesVertex,
            fragmentShader: particlesFragment,
            transparent: true,
            depthTest: false,
            depthWrite: false,
        });
    }
    setMesh(){
        this.mesh = new THREE.Points(this.geometry, this.material);
        this.mesh.position.z = -1;
        this.scene.add(this.mesh)
    }
    update(time, x, y){
        this.material.uniforms.time.value = time;
        this.mesh.position.x = -this.parallax.position.eased.x;
        this.mesh.position.y = -this.parallax.position.eased.y;
    }
}