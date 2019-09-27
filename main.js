/*各種変数定義*/
var buf = new ArrayBuffer(4);       //32bitのバッファ用意
var data_view = new DataView(buf);  //用意したバッファにDataViewクラスを介して入出力
var min, max;                 //カラーマップの最大、最小、各色の差
var new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
  wrapLng: [0,  240],
  wrapLat: [0, -240]
});
var map = L.map('map',{
  center: [0, 0],
  crs:new_crs_simple,
  //crs:L.CRS.Simple,
  maxZoom: 4,
  minZoom: 0,
  zoom: 1,
});

var layer_PT = L.gridLayer.numData('dataTile/PT/',{
  tileSize : new L.Point(240, 240),
  name: "PT",
  operation: "",
  contour: false,
  shade:   true,
  isGrid : false
});
/*var layer_U = L.gridLayer.numData('dataTile/V/',{
  tileSize : new L.Point(240, 240),
  name: "U",
  operation: "",
  contour: false,
  shade:   true,
  isGrid : false
});*/
var layer_UV = L.gridLayer.vectorNumData('dataTile/U/','dataTile/V/',{
  tileSize : new L.Point(240, 240),
  name: "U-V",
  size : 6, //矢印の長さ倍率
  dens : 6, //1タイル中に描く矢印の本数(1〜15のうち 7,9,11,13,14でバグることを確認)
  isGrid : false
});
/*クロスヘアインスタンス生成*/
var cross = L.crosshairs({
  style: {
    opacity: 1,
    fillOpacity: 0,
    weight: 1.5,
    color: '#fff',
    radius: 15
  }
});
var layer, layerNum, activeLayer
layer = [layer_PT, layer_UV];
var flag = 1;  //仮フラグ 0: トーン図同士の重ね合わせ　　1:　トーン図とベクトルの重ね合わせ
if(flag == 0){
  layerNum = layer.length;
  activeLayer = 0;
  for(var i = layerNum - 1; i >= 0; i--){
    map.addLayer(layer[i]);
  }
}
if(flag == 1){
    map.addLayer(layer_PT);
    map.addLayer(layer_UV);
    layerNum = 1;
    activeLayer = 0;
}
cross.addTo(map);
//gridLayer.numData内で画像読み込み後に実行
//値をreturnできないので画像を読み込んだ時点で実行しないといけない
//drawText(layer[activeLayer]);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/

map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  layer[activeLayer].getNum(coords, point);
  //  console.log( pixelData.toPrecision(5) );
});

var tmpOpacity = layer_PT.options.opacity;
var flag = 1;
/*
/*キー押下時　諸々処理*/
map.on('keypress', function(e){
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "d"){
      activeLayer ++;
      if( activeLayer >= layerNum ){
        activeLayer = 0;
      }
      layer[activeLayer].bringToFront();
  }
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "a"){
      activeLayer --;
      if( activeLayer < 0 ){
        activeLayer = layerNum - 1;
      }
      layer[activeLayer].bringToFront();
  }
  /*カラーマップのレンジ変更*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(layer[activeLayer]);
  }
  /*不透明度 入力&変更*/
  if(e.originalEvent.key === "t"){
      var opacity = window.prompt('不透明度');
      if(0 <= opacity && opacity <= 1){
        layer[activeLayer].options.opacity = opacity; //要注意 アクセス権限ガバガバ
        //tmpOpacity = opacity; //不透明度強制0 On-Offを有効にするならコメント解除
      }
  }
  if(e.originalEvent.key === "q"){
      alert(layer[activeLayer].max);
      alert(layer[activeLayer].min);
  }
  /*不透明度強制0 On Off*/
  /*
  if(e.originalEvent.key === "e"){
      console.log(flag);
      if(flag == 1){
        flag = 0;
      }else{
        flag = 1;
      }
      viewLayer[activeLayer].options.opacity = tmpOpacity*flag;
  }*/

  /*カラーマップ変更*/
  if(e.originalEvent.key === "z"){
      var input = get2digitsNum( window.prompt('colormap') );
      try{
        console.log(eval( "clrmap_"+input ));
        layer[activeLayer]._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
  }

  for(var i = 0; i < layerNum; i++){
    layer[i].redraw();
  }
  drawText(layer[activeLayer]);
});
