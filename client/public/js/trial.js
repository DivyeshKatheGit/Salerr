//set up variables
let container,scene,camera,renderer,controls;

function init()
{

    $('.loader_wrapper').css('display','flex');

    container = document.querySelector('.scene');
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog( 0xd0d0d0, 100, 400 );
    const axesHelper = new THREE.AxesHelper( 500 );
    axesHelper.position.set(0,-4,0);
    // scene.add( axesHelper );

    //set up camera
    const fov = 30;
    const aspect = container.clientWidth/container.clientHeight;
    const near = 0.1;
    const far = 1000;

    camera = new THREE.PerspectiveCamera(fov,aspect,near,far);
    camera.position.set(0,10,60);

    //set up renderer
    renderer = new THREE.WebGLRenderer({antialias: true ,alpha : true});
    renderer.setSize( container.innerWidth , container.innerHeight );
    renderer.toneMaping = THREE.ReinhardToneMapping;
    renderer.toneMapingExposure = 2.3;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    //HemiSphere
    HemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444);
    HemiLight.position.set( 0, 20, 0 );
    scene.add( HemiLight );

    // addAmbientLight(scene,0xffffff,1);
    addSpotLight(scene,0xffffff);

    // addFloor(scene,300);
    // addGrid(scene,10);
    // addCircularPlate(scene,10);

    // for(i=1;i<=20;i++)
    // {
    //     createSphere(scene);
    // }
    addCylinderPlate(scene,20,2)

    addControls(camera,renderer);

    loadModel(scene);

}

function animate()
{
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    controls.update();
    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
}

function createSphere(scene)
{
    const geometry = new THREE.SphereGeometry( 5, 30, 30 );
    const material = new THREE.MeshPhongMaterial( {color: 0x0984e3} );
    let sphere = new THREE.Mesh( geometry, material );
    sphere.castShadow = true;
    sphere.receiveShadow = true;
    sphere.position.set(getRendomInteger(-150,150),1,getRendomInteger(-150,150));
    scene.add( sphere );
}

function addControls(camera,renderer)
{
    // Add controls
    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.maxPolarAngle = Math.PI  / 2;
    controls.minPolarAngle = Math.PI / 4;
    controls.minDistance = 40;
    controls.maxDistance = 100;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.dampingFactor = 0.1;
    controls.autoRotate = false; // Toggle this if you'd like the chair to automatically rotate
    controls.autoRotateSpeed = 0.2; // 30
}

function addFloor(scene,size)
{
    //add floor
    var floor = new THREE.Mesh( new THREE.PlaneGeometry( size,size ), new THREE.MeshPhongMaterial( { color: 0x808080, dithering: true  } ) );
    floor.rotation.x = -0.5 * Math.PI;
    floor.castShadow = false;
    floor.receiveShadow = true;
    floor.position.set(0,-4,0);
    scene.add(floor);
}

function addGrid(scene,size)
{
    const helper = new THREE.GridHelper( size, size );
	helper.position.y = - 4;
	helper.material.opacity = 0.25;
	helper.material.transparent = true;
	scene.add( helper );
}

function addAmbientLight(scene,light,intensity)
{
    const AmbientLight = new THREE.AmbientLight( light , intensity );
    scene.add( AmbientLight ); 
}

function addSpotLight(scene,light)
{
    let spotLight = new THREE.SpotLight( light , 0.8 );
    spotLight.name = 'Spot Light';
    spotLight.position.set( 300,100,300 );
    spotLight.angle = Math.PI * 0.2;
    spotLight.penumbra = 0.1;
	spotLight.decay = 2;
	spotLight.distance = 2000;
    spotLight.castShadow = true;
    spotLight.shadow.camera.near = 8;
    spotLight.shadow.camera.far = 10;
    spotLight.shadow.mapSize.width = 1024;
    spotLight.shadow.mapSize.height = 1024;
    scene.add( spotLight );

    lightHelper = new THREE.SpotLightHelper( spotLight );
	// scene.add( lightHelper );

}

