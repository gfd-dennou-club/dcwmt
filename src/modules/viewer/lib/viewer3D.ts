import { Viewer, TileCoordinatesImageryProvider, Color } from 'cesium';

export type ReturnedTypeIn3D = Viewer;

export const viewer3D = (mapEl: HTMLDivElement): Viewer => {
  const viewer = new Viewer(
    mapEl, // 表示するhtml要素
    {
      // 画像参照を行うインスタンを設定
      imageryProvider: new TileCoordinatesImageryProvider(),
      baseLayerPicker: false,
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
      timeline: false,
      animation: false,
      homeButton: false,
      vrButton: false,
      geocoder: false,
      sceneModePicker: false,
      navigationHelpButton: false,
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
};
