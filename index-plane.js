// 緯度方向でループするように実装
const wrap_crs = L.Util.extend({}, L.CRS.EPSG4326, { wrapLng: false, wrapLat: false })

// マップを作成
const map = L.map(
    'plane-map',
    {
        preferCanvas: true,             // Canvasレンダラーを選択
        center:     [0, 0],             // Map中央の座標
        crs:        wrap_crs,           // 座標参照系
        maxZoom:    DEFINE.max_zoom,    // 最大拡大率
        minZoom:    0,                  // 最小拡大率
        zoom:       0,                  // 初期拡大率
    } 
);

// ===== レイヤの追加 =====

// レイヤをまとめておく変数を用意
let layers = new L.control.layers();

// 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
for(let scalar_quantity_of_dir of DEFINE.physical_quantity_of_dir.scalar){
    //[TODO]: ディレクトリの受け渡しが決め打ちになっている. 時間と高さを変更できるように拡張すべし.
    const scalar_layer = DCWMT.layer.plane.scalarData(
        {  
            scalar_layer_of_dir: `${DEFINE.root_of_dir}/${scalar_quantity_of_dir}/${DEFINE.time_of_dir}`,
            tileSize: new L.Point(DEFINE.tile_size.x, DEFINE.tile_size.y),
        }
    );
    layers.addBaseLayer(scalar_layer, scalar_quantity_of_dir);
    layers.addOverlay(scalar_layer, scalar_quantity_of_dir);
};

// mapにレイヤを追加
layers.addTo(map);