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
        mapProjection: new Cesium.GeographicProjection(), //proj, //new Cesium.GeographicProjection(),//new Cesium.WebMercatorProjection(), //new Cesium.GeographicProjection(),//proj,  
        sceneMode : Cesium.SceneMode.COLUMBUS_VIEW,

        baseLayerPicker: false,
        requestRenderMode: false,
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
viewer.scene.backgroundColor = Cesium.Color.WHITE

// 大気を消すことで球体の周りの奇妙な光を消す
viewer.scene.globe.showGroundAtmosphere = false;

// デバッグモード
// viewer.scene.debugShowCommands = true;