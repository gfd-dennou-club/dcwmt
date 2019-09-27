/*各種関数を記述*/

/*カラーマップレンジ変更*/
function updateClrmapRange(viewLayer){
  /*var tmp_min = Math.floor( window.prompt('最小値') );
  var tmp_max = Math.ceil ( window.prompt('最大値') );*/
  var tmp_min = Number(window.prompt('最小値'));
  var tmp_max = Number(window.prompt('最大値'));
  if( tmp_min < tmp_max){ //不正な値・文字列が入った場合に更新しないようにする
    viewLayer.min = tmp_min;
    viewLayer.max = tmp_max;
  }
}
/*指定したレイヤの緯度経度をZ-X-Yに変換する
引数(latitude[緯度], longitude[経度], gridlayerのインスタンス)  戻り値 引数のcoords*/
function lonlatToCoords(lat, lon, layer){
  var coords  = new L.Point(0, 0); //クリックされた場所のタイルcoords(z/x/y)
  var tileSize = layer.getTileSize();
  var z = layer._tileZoom;	//ズームレベル
  var division = 2 ** z; //一辺のタイル分割数
  var dividedSize = {x: tileSize.x / division,
                     y: tileSize.y / division}; //タイルの大きさを分割数で割った値
  //coords計算
  if( lon >= 0 ){
    coords.x = parseInt( lon / dividedSize.x % division);
  }else{
    coords.x = parseInt( -lon / dividedSize.x % division );
    coords.x = division - coords.x - 1;
  }
  if( lat >= 0){
    coords.y = parseInt( lat / dividedSize.y % division);
    coords.y = division - coords.y - 1;
  }else{
    coords.y = parseInt( -lat / dividedSize.y % division);
  }
  coords.z = z;
  /*console.log(`${lat}/${dividedSize.x}`);
  console.log(coords);*/
  return coords;
}
/*緯度経度をタイル内座標に変換する
引数(latitude[緯度], longitude[経度], gridlayerのインスタンス)  戻り値 タイル内座標*/
function lonlatToTlPoint(lat, lon, layer){
  var clTlPoint = new L.Point(0, 0); //CrickTilePoint : クリックされた場所のタイル内座標
  var tileSize = layer.getTileSize();
  var z =layer._tileZoom;	//ズームレベル
  var tlOneSide = 2 ** z; //一辺のタイル分割数
  //ClockTilePoint計算
  clTlPoint.x = lon < 0 ? (       lon  * tlOneSide % tileSize.x + tileSize.x) % tileSize.x :  lon * tlOneSide % tileSize.x;
  clTlPoint.y = lat > 0 ? ((tileSize.y - lat) * tlOneSide % tileSize.y + tileSize.y) % tileSize.y : -lat * tlOneSide % tileSize.y;
  return clTlPoint;
}
/*指定したピクセルにおけるfloat値を返す
引数(canvasオブジェクト, タイル内座標)  戻り値 float数値*/
function getPixelData(canvasElement, point){
  var ctx = canvasElement.getContext('2d');
  //ctx.fillRect(0,0,100,100);///////////////////////////for debug(指定キャンバスが取れるか？)
  var pixelColor = ctx.getImageData(point.x, point.y, 1, 1);
  var buf = new ArrayBuffer(4); //32bitのバッファ用意
  var data_view = new DataView(buf); //用意したバッファにDataViewクラスを介して入出力
  data_view.setUint8(0, pixelColor.data[0]);//R
  data_view.setUint8(1, pixelColor.data[1]);//G
  data_view.setUint8(2, pixelColor.data[2]);//B
  return data_view.getFloat32(0); //float値取得
}
/**/
function compRGB(data, view, point, latlng){
  var ctx_data = data.getContext('2d');
  var ctx_view = view.getContext('2d');
  var pixelColor_data = ctx_data.getImageData(point.x, point.y, 1, 1);
  var pixelColor_view = ctx_view.getImageData(point.x, point.y, 1, 1);
}
/*諸々表示関数(仮)*/
function drawText(viewLayer){
  var canvas = document.getElementById('text');
  canvas.setAttribute("width", window.innerWidth-10);//-10はスクロールバーを考慮
  canvas.setAttribute("height", window.innerHeight-10);//上と同様
	//if( ! canvas || ! canvas.getContext ) { return false; }//canvas要素の存在チェックとCanvas未対応ブラウザの対処
  var ctx_text = canvas.getContext('2d');
  ctx_text.font = "bold 20px 'Arial'";

  ctx_text.fillText("Active : "+viewLayer.options.name+"  (opacity : "+viewLayer.options.opacity+")",10, window.innerHeight-50);
  ctx_text.fillText("Range:["+viewLayer.min+", "+viewLayer.max+"]",10, window.innerHeight-30);
  console.log(viewLayer);
}
/*1->01と表示する関数*/
function get2digitsNum(number){
  return ("0" + number).slice(-2);
}
