//画面
let width;
let height;

//three.js関連
let renderer;
let controls;
let camera;
const scene = new THREE.Scene();

//vroidのボーン
let bone;
let boneMap = new Map();
let parts;

//vroid部位
let humanoidParts = [];

//vroid モデル
const humanoidModel = {
  leem: "./leem.vrm"
};

//vroidモデル読み込み
let RESOURCE_LOADED = false;

//初期化
function setup() {
  const canvas = document.getElementById("myCanvas");
  const parent = canvas.parentNode;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight;

  renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#myCanvas')
  });

  width = parent.clientWidth;
  height = 800;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xf6f6f6, 1.0);

  //ライト
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);

  //点光源
  const light = new THREE.PointLight(0xffffff, 0.8, 18);
  light.position.set(-3, 6, -3);
  light.castShadow = true;
  light.shadow.camera.near = 0.1;
  light.shadow.camera.far = 10000;
  scene.add(light);

  camera = new THREE.PerspectiveCamera(90, width / height, 0.1, 100);
  camera.rotation.set(
    camera.rotation.x += Math.PI / 2,
    camera.rotation.y += Math.PI / 2,
    camera.rotation.z += Math.PI / 2
  );

  camera.position.set(0, 1.5, -1);
  camera.lookAt(0, 0, 0);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  //vroidを読み込むもの
  const loader = new THREE.VRMLoader();
  loader.load(humanoidModel.leem, function(vrm) {
    console.log(vrm);
    bones = vrm.parser.json.extensions.VRM.humanoid.humanBones;

    //ボーンとモデルの紐付け
    boneMap = new Map();
    for(let key in bones) {
      let target = bones[key];

      boneMap.set(target.bone,
        {
          name: vrm.parser.json.nodes[target.node].name,
          bone: vrm.scene.getObjectByName(vrm.parser.json.nodes[target.node].name, true)
        }
      );

      const op = document.createElement("option");
      op.value = target.bone;
      op.text = target.bone;
      document.getElementById("bodyparts").appendChild(op);
    }
    scene.add(vrm.scene);

    RESOURCES_LOADED = true;
  });

  draw();
}

//ループするところ
function draw() {
  renderer.render(scene, camera);
  requestAnimationFrame(draw);
}

// 画面のリサイズした時の処理
window.addEventListener('resize', onResize);
function onResize() {
  const canvas = document.getElementById("myCanvas");
  const parent = canvas.parentNode;

  width = parent.clientWidth;
  height = 800;

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  renderer.setClearColor(0xf6f6f6, 1.0);
}

// スライダー
const sliders = document.getElementsByClassName("slider");
for(let i = 0; i < 4; i++) {
  sliders[i].addEventListener('input', () => {

    qx = document.getElementById("qx").value;
    qy = document.getElementById("qy").value;
    qz = document.getElementById("qz").value;
    qw = document.getElementById("qw").value;

    parts = document.getElementById("bodyparts").value;

    const quat = new Quaternion(qx, qy, qz, qw);
    const quatNormal = QuaternionNormalize(quat);

    const rotationParts = boneMap.get(parts).bone.quaternion;

    rotationParts._x = quatNormal.x;
    rotationParts._y = quatNormal.y;
    rotationParts._z = quatNormal.z;
    rotationParts._w = quatNormal.w;

    document.getElementById("qx").value = quatNormal.x;
    document.getElementById("qy").value = quatNormal.y;
    document.getElementById("qz").value = quatNormal.z;
    document.getElementById("qw").value = quatNormal.w;
  });
}

document.getElementById("bodyparts").addEventListener('change', function() {
  parts = document.getElementById("bodyparts").value;

  const rotationParts = buoneMap.get(parts).bone.quaternion;

  const quat = new Quaternion(rotationParts._x, rotationParts._y, rotationParts._z, rotationParts._w);

  document.getElementById("qx").value = quat.x;
  document.getElementById("qy").value = quat.y;
  document.getElementById("qz").value = quat.z;
  document.getElementById("qw").vale = quat.w;
});

window.onload = setup;
