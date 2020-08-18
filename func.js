/*各種関数を記述*/

/*カラーマップレンジ変更*/
function updateClrmapRange(viewLayer){
  let tmp_min = Number(window.prompt('最小値'));
  let tmp_max = Number(window.prompt('最大値'));
  if( tmp_min < tmp_max){ //不正な値・文字列が入った場合に更新しないようにする
    viewLayer.min = tmp_min;
    viewLayer.max = tmp_max;
  }else{
    alert("不正値");
  }
}

function updateClrmapRange_New(viewLayer, max, min){
  if( min < max){ //不正な値・文字列が入った場合に更新しないようにする
    viewLayer.min = min;
    viewLayer.max = max;
  }else{
    alert("不正値");
  }
}
/*指定したレイヤの緯度経度をZ-X-Yに変換する
引数(latitude[緯度], longitude[経度], gridlayerのインスタンス)  戻り値 引数のcoords*/
function lonlatToCoords(lat, lon, layer){
  let coords  = new L.Point(0, 0); //クリックされた場所のタイルcoords(z/x/y)
  let tileSize = layer.getTileSize();
  let z = layer._tileZoom;	//ズームレベル
  let division = 2 ** z; //一辺のタイル分割数
  let dividedSize = {x: tileSize.x / division,
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
  return coords;
}
/*緯度経度をタイル内座標に変換する
引数(latitude[緯度], longitude[経度], gridlayerのインスタンス)  戻り値 タイル内座標*/
function lonlatToTlPoint(lat, lon, layer){
  let clTlPoint = new L.Point(0, 0); //CrickTilePoint : クリックされた場所のタイル内座標
  let tileSize = layer.getTileSize();
  let z =layer._tileZoom;	//ズームレベル
  let tlOneSide = 2 ** z; //一辺のタイル分割数
  //ClockTilePoint計算
  clTlPoint.x = lon < 0 ? ( lon  * tlOneSide % tileSize.x + tileSize.x) % tileSize.x :  lon * tlOneSide % tileSize.x;
  clTlPoint.y = lat > 0 ? ((tileSize.y - lat) * tlOneSide % tileSize.y + tileSize.y) % tileSize.y : -lat * tlOneSide % tileSize.y;
  return clTlPoint;
}
/*指定したピクセルにおけるfloat値を返す
引数(canvasオブジェクト, タイル内座標)  戻り値 float数値*/
function getPixelData(canvasElement, point){
  let ctx = canvasElement.getContext('2d');
  let pixelColor = ctx.getImageData(point.x, point.y, 1, 1);
  let buf = new ArrayBuffer(4); //32bitのバッファ用意
  let data_view = new DataView(buf); //用意したバッファにDataViewクラスを介して入出力
  data_view.setUint8(0, pixelColor.data[0]);//R
  data_view.setUint8(1, pixelColor.data[1]);//G
  data_view.setUint8(2, pixelColor.data[2]);//B
  return data_view.getFloat32(0); //float値取得
}
function compRGB(data, view, point, latlng){
  let ctx_data = data.getContext('2d');
  let ctx_view = view.getContext('2d');
  let pixelColor_data = ctx_data.getImageData(point.x, point.y, 1, 1);
  let pixelColor_view = ctx_view.getImageData(point.x, point.y, 1, 1);
}
//x軸のキリの良い場所を探す関数
function getGoodPlace_X(delta_x_axis){
  let bounds=map.getBounds();
  for(let i = Math.floor(bounds.getWest()); i < Math.floor(bounds.getEast()); i++){
    if(i % (delta_x_axis) === 0){
      return i;
    }
  }
  return -1;
}
//y軸のキリの良い場所を探す関数
function getGoodPlace_Y(delta_y_axis){
  let bounds=map.getBounds();
  for(let i = Math.floor(bounds.getSouth()); i < Math.floor(bounds.getNorth()); i++){
    if(i % delta_y_axis=== 0){
      return i;
    }
  }
  return -1;
}
//諸々表示関数(仮)
function drawText(viewLayer){
  console.log(viewLayer)

  let size = {};
  size.x = 3;//カラーマップの1色の幅
  let start = {};
  start.x = 100;//カラーマップを書き始める座標x
  let canvas = document.getElementById('text');
  let bounds = map.getBounds();
  //canvasのサイズを動的に変更（同時に白紙になる）
  canvas.setAttribute("width", window.innerWidth);//-10はスクロールバーを考慮
  canvas.setAttribute("height", window.innerHeight);//上と同様
  let ctx = canvas.getContext('2d');
  ctx.font = "bold 16px 'Arial'";

  ctx.fillText(" "+viewLayer.options.nameOfDimentionDir[viewLayer.activeD]+"", 380, window.innerHeight-35);
  ctx.fillText(" "+viewLayer.options.nameOfTimeDir[viewLayer.activeT]+"", 380, window.innerHeight-10);

  for(let i = 0; i < viewLayer._colormap.length; i++){
    if(i == 0){
      //最小値表示
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.fillText(viewLayer.min.toPrecision(5),start.x-40, window.innerHeight-25)

      //範囲外の三角形描画
      ctx.beginPath();
      ctx.moveTo(start.x+size.x*i,window.innerHeight-70); //最初の点の場所
      ctx.lineTo(start.x+size.x*i,window.innerHeight-40); //2番目の点の場所
      ctx.lineTo(start.x+size.x*i-15,window.innerHeight-55); //3番目の点の場所

      ctx.closePath();	//三角形の最後の線 closeさせる
      ctx.fillStyle = `rgb(${viewLayer._colormap[i].r},${viewLayer._colormap[i].g},${viewLayer._colormap[i].b})`;
      ctx.fill();
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.stroke();

      //ctx.fillText(viewLayer.min,start.x-40, window.innerHeight-25);
    }else if(i == viewLayer._colormap.length-1){
      //最大値表示
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.fillText(viewLayer.max.toPrecision(5),start.x+size.x*i-50, window.innerHeight-25);
      //ctx.fillText(viewLayer.max,start.x+size.x*i, window.innerHeight-25);

      ctx.beginPath();
      ctx.moveTo(start.x+size.x*i+size.x,window.innerHeight-70); //最初の点の場所
      ctx.lineTo(start.x+size.x*i+size.x,window.innerHeight-40); //2番目の点の場所
      ctx.lineTo(start.x+size.x*i+size.x+15,window.innerHeight-55); //3番目の点の場所

      ctx.closePath();	//三角形の最後の線 closeさせる
      ctx.fillStyle = `rgb(${viewLayer._colormap[i].r},${viewLayer._colormap[i].g},${viewLayer._colormap[i].b})`;
      ctx.fill();
      ctx.fillStyle = `rgb(0, 0, 0)`;
      ctx.stroke();
    }
    ctx.fillStyle = `rgb(${viewLayer._colormap[i].r},${viewLayer._colormap[i].g},${viewLayer._colormap[i].b})`;
    if(viewLayer.options.contour){

      ctx.fillStyle = `rgb(255, 255, 255)`;
    }
    ctx.fillRect(start.x+size.x*i, window.innerHeight-70, size.x, 30);
    ctx.fillStyle = `rgb(0, 0, 0)`;
    ctx.strokeRect(start.x+size.x*i, window.innerHeight-70, size.x, 30);
  }
  ctx.fillStyle = `rgb(25, 0, 0)`;
　

  let axisNum = 4;//各タイルの一辺に軸をかく本数(2のべき乗じゃないとバグる)
  size = viewLayer.getTileSize();
  let offset_x = scale_x[0];
  let distance_x = scale_x[1];
  let offset_y = scale_y[0];
  let distance_y = scale_y[1];
  let unit = "m";
  ctx.font = "12px 'Arial'";			//フォント指定
  ctx.fillStyle = "rgb(0,0,0)";		//色指定
    let delta_x_axis = size.x/(2**map.getZoom())/axisNum;//ブラウザ上において何ピクセル毎によこ軸を描くか
    let delta_y_axis = size.y/(2**map.getZoom())/axisNum;//ブラウザ上において何ピクセル毎にたて軸を描くか

  ///////////////draw X axis//////////////
  for(let i = getGoodPlace_X(delta_x_axis);i<Math.floor(bounds.getEast());i+=delta_x_axis){
    ctx.fillRect(2**map.getZoom()*(i-bounds.getWest())-1+100, window.innerHeight-100, 1, 5);//x軸のめもり表示
    let num = Math.abs(i % size.x);
    if(i<0 && num!=0){num = size.x - num;}
    ctx.fillText(offset_x+num*distance_x/size.x+"("+unit+")",2**map.getZoom()*(i-bounds.getWest())-5+100,window.innerHeight-80);//x軸の値表示
  }
  ///////////////draw Y axis///////////////
  for(let i = getGoodPlace_Y(delta_y_axis);i<Math.floor(bounds.getNorth());i+=delta_y_axis){
    ctx.fillRect(90, 2**map.getZoom()*(-i+bounds.getNorth())-1+50, 10, 2);//y軸のめもり表示
    let num = Math.abs(i % size.y);
    if(i<0 && num!=0){num = size.y - num;}
    ctx.fillText(offset_y+num*distance_y/size.y+"("+unit+")", 55, 2**map.getZoom()*(-i+bounds.getNorth())-5+50);//x軸の値表示  55は左端からの幅
  }

}
/*1->01と表示する関数*/
function get2digitsNum(number){
  return ("0" + number).slice(-2);
}
