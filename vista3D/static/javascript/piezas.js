import * as THREE from "/static/threejs/three.module.js";
import { OrbitControls } from "/static/threejs/OrbitControls.js";
import { TransformControls } from '/static/threejs/TransformControls.js';
import { STLLoader } from "/static/threejs/STLLoader.js";

class PickHelper {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.pickedObject = null;
        this.pickedObjectSavedColor = 0;
    }
    isInside(normalizedPosition, scene, camera, time) {
        var inInside = false

        // restore the color if there is a picked object
        if (this.pickedObject) {
            //this.pickedObject.material.emissive.setHex(this.pickedObjectSavedColor);
            this.pickedObject = undefined;
        }

        // cast a ray through the frustum
        this.raycaster.setFromCamera(normalizedPosition, camera);
        // get the list of objects the ray intersected
        const intersectedObjects = this.raycaster.intersectObjects(scene.children);
        if (intersectedObjects.length) {
            if (intersectedObjects[0].object.visible) {
                this.pickedObject = intersectedObjects[0].object;

                /*// pick the first object. It's the closest one
                this.pickedObject = intersectedObjects[0].object;
                // save its color
                this.pickedObjectSavedColor = this.pickedObject.material.emissive.getHex();
                // set its emissive color to flashing red/yellow
                this.pickedObject.material.emissive.setHex((time * 8) % 2 > 1 ? 0xFFFF00 : 0xFF0000);*/
                inInside = true;
            }


        }
        return inInside;
    }
    pickClicker(normalizedPosition, scene, camera, time) {
        if (this.isInside(normalizedPosition, scene, camera, time)) {
            objectButton();
            moveCameraToObject(this.pickedObject, camera);
            showMenu();
        }
    }
    pickMouseOver(normalizedPosition, scene, camera, time) {
        if(idSelectedObject === -1 ){
            if (this.isInside(normalizedPosition, scene, camera, time)) {
                if(elementInfo.text() === ""){
                    showInfoObject(this.pickedObject.id)
                }
                    
            }else{
                if(elementInfo.text() !== ""){
                    clearInfoObject();
                }
            }
        }
        

    }
}

class dataObject {
    constructor(data) {
        this.id = data[0];
        this.nameFile = data[1];
        this.size = data[2];
        this.posX = data[3];
        this.posY = data[4];
        this.tipo = data[5];
        this.image = data[6]
    }

    getInfo() {
        var splitName = this.nameFile.split("/");
        var numSplit = splitName.length;
        var file = splitName[numSplit - 1];
        var info = "Nombre: " + file + "\n";
        info += "Tama??o: " + this.size + " mm";
        return info;
    }
}

const pickPosition = { x: 0, y: 0 };
const pickHelper = new PickHelper();
let scene;
const vectorCameraPosInit = new THREE.Vector3(0, 30, 100);
const vectorScaleInit = new THREE.Vector3(0.2, 0.2, 0.2);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 300);
camera.position.z = 100;
camera.position.y = 30
let idSelectedObject = -1;
let numberObjects = objects.length;

