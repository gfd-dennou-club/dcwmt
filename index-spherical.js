
console.log(DEFINE.PHYSICAL_QUANTITY["Ps"])
const myImageryProdiver = DCWMT.layer.globe.scalarData({
    url: `${DEFINE.ROOT}/Ps/time=32112/`,
    height: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.Y,
    width: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.X,
    maxZoom: DEFINE.PHYSICAL_QUANTITY["Ps"].MAX_ZOOM,
    minZoom: 0,
});

let viewer = new Cesium.Viewer(
    `spherical-map`, {   // 表示するhtml要素
        // 画像参照を行うインスタンを設定
        imageryProvider: myImageryProdiver.imageryProvider(),
        
        baseLayerPicker: false,
        requestRenderMode: true,
        masximumRenderTimeChange: Infinity,
        timeline : false,
        animation : false,
        homeButton: false,
        geocoder:false,
        zsceneModePicker:false,
        navigationHelpButton:false,
        fullscreenButton: false,
        skyBox: false,
        skyAtmosphere: false,
    }
);

// const _layers = viewer.scene.imageryLayers;
// // 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
// for(let key in DEFINE.PHYSICAL_QUANTITY){
//     let fixed_name = '';
//     for(let fixed of DEFINE.PHYSICAL_QUANTITY[key].FIXED){
//         fixed = fixed.concat('/');
//         fixed_name = fixed_name.concat(fixed);
//     }
//     const myImageryProdiver = DCWMT.layer.globe.scalarData({
//         url: `${DEFINE.ROOT}/${key}/${fixed_name}`,
//         height: DEFINE.PHYSICAL_QUANTITY[key].SIZE.Y,
//         width: DEFINE.PHYSICAL_QUANTITY[key].SIZE.X,
//         maxZoom: DEFINE.PHYSICAL_QUANTITY[key].MAX_ZOOM,
//         minZoom: 0,
//     });
//     _layers.addImageryProvider(myImageryProdiver);
// };

// ひとまず背景を白色にしておく
viewer.scene.backgroundColor = Cesium.Color.WHITE,

// 大気を消すことで球体の周りの奇妙な光を消す
viewer.scene.globe.showGroundAtmosphere = false;