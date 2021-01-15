// 緯度方向でループするように実装
// 正距円筒図法
const wrap_crs = new L.Proj.CRS('EPSG:4326',
'+proj=eqc +lat_ts=0 +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +ellps=WGS84 +datum=WGS84 +units=m +no_defs',
{
resolutions: [
  65536, 16384, 8192, 4096, 2048, 1024, 512, 256, 128
],
origin: [0.0,0.0],
});

// マップを作成
const map = L.map(
    'plane-map',
    {
        preferCanvas: true,             // Canvasレンダラーを選択
        center:     [0, 0],             // Map中央の座標
        crs:        L.CRS.EPSG4326,           // 座標参照系
        maxZoom:    2,                  // 最大拡大率(レイヤごとに拡大率を変更することは可能だが, 少し面倒さくそうなので後回し)
        minZoom:    0,                  // 最小拡大率
        zoom:       0,                  // 初期拡大率
        worldCopyJump: false,
        continuousWorld: true,
    }
);

// ===== レイヤの追加 =====

// レイヤをまとめておく変数を用意
let layers = new L.control.layers();

// 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
for(let key in DEFINE.PHYSICAL_QUANTITY){
    let fixed_name = '';
    for(let fixed of DEFINE.PHYSICAL_QUANTITY[key].FIXED){
        fixed = fixed.concat('/');
        fixed_name = fixed_name.concat(fixed);
    }
    const scalar_layer = DCWMT.layer.plane.scalarData(
        {  
            scalar_layer_of_dir: `${DEFINE.ROOT}/${key}/${fixed_name}`,
            tileSize: new L.Point(DEFINE.PHYSICAL_QUANTITY[key].SIZE.X, DEFINE.PHYSICAL_QUANTITY[key].SIZE.Y),
        }
    );
    layers.addBaseLayer(scalar_layer, key);
    layers.addOverlay(scalar_layer, key);
};

// mapにレイヤを追加
layers.addTo(map);


//---

// // 緯度方向でループするように実装
// // 円筒メルカトル図法
// const _wrap_crs = L.Util.extend({}, L.CRS.EPSG3857, {})

// // マップを作成
// const _map = L.map(
//     'spherical-map',
//     {
//         preferCanvas: true,             // Canvasレンダラーを選択
//         center:     [0, 0],             // Map中央の座標
//         crs:        L.CRS.EPSG3857,     // 座標参照系
//         maxZoom:    2,                  // 最大拡大率(レイヤごとに拡大率を変更することは可能だが, 少し面倒さくそうなので後回し)
//         minZoom:    0,                  // 最小拡大率
//         zoom:       0,                  // 初期拡大率
//     }
// );

// // ===== レイヤの追加 =====

// // レイヤをまとめておく変数を用意
// let _layers = new L.control.layers();

// // 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
// for(let key in DEFINE.PHYSICAL_QUANTITY){
//     let fixed_name = '';
//     for(let fixed of DEFINE.PHYSICAL_QUANTITY[key].FIXED){
//         fixed = fixed.concat('/');
//         fixed_name = fixed_name.concat(fixed);
//     }
//     const scalar_layer = DCWMT.layer.plane.scalarData(
//         {  
//             scalar_layer_of_dir: `${DEFINE.ROOT}/${key}/${fixed_name}`,
//             tileSize: new L.Point(DEFINE.PHYSICAL_QUANTITY[key].SIZE.X, DEFINE.PHYSICAL_QUANTITY[key].SIZE.Y),
//         }
//     );
//     _layers.addBaseLayer(scalar_layer, key);
//     _layers.addOverlay(scalar_layer, key);
// };

// // mapにレイヤを追加
// _layers.addTo(_map);