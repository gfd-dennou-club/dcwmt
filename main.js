/*各種変数定義*/
let buf = new ArrayBuffer(4);       //32bitのバッファ用意
let data_view = new DataView(buf);  //用意したバッファにDataViewクラスを介して入出力
let min, max;                 //カラーマップの最大、最小、各色の差
let new_crs_simple

new_crs_simple = new L.Proj.CRS('ESRI:53009', '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs', {
  resolutions: [65536, 32768, 16384, 8192, 4096, 2048],
  wrapLng: [0,  tile_size_x],
  wrapLat: [0, -tile_size_y]
});

// if(typeof continuous !== 'undefined' && continuous){
//   new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
//     wrapLng: [0,  tile_size_x],
//     wrapLat: [0, -tile_size_y]
//   });
// }else{
//   new_crs_simple = L.Util.extend({}, L.CRS.Simple, {
//     wrapLng: [0, tile_size_y]
//   });
// }

let map = L.map('map',{
  center: [0, 0],
  crs:new_crs_simple,
  maxZoom: max_zoom,
  minZoom: 0,
  zoom: 0,
});

let layer=[];
let layer_vec=[];
let baseMaps = {};
let overlayMaps = {};

// 物理量を参照する
for(let i = 0; i < value_name.length; i++){
  layer[i] = L.gridLayer.numData(
    // 物理量ディレクトリまでのpath
    `${dir_root}/${value_name[i]}`,
    // 
    {
      tileSize : new L.Point(tile_size_x, tile_size_y),//タイルの大きさを定義 new L.Point(横の解像度, 縦の解像度),
      nameOfTimeDir         : dir_time,
      nameOfDimentionDir    : dir_dim
    }
  );

  eval("baseMaps." + value_name[i]+ "=layer[i];");
  eval("overlayMaps." + value_name[i]+ "=layer[i];");
}
//baseMaps.PTemp = layer[0];
//baseMaps.VelX = layer[1];
for(let i = 0; i < value_name_vec.length; i+=2){
  layer_vec[i/2] = L.gridLayer.vectorNumData(
    `${dir_root}/${value_name_vec[i+0]}`, // 
    `${dir_root}/${value_name_vec[i+1]}`,
    {
      tileSize : new L.Point(tile_size_x, tile_size_y),//タイルの大きさを定義 new L.Point(横の解像度, 縦の解像度),
      dir_t    : dir_time,
      dir_d    : dir_dim,
      size : 6, //矢印の長さ倍率
      dens : 8
    }
  );
  //eval("baseMaps." + value_name_vec[i+0] + "=layer_vec[i/2];");
  eval("overlayMaps.vec_"+ value_name_vec[i+0] +""+value_name_vec[i+1]+ "=layer_vec[i/2];");
}
let layergroup = L.layerCtl(baseMaps, overlayMaps);
layergroup.addTo(map);

L.geoJson(countries, {
  style: {
      color: '#000',
      weight: 0.5,
      opacity: 1,
      fillColor: '#fff',
      fillOpacity: 1
  }
}).addTo(map);

L.latlngGraticule({
  showLabel: true,
  lngLineCurved: 2
}).addTo(map);

map.fitWorld();

//以下Leaflet内で呼ばれる関数  そのうちfinc.jsに記述
map.on('click', function(e){
  let coords = lonlatToCoords(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());
  let point  = lonlatToTlPoint(e.latlng.lat, e.latlng.lng, layergroup.getActiveLayer());

  layergroup.getActiveLayer().getNum(coords, point);
});
let playback = function(){
      layergroup.getActiveLayer().switchLayer("t", 1);
      $("#slider_t").slider("value",layergroup.getActiveLayer().activeT);
      layergroup.getActiveLayer().redraw();
}
let playback_dim = function(){
  layergroup.getActiveLayer().switchLayer("d", 1);
  $("#slider_h").slider("value",layergroup.getActiveLayer().activeD);
  layergroup.getActiveLayer().redraw();
}

let testTimer, play = 0;
function startTimer(dim){
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
  let active;
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
  }

  if(e.originalEvent.key === "c"){
      let input = get2digitsNum( window.prompt('colormap') );
      try{

        layer_PT._colormap = eval( "clrmap_"+input );
      }catch{
        console.log("無効な値が入力されました");
      }
  }

  if(e.originalEvent.key === "a"){

  }
  layergroup.getActiveLayer().redraw();
  drawText(layergroup.getActiveLayer());
});
