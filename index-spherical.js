
const myImageryProdiver = DCWMT.layer.globe.scalarData({
    url: `${DEFINE.root_of_dir}/${DEFINE.physical_quantity_of_dir.scalar[0]}/${DEFINE.time_of_dir}/`,
    height: DEFINE.tile_size.y,
    width: DEFINE.tile_size.x,
    maxZoom: DEFINE.max_zoom,
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

// ひとまず背景を白色にしておく
viewer.scene.backgroundColor = Cesium.Color.WHITE,

// 大気を消すことで球体の周りの奇妙な光を消す
viewer.scene.globe.showGroundAtmosphere = false;