//id que tiene el modelo de threejs. El objeto con id 1 tendra el id de three js en la posicion 1 de este array
let idsObjects = new Array(numberObjects);
//datos que obtenemos de la base de datos
let dataObjects = new Array(numberObjects);
//modelos de threejs. Tienen el mismo orden que idsObjects
let modelObjects = new Array(numberObjects);
let elementInfo = $("#infoObject");
let divMenu = $('#accordion');
let numberObjectsLoad = 0;
const canvas = document.querySelector('canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
const control = new OrbitControls(camera, renderer.domElement);
const transformControl = new TransformControls(camera, renderer.domElement);

main();

function clearInfoObject(){
    elementInfo.text("");
}

function getObjectById(idObject){
    var posObject = jQuery.inArray(idObject, idsObjects);
    return dataObjects[posObject];
}

function showInfoObject(idSelectedObject) {
    var classObject =  getObjectById(idSelectedObject);
    var obj = elementInfo.text(classObject.getInfo());
    obj.html(obj.html().replace(/\n/g,'<br/>'));

}
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
function cargarSTL(loader, material, dataObject) {
    loader.load(dataObject.nameFile, (model) => {
        var modelo = new THREE.Mesh(model, material);
        modelo.scale.set(vectorScaleInit.x, vectorScaleInit.y, vectorScaleInit.z);
        modelo.position.set(dataObject.posX, dataObject.posY, 0);
        idsObjects[dataObject.id] = modelo.id;
        dataObjects[dataObject.id] = dataObject;
        numberObjectsLoad += 1;
        modelObjects[dataObject.id] = modelo;
        
        changeLoadPercentage(numberObjectsLoad/numberObjects * 100)
        if (numberObjectsLoad == numberObjects){
            deleteLoadScreen();
            startApplication();
            homeButton();
            createMenu();
            /*for(var i = 0; i < numberObjects; i++){
                console.log(idsObjects[i] + " " + modelObjects[i].id + " " + dataObjects[i].id);
                console.log(dataObjects[i].nameFile);
                
            }*/
            
        }
        //console.log(numberObjectsLoad);
    });
    
}

function startApplication(){
    modelObjects.forEach(model => scene.add(model));
    $("canvas").dblclick(function (e) {
        pickHelper.pickClicker(pickPosition, scene, camera, 1);
    });
    $("canvas").mousemove(function (e) {
        pickHelper.pickMouseOver(pickPosition, scene, camera, 1);
    });
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
    $('#download').click(function(e) {
        if(idSelectedObject === -1){
            window.location.href = '/static/3dmodels/modelos.zip';
        }else{
            var objectDownload = getObjectById(idSelectedObject);
            window.location.href = objectDownload.nameFile ;
        }
        
    });
}

function createMenuOption(object){

    var option = '<div id="object'+ object.id + '">';
    option += '<input type="hidden" value="'+ object.id + '">';
    option += '<img src="' + object.image + '">' + "</div>";
    return option;
}
function clickObjectMenu(id){
    changeObject(id);
}
function createDivMenu(div){
    $("#" + div[0].tipo).append(div[1]);
    $("#object" + div[0].id).dblclick(function () {
        clickObjectMenu(div[0].id);
    });

}
function createCardMenu(id){
    var divCard = '<div class="card">\n';
        divCard += '<div class="card-header">\n';
    divCard += '<a class="card-link" data-toggle="collapse" href="#collapse'+id+'">'+ id +'</a>';
    divCard += '\n</div>'
    divCard += '<div id="collapse'+id+'" class="collapse show" >'
        divCard += '<div id="' + id + '" class="card-body">'; 
        divCard += '</div>'
    divCard += '</div>';
    divCard += '</div>';
    console.log(divCard)
    return divCard;
}
function createMenu(){

    divMenu.append(createCardMenu('bases'));
    divMenu.append(createCardMenu('conexiones'));
    divMenu.append(createCardMenu('humedad'));
    divMenu.append(createCardMenu('salas'));
    divMenu.append(createCardMenu('cierres'));
    divMenu.append(createCardMenu('tuercas'));
    var divsMenu = new Array(numberObjects);
    for(var i = 0; i < numberObjects; i++){
        var stringDiv = createMenuOption(dataObjects[i]);
        divsMenu[dataObjects[i].id] = [dataObjects[i], stringDiv];
    }
    
    

    divsMenu.forEach(div => createDivMenu(div));
    
}

function moveCameraToObject(object) {
    var middle = getCenterPoint(object);
    var posCamera = new THREE.Vector3(middle.x, middle.y, 50);



    changeCameraAndControl(posCamera, middle);
    idSelectedObject = object.id;
    showOnlyIdObject(object.id);
    showInfoObject(object.id);
    /*var box = new THREE.BoxHelper( object, 0x000000 );
    scene.add(box);*/
    /*const geometry = new THREE.SphereGeometry( 2, 32, 16 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const sphere = new THREE.Mesh( geometry, material );
    sphere.position.set(middle.x, middle.y, middle.z);

    scene.add( sphere );*/


}

function changeCameraAndControl(posCamera, posControl) {
    camera.position.set(posCamera.x, posCamera.y, posCamera.z);
    control.target.set(posControl.x, posControl.y, posControl.z);
    control.update();
    render();
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



function moveCameraToInit() {
    var posControl = new THREE.Vector3(0, 0, 0);
    changeCameraAndControl(vectorCameraPosInit, posControl);
}

function returnFullView() {
    if (idSelectedObject !== -1) {
        hideMenu();
        homeButton();
        idSelectedObject = -1;
        showAllObject();
        clearInfoObject();
        moveCameraToInit();

    }

    deScaleMode();


}
function changeNexPreviousObject(page){
    var posNextId = (jQuery.inArray(idSelectedObject, idsObjects) + page) % numberObjects;
    posNextId = (posNextId + numberObjects) % numberObjects;
    changeObject(posNextId);
}

function changeObject(posNextId) {

    if (idSelectedObject !== -1) {
        

        idSelectedObject = idsObjects[posNextId];

        var object = scene.getObjectById(idSelectedObject, true);
        moveCameraToObject(object);
        deScaleMode();

    }
}

function nextObject() {
    changeNexPreviousObject(1);
}
function previousObject() {
    changeNexPreviousObject(-1);
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
           

        } else {

            deScaleMode();


        }
    }


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

function changeLoadPercentage (percentage){
    $("#loadPercentage").text(Math.trunc(percentage) + "%");
}

function deleteLoadScreen(){
    $("#loadScreen").remove();
    $("#buttons").css('visibility', 'visible');
}

function homeButton(){
    $("#previous").hide();
    $("#next").hide();
    $("#backHome").hide();
    $("#escaleObject").hide();  
}
function objectButton(){
    $("#previous").show();
    $("#next").show();
    $("#backHome").show();
    $("#escaleObject").show();  
}
function hideMenu(){
    divMenu.hide();
}
function showMenu(){
    divMenu.show();
}

function main() {
    

    

    /*const fov = 60;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 200;*/


    scene = new THREE.Scene();
    scene.background = new THREE.Color('white');

    // put the camera on a pole (parent it to an object)
    // so we can spin the pole to move the camera around the scene
    scene.add(camera);


    

    
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

    clearPickPosition();

    //createMenu();
    hideMenu();
    for (var i = 0; i < numberObjects; i++) {
        var datos = new dataObject(objects[i]);
        cargarSTL(loader, materialSTL, datos);
    }

    requestAnimationFrame(render);

}




//main();