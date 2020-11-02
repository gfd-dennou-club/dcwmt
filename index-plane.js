// 左上を原点とする座標参照系(CRS)
const wrap_crs = L.Util.extend({}, L.CRS.Simple, {
    wrapLat: [0, -DEFINE.tile_size.y],
    wrapLng: [0, DEFINE.tile_size.x],
});

const map = L.map(
    'plane-map',
    {
        center:     [0, 0],
        crs:        wrap_crs,
        maxZoom:    DEFINE.max_zoom,
        minZoom:    0,
        zoom:       0,
    } 
);

// ===== レイヤの追加 =====

// レイヤをまとめておく変数を用意
let layers = new L.control.layers();

// 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
for(let scalar_quantity_of_dir of DEFINE.physical_quantity_of_dir.scalar){
    //[TODO]: ディレクトリの受け渡しが決め打ちになっている. 時間と高さを変更できるように拡張すべし.
    const scalar_layer = DCWMT.layer.scalarData(
        { scalar_layer_of_dir: `${DEFINE.root_of_dir}/${scalar_quantity_of_dir}/${DEFINE.time_of_dir[0]}/${DEFINE.z_axios_of_dir[0]}` }
    );
    layers.addBaseLayer(scalar_layer, scalar_quantity_of_dir);
    layers.addOverlay(scalar_layer, scalar_quantity_of_dir);
};

// mapにレイヤを追加
layers.addTo(map);
