//タイル定義ファイル
var pt = L.gridLayer.numDataGroup('../../GridLayer/dataTile/PT',{
  tileSize : new L.Point(240, 240)//タイルの大きさを定義 new L.Point(横の解像度, 縦の解像度),
});
var vec_uv = L.gridLayer.vectorNumData('../../GridLayer/dataTile/U/','../../GridLayer/dataTile/V/',{
  tileSize : new L.Point(240, 240),
  size : 6, //矢印の長さ
  dens : 6, //1タイル中に描く矢印の本数(1〜15のうち 7,9,11,13,14でバグることを確認)
});

var baseMaps    = {"PT": pt, "U-V": vec_uv};
var overlayMaps = {"PT": pt, "U-V": vec_uv};
var layergroup = L.layerCtl(baseMaps, overlayMaps);
layergroup.addTo(map);
