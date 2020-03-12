/*各種変数定義*/
var buf = new ArrayBuffer(4);       //32bitのバッファ用意
var data_view = new DataView(buf);  //用意したバッファにDataViewクラスを介して入出力
var min, max;                 //カラーマップの最大、最小、各色の差
var new_crs_simple
if(typeof continuous !== 'undefined' && continuous){
  new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
    wrapLng: [0,  tile_size_x],
   wrapLat: [0, -tile_size_y]
  });
}else{
  new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
    wrapLng: [0, tile_size_y]
  });
}

var map = L.map('map',{
  center: [0, 0],
  crs:new_crs_simple,
  //crs:L.CRS.Simple,
  maxZoom: max_zoom,
  minZoom: 0,
  zoom: 0,
});

var layer=[];
var layer_vec=[];
var baseMaps = {};
var overlayMaps = {};

for(var i = 0; i < value_name.length; i++){
  layer[i] = L.gridLayer.numData(`${dir_root}/${value_name[i]}`,{
    tileSize : new L.Point(tile_size_x, tile_size_y),//タイルの大きさを定義 new L.Point(横の解像度, 縦の解像度),
    dir_t    : dir_time,
    dir_d    : dir_dim
  });

  var q=layer[i];
  eval("baseMaps." + value_name[i]+ "=layer[i];");
  eval("overlayMaps." + value_name[i]+ "=layer[i];");
}
//baseMaps.PTemp = layer[0];
//baseMaps.VelX = layer[1];
for(var i = 0; i < value_name_vec.length; i+=2){
  layer_vec[i/2] = L.gridLayer.vectorNumData(`${dir_root}/${value_name_vec[i+0]}`,`${dir_root}/${value_name_vec[i+1]}`,{
    tileSize : new L.Point(tile_size_x, tile_size_y),//タイルの大きさを定義 new L.Point(横の解像度, 縦の解像度),
    dir_t    : dir_time,
    dir_d    : dir_dim,
    size : 6, //矢印の長さ倍率
    dens : 8
  });
  //eval("baseMaps." + value_name_vec[i+0] + "=layer_vec[i/2];");
  eval("overlayMaps.vec_"+ value_name_vec[i+0] +""+value_name_vec[i+1]+ "=layer_vec[i/2];");
}
var layergroup = L.layerCtl(baseMaps, overlayMaps);
layergroup.addTo(map);


//以下Leaflet内で呼ばれる関数  そのうちfinc.jsに記述
map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());
  //layer_PT.getNum(coords, point);

  layergroup.getActiveLayer().getNum(coords, point);
});
var playback = function(){

  //for( key in baseMaps ) {
  //  if( baseMaps.hasOwnProperty(key) ) {
      //baseMaps[key].switchLayer("t", 1);
      layergroup.getActiveLayer().switchLayer("t", 1);
      $("#slider_t").slider("value",layergroup.getActiveLayer().activeT);
      //baseMaps[key].redraw();
      layergroup.getActiveLayer().redraw();
  //  }
//  }
//  $("#slider_t").slider("value",layergroup.getActiveLayer().activeT);
  //  console.log("11");
  //console.log($("#slider_t"));
}
var playback_dim = function(){
  /*for( key in baseMaps ) {
    if( baseMaps.hasOwnProperty(key) ) {

      baseMaps[key].switchLayer("h", 1);
      $("#slider_h").slider("value", layergroup.getActiveLayer().activeZ);
      baseMaps[key].redraw();
    }
  }*/
  layergroup.getActiveLayer().switchLayer("d", 1);
  $("#slider_h").slider("value",layergroup.getActiveLayer().activeD);
  //baseMaps[key].redraw();
  layergroup.getActiveLayer().redraw();
}
/*
var rewind = function(){
  active = layer_PT.switchLayer("t", -1);
  layer_PT.redraw();
  $("#slider_t").slider("value", active);
}
*/

var testTimer, play = 0;
function startTimer(dim){
  //console.trace();
  if(dim=="t"){
    testTimer=setInterval(playback,1000);
  }else{
    testTimer=setInterval(playback_dim,1000);
  }
}

function stopTimer(){
  clearInterval(testTimer);
}

map.on('move', function(e){
  drawText(layergroup.getActiveLayer());
});
map.on('keypress', function(e){
  var active;
  /*アクティブレイヤ切り替え*/
  if(e.originalEvent.key === "w"){
    active = layer_PT.switchLayer("h", 1);
    //layer_PT.redraw();
    $("#slider").slider("value", active);
  }
  if(e.originalEvent.key === "s"){
    active = layer_PT.switchLayer("h", -1);
    //layer_PT.redraw();
    $("#slider").slider("value", active);
  }

  if(e.originalEvent.key === "d"){
    playback();
  }
  if(e.originalEvent.key === "a"){
    rewind();
  }

  if(e.originalEvent.key === "h"){
    startTimer();
    play = 1;
  }

  if(e.originalEvent.key === "j"){
    stopTimer();
    play = 0;
  }

  /*レイヤー切り替え*/
  if(e.originalEvent.key === "1"){
  　　activeLayer++
     if(activeLayer <= layer.length){
       activeLayer = 0;
     }
     layer[activeLayer].bringToFront();
  }

  /*カラーマップの範囲設定*/
  if(e.originalEvent.key === "r"){
      updateClrmapRange(layer_PT);
      //layer_PT.redraw();
  }

  if(e.originalEvent.key === "c"){
      var input = get2digitsNum( window.prompt('colormap') );
      try{

        layer_PT._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
      //layer_PT.redraw();
  }

  if(e.originalEvent.key === "a"){

  }
  layergroup.getActiveLayer().redraw();
  //console.log($(".leaflet-control-layers-selector"));
  //console.log($("input[name='leaflet-base-layers']:checked").val());
  drawText(layergroup.getActiveLayer());
});
