import { 
    Viewer, 
    TileCoordinatesImageryProvider, 
    Color 
} from "cesium";

const viewer3D = (viewer_ele) => {
    const viewer = new Viewer(
        viewer_ele, // 表示するhtml要素
        {   
            // 画像参照を行うインスタンを設定
            imageryProvider: new TileCoordinatesImageryProvider(),
            baseLayerPicker: false,
            requestRenderMode: true,
            masximumRenderTimeChange: Infinity,
            timeline : false,
            animation : false,
            homeButton: false,
            vrButton: false,
            geocoder:false,
            sceneModePicker:false,
            navigationHelpButton:false,
            fullscreenButton: false,
            skyBox: false,
            skyAtmosphere: false,
        }
    );

    // ひとまず背景を白色にしておく
    viewer.scene.backgroundColor = Color.WHITE;

    // 大気を消すことで球体の周りの奇妙な光を消す
    viewer.scene.globe.showGroundAtmosphere = false;

    return viewer;
}

export default viewer3D;