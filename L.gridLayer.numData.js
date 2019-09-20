L.GridLayer.NumData = L.GridLayer.extend({
  initialize: function(url, options){
    this._url = url;
    L.Util.setOptions(this, options);
    var coords  = new L.Point(0, 0);
    coords.z = 0;
    this.getInitRange(coords);
    this._colormap = clrmap_04;
  },
  getInitRange: function(coords){
   this.max =  240;
   this.min =  235;
 },
  _loader : function(expectedCnt, callback){
   var cnt = 0;
   console.log("b");
   return function(){
     if(++cnt == expectedCnt){ callback(); }
   }
 },
 _getNumData: function(rgba){
  var tileSize = this.getTileSize();
  var numData = [];
  var idx;
  var r,g,b;

  //console.log(rgba);
  for(var i = 0; i < tileSize.y * tileSize.x; i++){
    idx = i * 4;

    r = rgba[idx] << 24;
    g = rgba[idx + 1] << 16;
    b = rgba[idx + 2] <<  8;
    data_view.setUint32(0, r+g+b);
    numData[i] = data_view.getFloat32(0);
  }
  return numData;
},
_getColor: function(value) {
  var diff = (this.max - this.min) / (this._colormap.length - 2);
  if( value === 0.0000000000 ){     //読み込み失敗タイルは白く塗りつぶす
    return {r:0, g:255, b:255, a:255};
  }else if(value <= this.min){           //最小値以下
    return this._colormap[0];
  }else if(value > this.max){            //最大値より大
    return this._colormap[this._colormap.length - 1];
  }else{                            //最小値より大 & 最大値以下
    for(var i = 1; i < this._colormap.length - 1; i++){
      if(value > this.min + (i-1) * diff && value <= this.min + i * diff){
        return this._colormap[i];
      }
    }
  }
  return {r:255, g:255, b:255, a:255};
},
 _draw: function(rgba){
   var tile, size, ctx, num;
   tile = L.DomUtil.create('canvas', 'leaflet-tile');
   // setup tile width and height according to the options
   size = this.getTileSize();
   tile.width = size.x;
   tile.height = size.y;
   ctx = tile.getContext('2d');
   imgData = ctx.getImageData(0, 0, size.x, size.y);
   num = this._getNumData(rgba);
   //実数値から塗りつぶす色決定しイメージデータを書き換
   for(var i = 0; i < size.y * size.x; i++){
      idx = i * 4;
      color = self._getColor(num[i]); //数値に対して色を決める
      imgData.data[idx + 3] = 255;
      imgData.data[idx    ] = color.r;
      imgData.data[idx + 1] = color.g;
      imgData.data[idx + 2] = color.b;
    }
    ctx.putImageData(imgData, 0, 0);
    return tile;
 },
  getNum: function(coords, point){
    var imgData, rgba, num;
    this._load(coords);
    num = this._getNumData(rgba, point.x, point.y);
    return num;
  },
  _getMinMax(rgba){
    var num;
    num = this._getNumData(rgba);
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      if(numData[i] > this.max){
        this.max = num[i];
      }
      else if(numData[i] < this.min){
        this.min = num[i];
      }
    }
  },
  tmp2: function(){
    ctx.drawImage(img, 0, 0);
    imgData = ctx.getImageData(0, 0, size.x, size.y);
    rgba = imgData.data;
    this._getMinMax(rgba);
  },
  _draw: function(tile, rgba){
    var size, tile, num, imgData, idx;
    size = this.getTileSize();
    ctx = tile.getContext('2d');
    imgData = ctx.getImageData(0, 0, size.x, size.y);
    num = this._getNumData(rgba);


    //実数値から塗りつぶす色決定しイメージデータを書き換
    for(var i = 0; i < size.y * size.x; i++){
       idx = i * 4;
       color = this._getColor(num[i]); //数値に対して色を決める
       imgData.data[idx + 3] = 255;
       imgData.data[idx    ] = color.r;
       imgData.data[idx + 1] = color.g;
       imgData.data[idx + 2] = color.b;
     }
     ctx.putImageData(imgData, 0, 0);
  },
  /*引数のcoordsの数値データタイルを読み込み*/
  _load: function(coords, flag, tile){
    var size, self, canvas, ctx, imgData, rgba;
    size = this.getTileSize();
    self = this;
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', size.x); //canvasの大きさ定義
    canvas.setAttribute('height', size.y);
    ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = this._loader(1, function(){
       ctx.drawImage(img, 0, 0);
       imgData = ctx.getImageData(0, 0, size.x, size.y);
       rgba = imgData.data;
       //console.log(rgba);
       self._draw(tile, rgba);
    });
    img.onload = this._loader(1, function(){
       ctx.drawImage(img, 0, 0);
       imgData = ctx.getImageData(0, 0, size.x, size.y);
       rgba = imgData.data;
       //console.log(rgba);
       self._draw(tile, rgba);
    });
  },
  /*タイル生成*/
  createTile: function (coords) {
    var tile, size, ctx, num;
    tile = L.DomUtil.create('canvas', 'leaflet-tile');
    size = this.getTileSize();
    tile.width = size.x;
    tile.height = size.y;
    ctx = tile.getContext('2d');
    // create a <canvas> element for drawing
    var rgba, tile;
    this._load(coords, tile);
    return tile;
  }
});


L.gridLayer.numData = function(url, opts) {
  return new L.GridLayer.NumData(url, opts);
};
