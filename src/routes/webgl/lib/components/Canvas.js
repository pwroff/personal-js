/**
 * Created by Leonid on 30/11/16.
 */
var THREE = require('three');

var scene, camera, renderer;
var geometry, material, mesh;
var floorMesh;

export default class Canvas{

    constructor(){
        scene = new THREE.Scene();

        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 1000;

        scene.add(camera);

        geometry = new THREE.BoxGeometry( 200, 200, 100 );
        material = new THREE.MeshStandardMaterial( {
            color: 0xff0000
        });
        mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = -300;
        mesh.position.y = -300;
        scene.add( mesh );


        var bulbGeometry = new THREE.SphereGeometry( 100, 100, 100 );
        var bulbLight = new THREE.PointLight( 0xffee88, 100, 100, 200 );
        var bulbMat = new THREE.MeshStandardMaterial( {
            color: 0xff0000
        });
        bulbLight.add( new THREE.Mesh( bulbGeometry, bulbMat ) );
        bulbLight.position.set( 0, 2, 0 );
        bulbLight.castShadow = true;
        scene.add( bulbLight );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.setClearColor(0x000000, 1);

        var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
        scene.add( light );

        var floorMat = new THREE.MeshStandardMaterial( {
            roughness: 0.8,
            color: 0xcccccc,
            metalness: 0.7,
            bumpScale: 0.0005
        });

        var floorGeometry = new THREE.PlaneBufferGeometry( 1000, 1000 );
        floorMesh = new THREE.Mesh( floorGeometry, floorMat );
        floorMesh.receiveShadow = true;
        floorMesh.position.y = -400;
        floorMesh.rotation.y = 0.04;
        scene.add( floorMesh );


        var spotLight = new THREE.SpotLight( 0xffffff );
        spotLight.position.set( 100, 1000, 100 );

        spotLight.castShadow = true;

        spotLight.shadow.mapSize.width = 1024;
        spotLight.shadow.mapSize.height = 1024;

        spotLight.shadow.camera.near = 500;
        spotLight.shadow.camera.far = 4000;
        spotLight.shadow.camera.fov = 30;

        scene.add( spotLight );

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
    }

    append(to = document.body) {
        to.style.margin = 0;
        to.style.padding = 0;
        to.style.overflow = 'hidden';
        to.appendChild( renderer.domElement );
        this.draw();
        this._addListeners();
    }

    draw() {
        function animate() {

            requestAnimationFrame( animate );

            renderer.render( scene, camera );

        }

        animate();
    }

    _addListeners() {
        document.body.onkeydown = (e)=>{
            switch (e.code) {
                case 'ArrowUp':
                    floorMesh.rotateY(1);
                    break;
                case 'ArrowDown':
                    floorMesh.rotateY(-1);
                    break;

                case 'ArrowRight':
                    floorMesh.rotateX(1);
                    break;
                case 'ArrowLeft':
                    floorMesh.rotateX(-1);
                    break;

            }
        }
    }
};
