import * as THREE from "/static/threejs/three.module.js";
import { OrbitControls } from "/static/threejs/OrbitControls.js";
import { TransformControls } from '/static/threejs/TransformControls.js';
import { STLLoader } from "/static/threejs/STLLoader.js";


let scene;
let scaledMode = false;
const vectorCameraPosInit = new THREE.Vector3(0, 30, 100);
const vectorScaleInit = new THREE.Vector3(0.2, 0.2, 0.2);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.z = 100;
camera.position.y = 30
let idSelectedObject = -1;
let numberObject = objects.length;
let idsObjects = new Array(numberObject)


main();


function cargarSTL(position, loader, material, coordenadas, file) {
    loader.load(file, (model) => {
        //console.log(position);
        var modelo = new THREE.Mesh(model, material);
        modelo.scale.set(vectorScaleInit.x, vectorScaleInit.y, vectorScaleInit.z);
        modelo.position.set(coordenadas.x, coordenadas.y, coordenadas.z);
        scene.add(modelo);
        idsObjects[position] = modelo.id;
    });
}




function main() {
 
    const canvas = document.querySelector('canvas');

    const renderer = new THREE.WebGLRenderer({ canvas });

    /*const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;*/


    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // put the camera on a pole (parent it to an object)
    // so we can spin the pole to move the camera around the scene
    scene.add(camera);


    const control = new OrbitControls(camera, renderer.domElement);

    const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('change', render);
    transformControl.addEventListener('dragging-changed', function (event) {

        control.enabled = !event.value;

    });
    scene.add(transformControl);
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    camera.add(light);

    const loader = new STLLoader();
    const materialSTL = new THREE.MeshLambertMaterial({ color: 0x00ff00 });

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
                this.pickedObject = intersectedObjects[0].object;

                /*// pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                // save its color
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);*/
                moveCameraToObject(this.pickedObject, camera);
            }
        }
    }
    function getCenterPoint(objeto) {
        var middle = new THREE.Vector3();
        var geometry = objeto.geometry;

        geometry.computeBoundingBox();

        middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
        middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
        middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

        objeto.localToWorld(middle);
        return middle;
    }

    function showOnlyIdObject(id) {

        scene.traverse(function (node) {

            if (node instanceof THREE.Mesh) {
                if (node.id !== id) {

                    node.visible = false;
                } else {
                    node.visible = true;
                }

            }

        });

    }

    function showAllObject() {

        scene.traverse(function (node) {

            if (node instanceof THREE.Mesh) {
                node.visible = true;
            }

        });

    }

    function changeCameraAndControl(posCamera, posControl) {
        camera.position.set(posCamera.x, posCamera.y, posCamera.z);
        control.target.set(posControl.x, posControl.y, posControl.z);
        control.update();
        render();
    }

    function moveCameraToInit() {
        var posControl = new THREE.Vector3(0, 0, 0);
        changeCameraAndControl(vectorCameraPosInit, posControl);
    }

    function returnFullView() {
        if (idSelectedObject !== -1) {
            idSelectedObject = -1;
            showAllObject();
            moveCameraToInit();
        }
        
        deScaleMode();
        

    }

    function moveCameraToObject(object) {
        var middle = getCenterPoint(object);
        var posCamera = new THREE.Vector3(middle.x, middle.y, 50);
        
        
        
        changeCameraAndControl(posCamera, middle);
        idSelectedObject = object.id;
        showOnlyIdObject(object.id);
        /*var box = new THREE.BoxHelper( object, 0x000000 );
        scene.add(box);*/
        /*const geometry = new THREE.SphereGeometry( 2, 32, 16 );
        const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const sphere = new THREE.Mesh( geometry, material );
        sphere.position.set(middle.x, middle.y, middle.z);

        scene.add( sphere );*/


    }


    const pickPosition = { x: 0, y: 0 };
    const pickHelper = new PickHelper();
    $("canvas").dblclick(function (e) {
        pickHelper.pick(pickPosition, scene, camera, 1);
    });
    clearPickPosition();

    objects.forEach(element => cargarSTL(element[0], loader, materialSTL, new THREE.Vector3(element[3], element[4], 0), element[1]));
    /*//bases
    cargarSTL(0, loader, materialSTL, new THREE.Vector3(50, 0, 0), "/static/3dmodels/bases/BF3_mod_f4_foot_L_v0100.stl");
    cargarSTL(1, loader, materialSTL, new THREE.Vector3(40, 0, 0), "/static/3dmodels/bases/BF3_mod_f4_foot_R_v0100.stl");
    cargarSTL(2, loader, materialSTL, new THREE.Vector3(32, 0, 0), "/static/3dmodels/bases/BF3_module_c3_camp_bot_v0100.stl");
    cargarSTL(3, loader, materialSTL, new THREE.Vector3(25, 0, 0), "/static/3dmodels/bases/BF3_module_c4_camp_top_v0100.stl");
    cargarSTL(4, loader, materialSTL, new THREE.Vector3(15, 0, 0), "/static/3dmodels/bases/BF3_module_c5_camp_el_top_v0100.stl");
    cargarSTL(5, loader, materialSTL, new THREE.Vector3(0, 0, 0), "/static/3dmodels/bases/BF3_module_c5_c_camp_el_top_v0100.stl");
    cargarSTL(6, loader, materialSTL, new THREE.Vector3(-15, 0, 0), "/static/3dmodels/bases/BF3_module_f1_foot_v0100.stl");
    cargarSTL(7, loader, materialSTL, new THREE.Vector3(-25, 0, 0), "/static/3dmodels/bases/BF3_module_f2_foot_v0100.stl");
    cargarSTL(8, loader, materialSTL, new THREE.Vector3(-35, 0, 0), "/static/3dmodels/bases/BF3_module_f3_foot_v0100.stl");

    //conexiones
    cargarSTL(9, loader, materialSTL, new THREE.Vector3(50, 10, 0), "/static/3dmodels/conexiones/BF3_module_e2_elev_v0100.stl");
    cargarSTL(10, loader, materialSTL, new THREE.Vector3(40, 13, 0), "/static/3dmodels/conexiones/BF3_module_e1_elev_v0100.stl");
    cargarSTL(11, loader, materialSTL, new THREE.Vector3(20, 20, 0), "/static/3dmodels/conexiones/BF3_module_e1_c_elev_v0100.stl");
    cargarSTL(12, loader, materialSTL, new THREE.Vector3(10, 20, 0), "/static/3dmodels/conexiones/BF3_module_c2_camp_out_R_v0100.stl");
    cargarSTL(13, loader, materialSTL, new THREE.Vector3(0, 20, 0), "/static/3dmodels/conexiones/BF3_module_c2_camp_out_L_v0100.stl");
    cargarSTL(14, loader, materialSTL, new THREE.Vector3(-10, 20, 0), "/static/3dmodels/conexiones/BF3_module_a1_angle_20_v0100.stl");
    cargarSTL(15, loader, materialSTL, new THREE.Vector3(-20, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2f_camp_out_front_R_v0100.stl");
    cargarSTL(16, loader, materialSTL, new THREE.Vector3(-30, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2_camp_out_08mm_R_v0100.stl");
    cargarSTL(17, loader, materialSTL, new THREE.Vector3(-40, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2_camp_out_08mm_L_v0100.stl");
    cargarSTL(18, loader, materialSTL, new THREE.Vector3(-50, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2bd_camp_out_back_doub_R_v0100.stl");
    cargarSTL(19, loader, materialSTL, new THREE.Vector3(-60, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2bd_camp_out_back_doub_L_v0100.stl");
    cargarSTL(20, loader, materialSTL, new THREE.Vector3(-70, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2b_camp_out_back_R_v0100.stl");
    cargarSTL(21, loader, materialSTL, new THREE.Vector3(-80, 20, 0), "/static/3dmodels/conexiones/BF3_mod_c2b_camp_out_back_L_v0100.stl");

    //modulos humedad  
    cargarSTL(22, loader, materialSTL, new THREE.Vector3(-65, 0, 0), "/static/3dmodels/modulosHumedad/BF3_module_h1_hum_L_v0110.stl");
    cargarSTL(23, loader, materialSTL, new THREE.Vector3(-50, 0, 0), "/static/3dmodels/modulosHumedad/BF3_module_h2_c_hum_L_v0110.stl");

    //salasYAccesorios
    cargarSTL(24, loader, materialSTL, new THREE.Vector3(50, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b1_c_room_v0100.stl");
    cargarSTL(25, loader, materialSTL, new THREE.Vector3(15, -25, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b1_room_v0100.stl");
    cargarSTL(26, loader, materialSTL, new THREE.Vector3(5, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_15_C_v0100.stl");


    cargarSTL(27, loader, materialSTL, new THREE.Vector3(-15, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_15_L_v0100.stl");
    cargarSTL(28, loader, materialSTL, new THREE.Vector3(-35, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_15_R_v0100.stl");
    cargarSTL(29, loader, materialSTL, new THREE.Vector3(-55, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_C_v0100.stl");
    cargarSTL(30, loader, materialSTL, new THREE.Vector3(-75, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_L_v0110.stl");
    cargarSTL(31, loader, materialSTL, new THREE.Vector3(-95, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_pal_R_v0110.stl");
    cargarSTL(32, loader, materialSTL, new THREE.Vector3(75, -20, 0), "/static/3dmodels/salasYAccesorios/BF3_module_b2_room_h_v0100.stl");
    //tapasCierre
    cargarSTL(33, loader, materialSTL, new THREE.Vector3(-87, 20, 0), "/static/3dmodels/tapasCierre/BF3_module_c1_camp_L_v0100.stl");
    cargarSTL(34, loader, materialSTL, new THREE.Vector3(-95, 20, 0), "/static/3dmodels/tapasCierre/BF3_module_c1_camp_R_v0100.stl");

    //tuercas
    cargarSTL(35, loader, materialSTL, new THREE.Vector3(10, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n1a_nut_A_type1_v0100.stl");
    cargarSTL(36, loader, materialSTL, new THREE.Vector3(20, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n1b_nut_B_type1_v0100.stl");
    cargarSTL(37, loader, materialSTL, new THREE.Vector3(0, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n2a_nut_A_type2_v0100.stl");
    cargarSTL(38, loader, materialSTL, new THREE.Vector3(-10, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n2b_nut_B_type2_v0100.stl");
    cargarSTL(39, loader, materialSTL, new THREE.Vector3(30, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n3a_nut_A_type3_v0100.stl");
    cargarSTL(40, loader, materialSTL, new THREE.Vector3(40, -30, 0), "/static/3dmodels/tuercas/BF3_mod_n3b_nut_B_type3_v0100.stl");
    */
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




    function render(time) {
        //time *= 0.01;  // convert to seconds;


        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }

        //cameraPole.rotation.z = time * .1;


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





    function changeObject(page) {

        if (idSelectedObject !== -1) {
            var posNextId = (jQuery.inArray(idSelectedObject, idsObjects) + page) % numberObject;
            posNextId = (posNextId + numberObject) % numberObject;

            idSelectedObject = idsObjects[posNextId];

            var object = scene.getObjectById(idSelectedObject, true);
            moveCameraToObject(object);
            deScaleMode();

        }
    }
    function nextObject() {
        changeObject(1);
    }
    function previousObject() {
        changeObject(-1);
    }

    function resetCameraPosition() {
        if (idSelectedObject !== -1) {
            var object = scene.getObjectById(idSelectedObject, true);
            moveCameraToObject(object);
        } else {
            moveCameraToInit();
        }
    }

    function deScaleMode() {
        if (transformControl.object !== undefined) {
            $("#escaleObject").attr('class', 'escale');

            transformControl.object.scale.set(vectorScaleInit.x, vectorScaleInit.y, vectorScaleInit.z);
            transformControl.detach();
        }



    }
    function scaleObject() {

        if (idSelectedObject !== -1) {
            if (transformControl.object === undefined) {
                var object = scene.getObjectById(idSelectedObject, true);
                transformControl.attach(object);
                transformControl.setMode('scale');
                $("#escaleObject").attr('class', 'de-escale');
                
            } else {

                deScaleMode();


            }
        }


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
    $("#next").click(function () {
        nextObject();
    });

    $("#previous").click(function () {
        previousObject();
    });
    $("#backHome").click(function () {
        returnFullView();
    });
    $("#resetCamera").click(function () {
        resetCameraPosition();
    });

    $("#escaleObject").click(function () {
        scaleObject();
    });


}




//main();