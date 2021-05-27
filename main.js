/** @type {Object} CesiumJSのマップに関するオブジェクト */
const viewer = new Cesium.Viewer(
    "spherical-map", // 表示するhtml要素
    {
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
        sceneModePicker: false,
    }
);

// ひとまず背景を白色にしておく
viewer.scene.backgroundColor = Cesium.Color.WHITE;

// 大気を消すことで球体の周りの奇妙な光を消す
viewer.scene.globe.showGroundAtmosphere = false;

export default viewer;
