// function onLoadedMap(){
//     // 球体を表示するためのcanvasを作成
//     const spherical_canvas = document.createElement("canvas");          // 球体用のキャンバスを作成
//     spherical_canvas.setAttribute("id", "spherical_canvas");
//     const spherical_map = document.getElementById("spherical-map");     // 球体を表示するためのmapを取得
//     spherical_map.appendChild(spherical_canvas);                        // キャンバスを子要素として追加

//     // レンダラーの作成
//     const renderer = new THREE.WebGLRenderer(
//         { 
//             canvas: spherical_canvas,           // レンダリング箇所を指定
//             alpha: true,                        // 背景を透過
//         }
//     );

//     // 親要素の縦横サイズを取得
//     const width = spherical_map.clientWidth
//         , height = spherical_map.clientHeight;

//     renderer.setSize(width, height);                    // 描画サイズの決定
//     renderer.setPixelRatio(window.devicePixelRatio);    // ピクセル比

//     // シーンの作成
//     const scene = new THREE.Scene();

//     // カメラの作成
//     const camera = new THREE.PerspectiveCamera(
//         45,                 // 画角
//         width / height,     // アスペクト比
//         1,                  // 描画開始距離
//         10000               // 描画終了距離
//     );
//     camera.position.set(0, 0, +1000);

//     const controls = new THREE.OrbitControls(camera, renderer.domElement);
//     controls.update();
    
//     const texture = new THREE.CanvasTexture(base_texture_p);
//     texture.needsUpdate = true;
    
//     // 物体の作成
//     const geometry = new THREE.SphereGeometry(300, 35, 35);
//     const material = new THREE.MeshStandardMaterial({
//         map: texture,
//         color: 0xFF0000,
//     });
//     const box = new THREE.Mesh(geometry, material);
//     scene.add(box);

//     // 光源の作成
//     const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
//     scene.add(light);

//     renderer.render(scene, camera);
// }

// const wrap__crs = L.Util.extend({}, L.CRS.Simple, {
//     wrapLat: [0, -DEFINE.tile_size.y],
//     wrapLng: [0, DEFINE.tile_size.x],
// });

// const base_texture_p = document.createElement("canvas");
// const base_texture_c = document.createElement("div");
// base_texture_p.appendChild(base_texture_c);

// let sqhericalMap;

// let sqhericalLayers = new L.control.layers();

// for(let scalar_quantity_of_dir of DEFINE.physical_quantity_of_dir.scalar){
//     //[TODO]: ディレクトリの受け渡しが決め打ちになっている. 時間と高さを変更できるように拡張すべし.
//     const scalar_layer = DCWMT.layer.threedData(
//         { scalar_layer_of_dir: `${DEFINE.root_of_dir}/${scalar_quantity_of_dir}/${DEFINE.time_of_dir[0]}/${DEFINE.z_axios_of_dir[0]}` }
//     );
//     sqhericalLayers.addBaseLayer(scalar_layer, scalar_quantity_of_dir);
//     sqhericalLayers.addOverlay(scalar_layer, scalar_quantity_of_dir);
//     sqhericalMap = L.map(
//         base_texture_c,
//         {
//             preferCanvas: true, // Canvasレンダラーを選択
//             // center:     [0, 0],
//             crs:        wrap__crs,
//             maxZoom:    DEFINE.max_zoom,
//             minZoom:    0,
//             // zoom:       0,
//             layers: [scalar_layer],
//         } 
//     );
// }

// sqhericalLayers.addTo(sqhericalMap);

// sqhericalMap.whenReady( onLoadedMap );

// sqhericalMap.setView([0, 0], 0);

// 球体を表示するためのcanvasを作成
const spherical_canvas = document.createElement("canvas");          // 球体用のキャンバスを作成
const spherical_map = document.getElementById("spherical-map");     // 球体を表示するためのmapを取得
spherical_map.appendChild(spherical_canvas);                        // キャンバスを子要素として追加

// レンダラーの作成
const renderer = new THREE.WebGLRenderer(
    { 
        canvas: spherical_canvas,           // レンダリング箇所を指定
        alpha: true,                        // 背景を透過
    }
);

// 親要素の縦横サイズを取得
const width = spherical_map.clientWidth
    , height = spherical_map.clientHeight;

renderer.setSize(width, height);                    // 描画サイズの決定
renderer.setPixelRatio(window.devicePixelRatio);    // ピクセル比

// シーンの作成
const scene = new THREE.Scene();

// カメラの作成
const camera = new THREE.PerspectiveCamera(
    45,                 // 画角
    width / height,     // アスペクト比
    1,                  // 描画開始距離
    10000               // 描画終了距離
);
camera.position.set(0, 0, +1000);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.update();

// テクスチャとして球体に貼る画像を作成
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
    color: 0xFFFFFF,
});
const box = new THREE.Mesh(geometry, material);
scene.add(box);

// 光源の作成
const light = new THREE.AmbientLight(0xFFFFFF, 1.0);
scene.add(light);

animate();

// ウィンドウのリサイズ時に再レンダリングを行うようにする.
window.onresize = function(){
    camera.aspect = spherical_map.clientWidth / spherical_map.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(spherical_map.clientWidth, spherical_map.clientHeight);
    renderer.render(scene, camera);
};

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}