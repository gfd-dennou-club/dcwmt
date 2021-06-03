// import layer from "../modules/layer.js";

// // const myImageryProdiver = DCWMT.layer({
// //     url: `${DEFINE.ROOT}/Temp/lat=89/`,
// //     height: 297,
// //     width: 297,
// //     maxZoom: 1,
// //     minZoom: 0,
// // });

// const myImageryProdiver = layer({
//     url: `${DEFINE.ROOT}/Ps/time=32112/`,
//     height: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.Y,
//     width: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.X,
//     maxZoom: DEFINE.PHYSICAL_QUANTITY["Ps"].MAX_ZOOM,
//     minZoom: 0,
// });

// const viewer = new Cesium.Viewer(
//     `spherical-map`, {   // 表示するhtml要素
//         // 画像参照を行うインスタンを設定
//         imageryProvider: myImageryProdiver.imageryProvider(),
//         mapProjection: DEFINE.PROJECTION.mapProjection,
//         sceneMode : DEFINE.PROJECTION.sceneMode,
//         baseLayerPicker: false,
//         requestRenderMode: true,
//         masximumRenderTimeChange: Infinity,
//         timeline : false,
//         animation : false,
//         homeButton: false,
//         geocoder:false,
//         zsceneModePicker:false,
//         navigationHelpButton:false,
//         fullscreenButton: false,
//         skyBox: false,
//         skyAtmosphere: false,
//         sceneModePicker: false,
//     }
// );

// // ひとまず背景を白色にしておく
// viewer.scene.backgroundColor = Cesium.Color.WHITE;

// // 大気を消すことで球体の周りの奇妙な光を消す
// viewer.scene.globe.showGroundAtmosphere = false;

// // デバッグモード
// // viewer.scene.debugShowCommands = true;

// export const scene = viewer.scene;
// export const imageryProvider = myImageryProdiver;