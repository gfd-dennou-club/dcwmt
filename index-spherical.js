// 球体を表示するためのcanvasを作成
const spherical_map = document.createElement("canvas");
document.getElementById("spherical-map").appendChild(spherical_map);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer(
    { 
        canvas: spherical_map,
        alpha: true, 
    }
);
const width = document.getElementById("spherical-map").clientWidth
    , height = document.getElementById("spherical-map").clientHeight;

renderer.setSize(width, height);                    // 描画サイズの決定
renderer.setPixelRatio(window.devicePixelRatio);    // ピクセル比

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成 (以下設定, 現在テキトー)
const camera = new THREE.PerspectiveCamera(
    45,                 // 画角
    width / height,     // アスペクト比
    1,                  // 描画開始距離
    10000               // 描画終了距離
);
camera.position.set(0, 0, +1000);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

const scalar_layer = DCWMT.layer.scalarData(
    { scalar_layer_of_dir: `${DEFINE.root_of_dir}/PT/${DEFINE.time_of_dir[0]}/${DEFINE.z_axios_of_dir[0]}` }
);
scalar_layer.initialize();
const tile = scalar_layer.createTile({x: 0, y: 0, z: 0});
const texture = new THREE.CanvasTexture(tile);
texture.needsUpdate = true;

// 物体の作成
const geometry = new THREE.SphereGeometry(300, 35, 35);
const material = new THREE.MeshStandardMaterial({
    map: texture,
    color: 0xffffff,
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// 光源
const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);

animate();

// ウィンドウのリサイズ時に再レンダリングを行うようにする.
window.onresize = function(){
    camera.aspect = document.getElementById("spherical-map").clientWidth / document.getElementById("spherical-map").clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.getElementById("spherical-map").clientWidth, document.getElementById("spherical-map").clientHeight);
    renderer.render(scene, camera);
};

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}