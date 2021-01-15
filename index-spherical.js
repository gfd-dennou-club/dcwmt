
const myImageryProdiver = DCWMT.layer.globe.scalarData({
    url: `${DEFINE.ROOT}/Ps/time=32112/`,
    height: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.Y,
    width: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.X,
    maxZoom: DEFINE.PHYSICAL_QUANTITY["Ps"].MAX_ZOOM,
    minZoom: 0,
});

// 以下, 投影法について
// =====================================================================

// 球体は 世界測地系1984 に準拠
const proj = new Cesium.GeographicProjection(Cesium.Ellipsoid.WGS84);

// 座標変換( 地図投影法 → ピクセル座標 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
proj.transform = ( longlat ) => {
    // const firstProjection = "+proj=longlat +datum=WGS84 +no_defs";
    // const secondProjection = "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs";
    // const a = proj4(firstProjection, secondProjection, {x: longlat.longitude * 180.0 / Cesium.Math.PI, y: longlat.latitude * 180.0 / Cesium.Math.PI});

    // メルカトル図法
    if (longlat.latitude > proj.Maximum.latitude) {
        longlat.latitude = proj.Maximum.latitude;
    } else if (longlat.latitude < -proj.Maximum.latitude) {
        longlat.latitude = -proj.Maximum.latitude;
    }
    const sinLatitude = Math.sin(longlat.latitude);
    return {
        y: 0.5 * Math.log((1.0 + sinLatitude) / (1.0 - sinLatitude)),
        x: longlat.longitude,
    };        
}

// 座標変換( ピクセル座標 → 地図投影法 )
// この関数は project, unproject 内で使用するため, 既存機能としては存在していない
proj.untransform = ( coords ) => {
    return {
       latitude: (Math.PI/2.0) - 2.0 * Math.atan(Math.exp(-coords.y)),
       longitude: coords.x,
    };
}

proj.Maximum = proj.untransform({y: Math.PI, x: undefined});

// 地図投影法( 緯度経度 → ピクセル座標 )
proj.base_project = proj.project;
proj.project = ( cartographic, result ) => {
    if (!Cesium.defined(cartographic)) { throw new Cesium.DeveloperError("cartographic is required"); }

    const semimajorAxis = proj._semimajorAxis;

    const longlat = {latitude: cartographic.latitude, longitude: cartographic.longitude};
    console.log(longlat)
    const trans = proj.transform(longlat);

    const x = trans.x * semimajorAxis;
    const y = trans.y * semimajorAxis;
    const z = cartographic.height;

    if (!Cesium.defined(result)) { return new Cesium.Cartesian3(x, y, z); }

    result.x = x;
    result.y = y;
    result.z = z;
    return result;
}

// 地図投影法( ピクセル座標 → 緯度経度 )
proj.base_unproject = proj.unproject;
proj.unproject = ( cartesian, result ) => {
    if (!Cesium.defined(cartesian)) { throw new Cesium.DeveloperError("cartesian is required"); }

    const oneOverEarthSemimajorAxis = proj._oneOverSemimajorAxis;

    const xy = {x: cartesian.x * oneOverEarthSemimajorAxis, y: cartesian.y * oneOverEarthSemimajorAxis};
    const trans = proj.untransform(xy);

    const longitude = trans.longitude;
    const latitude = trans.latitude;
    const height = cartesian.z;

    if (!Cesium.defined(result)) { return new Cesium.Cartographic(longitude, latitude, height); }

    result.longitude = longitude;
    result.latitude = latitude;
    result.height = height;
    return result;
}

// =====================================================================

let viewer = new Cesium.Viewer(
    `spherical-map`, {   // 表示するhtml要素
        // 画像参照を行うインスタンを設定
        imageryProvider: myImageryProdiver.imageryProvider(),
        mapProjection: new Cesium.GeographicProjection(),//proj, // new Cesium.WebMercatorProjection(), 
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

// Click Event
// viewer.canvas.addEventListener('click',
//     function(e){
//         let mousePosition = new Cesium.Cartesian2(e.clientX, e.clientY);
//         let ellipsoid = viewer.scene.globe.ellipsoid;
//         let cartesian = viewer.camera.pickEllipsoid(mousePosition, ellipsoid);
//         if(cartesian){
//             let cartographic = Cesium.Cartographic.fromCartesian(cartesian);
//         }
//     }
//)