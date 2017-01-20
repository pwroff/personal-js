var THREE = require('three');
var container, controls;
var camera, object, scene, renderer;
var mesh, geometry, material, mouse = new THREE.Vector2();
var worldWidth = 128, worldDepth = 128;

var raycaster = new THREE.Raycaster();

var active;

var store = [];

let start = 0,
    max = 25;
var clock = new THREE.Clock();

function init() {
    document.body.style.padding = '0';
    container = document.createElement('div');
    document.body.appendChild(container);
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = 300;
    camera.position.z = 1200;
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xffffff, 3000, 10000 );
    geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    material = new THREE.MeshLambertMaterial( { wireframe: true, color: 0xaaaaaa } );
    mesh = new THREE.Mesh( geometry, material );
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    scene.add( mesh );
    var light = new THREE.DirectionalLight( 0xefefff, 2 );
    light.position.set( 1, 1, 1 );
    light.castShadow = true;
    scene.add( light );
    var light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( light );

    object = new THREE.Group();

    scene.add(object);

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xeeeeee );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.innerHTML = "";
    container.appendChild( renderer.domElement );
    //
    window.addEventListener( 'resize', onWindowResize, false );

    document.body.addEventListener( 'mousemove', onMouseMoveHandler, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    var delta = clock.getDelta(),
        time = clock.getElapsedTime() * 10;
    if (start < max) {
        addGeometry();
    }

    renderer.render( scene, camera );
}

function addGeometry() {
    let color = new THREE.Color(`hsl(${Math.floor(360*Math.random())}, 90%, 40%)`).getHex();
    var mat = new THREE.PointsMaterial({color});
    var geo = new THREE.SphereGeometry( 15, 50,50 );
    geo.rotateX( - Math.PI / (Math.random()) );
    geo.rotateY( - Math.PI / (Math.random()) );
    var me = new THREE.Points( geo, mat);
    //me.scale.x = me.scale.y = me.scale.z = 2;
    let z = start%2 == 0 ?  -300 * Math.random() - 10 : 300 * Math.random() - 10;
    me.position.z = z;
    me.position.y = 1000 * Math.random() + 50;
    let x = (1000*Math.random() - 501);
    me.position.x = x;
    object.add(me);
    start += 1;
    var vy = Math.random() * 10;
    var vx = (x / 1000) * 10;
    var vz = (z/1000) * 10;
    var gravity = .5;
    var bounce_factor = 0.6;
    me.onBeforeRender = ()=>{
        if (me._isInteracting) {
            return;
        }
        let newV = me.position.y - vy;

        me.position.y = newV <=15 ? 15 : newV;
        me.position.x += vx;
        me.position.z += vz;

        if (me.position.y <= 15) {
            vy = -(vy*bounce_factor);
            vx = vx*bounce_factor;
            vz = vz*bounce_factor;
        }


        vy+=gravity;
    };

    me.onRemove = () => {

        if (!me || me.isDeleting) {
            return;
        }

        me.isDeleting = true;

        let st = Date.now();
        let change = 0.01;
        let duration = 600;

        me.onBeforeRender = ()=>{

            let step = Date.now() - st;

            let verts = me.geometry.vertices;
            let c = duration/step;
            let val = change*(c);

            verts.map((p, i) => {
                p.x += p.x*val;
                p.y += p.y*val;
                p.z += p.z*val;
            });
            me.geometry.verticesNeedUpdate = true;

            //me.position.y = me.position.y+val;

            if (step >= duration) {
                store.slice(store.indexOf(me), 1);
                start -= 1;
                object.remove(me);
                me.geometry.dispose();
                me.material.dispose();
                me.onBeforeRender = null;
                me = null;
            }


        };

    };

    store.push(me);
}

var lastColor;

const activeDown = (e) => {
}

const activeLeave = (ob) => {
    document.body.removeEventListener('mousedown', activeDown, false);
}

const activeEnter = (ob) => {
    ob.onRemove();
    document.body.addEventListener('mousedown', activeDown, false);
}

function onMouseMoveHandler(event){
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersections = raycaster.intersectObjects(store);

    if ( intersections.length > 0 ) {
        if ( active != intersections[ 0 ].object ) {
            if ( active ) activeLeave(active);
            activeEnter(intersections[ 0 ].object);
        }
        document.body.style.cursor = 'pointer';
    }
    else {
        if (active) activeLeave(active);

        document.body.style.cursor = 'auto';
    }
}

const fallingSpheres = ()=>{
    init();
    animate();
};

export default fallingSpheres;
