
import * as THREE from "/static/threejs/three.module.js";
import { OrbitControls } from "/static/threejs/OrbitControls.js";
import { STLLoader } from "/static/threejs/STLLoader.js";


/*let scene, camera, renderer, object, canvas, raycaster;
let INTERSECTED;
const pointer = new THREE.Vector2();

function init() {

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 0, 500);
    //scene.add(new THREE.GridHelper(10000, 1000));

   
 
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 20;
    renderer = new THREE.WebGLRenderer();
    raycaster = new THREE.Raycaster();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('contenido').appendChild(renderer.domElement);
    canvas = document.querySelector("canvas")
    $("canvas").dblclick(function (e) {
        getMousePosition(e);
    });
    
    scene.add(object);

    let control = new OrbitControls(camera, renderer.domElement);

    let light = new THREE.DirectionalLight(0xaaaaaa);
    light.position.set(0, 0, 10);
    scene.add(light);

    let light2 = new THREE.DirectionalLight(0xaaaaaa);
    light2.position.set(0, 0, -10);
    scene.add(light2);
    let light3 = new THREE.AmbientLight(0xaaaaaa); // soft white light
    scene.add(light3);
    animate();

}
function animate() {
    requestAnimationFrame(animate);
    //object.rotation.y += 0.01;
    renderer.render(scene, camera);
}

let loader = new STLLoader();
loader.load("/static/3dmodels/bases/BF3_mod_f4_foot_L_v0100.stl", (model) => {
    object = new THREE.Mesh(model, new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
    object.scale.set(0.1, 0.1, 0.1);
    object.position.set(3, -2, 0);
    init();
});


    

function getMousePosition(event) {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        alert("Hola");

        if (INTERSECTED != intersects[0].object) {

            if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

            INTERSECTED = intersects[0].object;
            INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
            INTERSECTED.material.emissive.setHex(0xff0000);

        }

    } else {
        alert("Adios");
        if (INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

        INTERSECTED = null;

    }

    renderer.render(scene, camera);
}
function getMousePosition(event) {

    var vec = new THREE.Vector3(); // create once and reuse
    var pos = new THREE.Vector3(); // create once and reuse
    vec.set(
        (event.clientX / window.innerWidth) * 2 - 1,
        - (event.clientY / window.innerHeight) * 2 + 1,
        0.5);
    vec.unproject(camera);
    vec.sub(camera.position).normalize();
    var distance = - camera.position.z / vec.z;
    pos.copy(camera.position).add(vec.multiplyScalar(distance));
    console.log(pos);
    object.position.set(pos.x, pos.y, pos.z);

    scene.add(object);
    renderer.render(scene, camera);
    return pos
}*/
let modelo;
let loader = new STLLoader();
loader.load("/static/3dmodels/bases/BF3_mod_f4_foot_L_v0100.stl", (model) => {
    modelo = new THREE.Mesh(model, new THREE.MeshLambertMaterial({ color: 0x00ff00 }));
    modelo.scale.set(0.2, 0.2, 0.2);
    modelo.position.set(2, 2, 2);
    main();
});

function main() {
    const canvas = document.querySelector('canvas');

    const renderer = new THREE.WebGLRenderer({ canvas });

    const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.z = 100;
    camera.position.y = 30
    
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    scene.fog = new THREE.Fog(0xffffff, 0, 500);
    scene.add(new THREE.GridHelper(10000, 1000));
    // put the camera on a pole (parent it to an object)
    // so we can spin the pole to move the camera around the scene
    const cameraPole = new THREE.Object3D();
    scene.add(cameraPole);
    cameraPole.add(camera);

    const control = new OrbitControls(camera, renderer.domElement);
    
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);

    scene.add(modelo);


    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width !== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    class PickHelper {
        constructor() {
            this.raycaster = new THREE.Raycaster();
            this.pickedObject = null;
            this.pickedObjectSavedColor = 0;
        }
        pick(normalizedPosition, scene, camera, time) {
            // restore the color if there is a picked object
            if (this.pickedObject) {
                this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
                this.pickedObject = undefined;
            }

            // cast a ray through the frustum
            this.raycaster.setFromCamera(normalizedPosition, camera);
            // get the list of objects the ray intersected
            const intersectedObjects = this.raycaster.intersectObjects(scene.children);
            if (intersectedObjects.length) {
                /*// pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                // save its color
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);*/
                alert("hola");
            }else{
                alert("Adios")
            }
        }
    }

    const pickPosition = { x: 0, y: 0 };
    const pickHelper = new PickHelper();
    $("canvas").dblclick(function (e) {
        pickHelper.pick(pickPosition, scene, camera, 1);
    });
    clearPickPosition();

    function render(time) {
        //time *= 0.01;  // convert to seconds;

        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        //cameraPole.rotation.z = time * .1;

        //pickHelper.pick(pickPosition, scene, camera, time);

        renderer.render(scene, camera);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function getCanvasRelativePosition(event) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: (event.clientX - rect.left) * canvas.width / rect.width,
            y: (event.clientY - rect.top) * canvas.height / rect.height,
        };
    }

    function setPickPosition(event) {
        const pos = getCanvasRelativePosition(event);
        pickPosition.x = (pos.x / canvas.width) * 2 - 1;
        pickPosition.y = (pos.y / canvas.height) * -2 + 1;  // note we flip Y
    }

    function clearPickPosition() {
        // unlike the mouse which always has a position
        // if the user stops touching the screen we want
        // to stop picking. For now we just pick a value
        // unlikely to pick something
        pickPosition.x = -100000;
        pickPosition.y = -100000;
    }
    window.addEventListener('mousemove', setPickPosition);
    window.addEventListener('mouseout', clearPickPosition);
    window.addEventListener('mouseleave', clearPickPosition);

    window.addEventListener('touchstart', (event) => {
        // prevent the window from scrolling
        event.preventDefault();
        setPickPosition(event.touches[0]);
    }, { passive: false });

    window.addEventListener('touchmove', (event) => {
        setPickPosition(event.touches[0]);
    });

    window.addEventListener('touchend', clearPickPosition);
}

//main();