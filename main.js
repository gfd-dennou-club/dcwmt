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
  zoom: 0,
});
/*データタイル、ビュータイルのインスタンス生成*/
/*var dataLayer_U = L.gridLayer.numata('dataTile/U/',{
  tileSize : new L.Point(240, 240)
});
map.addLayer(dataLayer_U);*/
var layer_PT = L.gridLayer.numData('dataTile/PT/',{
  tileSize : new L.Point(240, 240),
  name: "PT",
  operation: "",
  contour: false,
  shade:   true,
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

var layer = [layer_PT];
var layerNum = layer.length;
var activeLayer = 0;

for(var i = layerNum - 1; i >= 0; i--){
  map.addLayer(layer[i]);
}
cross.addTo(map);
drawText(layer[activeLayer]);

/*イベント*/
/*クリック時　対象ピクセルの値を表示*/

map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layer[activeLayer]);
  var pixelData = layer[activeLayer].getNum(coords, point);
  console.log( pixelData.toPrecision(5) );
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
      viewLayer[activeLayer].bringToFront();
  }
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "a"){
      activeLayer --;
      if( activeLayer < 0 ){
        activeLayer = layerNum - 1;
      }
      viewLayer[activeLayer].bringToFront();
  }
  /*カラーマップのレンジ変更*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(viewLayer[activeLayer]);
  }
  /*不透明度 入力&変更*/
  if(e.originalEvent.key === "t"){
      var opacity = window.prompt('不透明度');
      if(0 <= opacity && opacity <= 1){
        viewLayer[activeLayer].options.opacity = opacity; //要注意 アクセス権限ガバガバ
        //tmpOpacity = opacity; //不透明度強制0 On-Offを有効にするならコメント解除
      }
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
        viewLayer[activeLayer]._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
  }

  for(var i = 0; i < layerNum; i++){
    dataLayer[i].redraw();
    viewLayer[i].redraw();
  }
  drawText(viewLayer[activeLayer]);
});



/*memo*/
layer[0].on('tileloadstart', function(e) {
   console.log("開始");
}); //タイル読み込み時に発火*/
layer[0].on('tileunload', function(e) {
    console.log("消");
});
layer[0].on('tileload', function(e) {
   console.log("読");
});
