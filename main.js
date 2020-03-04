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
  maxZoom: 4,//9以上で表示がおかしくなる?
  minZoom: 0,
  zoom: 0,
});



map.on('click', function(e){
  var coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());
  var point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());
  //layer_PT.getNum(coords, point);
  //layergroup.getActiveLayer().getNum(coords, point);
  console.log(layergroup.getActiveLayer());
  layergroup.getActiveLayer().getNum(coords, point);
});
var playback = function(){
  console.log("dd");
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
  layergroup.getActiveLayer().switchLayer("h", 1);
  $("#slider_h").slider("value",layergroup.getActiveLayer().activeZ);
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
  drawText(pt);
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
  layer_PT.redraw();
  //console.log($(".leaflet-control-layers-selector"));
  //console.log($("input[name='leaflet-base-layers']:checked").val());
  drawText(pt);
});
