import './style.css'
import * as THREE from 'three'

import Pane from './Pane';
import Particles from './Particles';


export default class Experience {
    constructor(){
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

        if(Experience.instance)
        {
            return Experience.instance
        }
        Experience.instance = this

        this.setRenderer();
        this.setCamera();
        this.scene = new THREE.Scene();
        this.mouseEvents();
        this.resize();
        this.setPane();
        this.setParticles();
        this.render();

    }
    
    setRenderer(){
        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.setClearColor(0x000000);
        this.renderer.outputEncoding = THREE.sRGBEncoding
        
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
    }
    resize(){
        window.addEventListener('resize', () => {
            this.renderer.setSize( window.innerWidth, window.innerHeight );
            this.height = window.innerHeight;
            this.width = window.innerWidth;
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            if (this.pane) this.pane.resize();
        })
    }
    setPane(){
        this.pane = new Pane();
    }
    setParticles(){
        this.particles = new Particles();
    }

    render(){
        this.update();
        this.renderer.render( this.scene, this.camera );
        this.time += 0.01;
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

    update(){
        const deltaTime = this.time - this.lastTime;
        this.lastTime = this.time;
        this.parallax.position.eased.x += (this.parallax.position.target.x - this.parallax.position.eased.x) * deltaTime * this.parallax.position.eased.multiplier;
        this.parallax.position.eased.y += (this.parallax.position.target.y - this.parallax.position.eased.y) * deltaTime * this.parallax.position.eased.multiplier;
        if (this.pane) this.pane.update(this.time)
        if (this.particles) this.particles.update(this.time)
    }
}





new Experience();