function getRendomInteger(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function addCircularPlate(scene,radius)
{
    const geometry = new THREE.CircleGeometry( radius , 200);
    const material = new THREE.MeshPhongMaterial( { color: 0xE6AB39, dithering: true , side : THREE.DoubleSide } );
    const circle = new THREE.Mesh( geometry, material );
    circle.rotation.x = -0.5 * Math.PI;
    circle.castShadow = true;
    circle.receiveShadow = true;
    circle.position.set(0,-8,0);
    scene.add( circle );
}


function addCylinderPlate(scene,radius,height)
{
    const geometry = new THREE.CylinderGeometry( radius, radius, height, 200 );
    const material = new THREE.MeshPhongMaterial( { color: 0xe6ab39, dithering: true  } );
    const cylinder = new THREE.Mesh( geometry, material );
    cylinder.castShadow = false;
    cylinder.receiveShadow = true;
    cylinder.position.set(0,-8,0);
    scene.add( cylinder );
}

function loadModel(scene)
{
    const TLoader = new THREE.TextureLoader();
    shirtTexture = TLoader.load($('#front_img').attr('src'));
    shirtTexture.offset.set(-0.145,0.035,0)
    shirtTexture.repeat.set(1.75,2,1);
    shirtTexture.rotation = Math.PI;
    shirtTexture.flipY = false;
    shirtTexture.wrapS = THREE.RepeatWrapping;
    shirtTexture.wrapT = THREE.RepeatWrapping;

    shirtBTexture = TLoader.load($('#back_img').attr('src'));
    shirtBTexture.offset.set(0,0.10,0);
    shirtBTexture.repeat.set(0.75,2,1);
    shirtBTexture.rotation = Math.PI * -0.5;
    shirtBTexture.flipY = false;
    shirtBTexture.wrapS = THREE.RepeatWrapping;
    shirtBTexture.wrapT = THREE.RepeatWrapping;

    // Initial material
    const Body_MTL = new THREE.MeshStandardMaterial( { color: 0xfab1a0  } );
    const Shirt_MTL = new THREE.MeshStandardMaterial( { map : shirtTexture } );
    const ShirtB_MTL = new THREE.MeshStandardMaterial( { map : shirtBTexture } );
    const Shorts_MTL = new THREE.MeshStandardMaterial( { color: 0x2d3436} );
    const Sneakers_MTL = new THREE.MeshStandardMaterial( { color: 0xdfe6e9} );
    const Hair_MTL = new THREE.MeshStandardMaterial( { color: 0x000000 } );
    const Eye_MTL = new THREE.MeshStandardMaterial( { color: 0xffb1a0 } );

    const INITIAL_MAP = [
        {childID: "Body", mtl: Body_MTL},
        {childID: "ShirtFront", mtl: Shirt_MTL},
        {childID: "ShirtBack", mtl: ShirtB_MTL},
        {childID: "Shorts", mtl: Shorts_MTL},
        {childID: "Sneakers", mtl: Sneakers_MTL},
        {childID: "Hair", mtl: Hair_MTL},
        {childID: "Eye", mtl: Eye_MTL}
    ];

    //loading the model

    const MODEL_PATH =  "../assets/model/HumanFinal.glb";

    var loader = new THREE.GLTFLoader();
    loader.load(MODEL_PATH,function(gltf)
    {
        // console.log(gltf);
        model = gltf.scene.children[0];
        model.traverse((o) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
         });
        model.scale.set(0.1,0.1,0.1);
        model.position.y = -7;

        // Set initial textures
        for (let object of INITIAL_MAP) {
            initColor(model, object.childID, object.mtl);
        }

        scene.add(model);
        animate();

        console.log('loaded');

        $('.loader_wrapper').css('display','none');

    });

}

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
    parent.traverse((o) => {

    if (o.isMesh) {

    if (o.name.includes(type)) {

            // console.log(o.name);
            // console.log(o.material);
            o.material = mtl;
            o.material.skinning = true;
            o.nameID = type; // Set a new property to identify this object
        }
    }
});
}

//for screen resize
function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    var width = window.innerWidth;
    var height = window.innerHeight;
    var canvasPixelWidth = canvas.width / window.devicePixelRatio;
    var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
      
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  $(document).ready(function () {
        init();
  });