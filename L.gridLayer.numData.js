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
    this.max = -10000000;
    this.min =  10000000;
    var tileSize = this.getTileSize();
    var tile;
    var d_ctx, v_ctx;
    var d_imgData, v_imgData;
    var numData;  //sizeX * sizeY 個の配列
    var sum_w = [], sum_h = [];
    var self = this;
    this._ave_w = [], this._ave_h = [];

    for(var i = 0; i < 240; i++){
      sum_w[i]=0;
      sum_h[i]=0;
    }

    var numDataTile = document.createElement('canvas');
    numDataTile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    numDataTile.setAttribute('height', tileSize.y);
    var d_ctx = numDataTile.getContext('2d');

    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = function(){
      d_ctx.drawImage(img, 0, 0, tileSize.x, tileSize.y);//canvasオブジェクトの左上から画像を貼り付け
      d_imgData = d_ctx.getImageData(0, 0, tileSize.x, tileSize.y);
      numData = self._rgbToNumData(d_imgData.data);
      for(var i = 0; i < tileSize.y * tileSize.x; i++){
        //sum_w[ parseInt(i/tileSize.y) ] += numData[i];
        //sum_h[ parseInt(i%tileSize.x) ] += numData[i];
        if(self.options.operation == "log10"){
          if(Math.log10(numData[i]) > self.max){
            self.max = Math.log10(numData[i]);
          }
          else if(Math.log10(numData[i]) < self.min){
            self.min = Math.log10(numData[i]);
          }
        }else if(self.options.operation == "sqrt"){
          if(Math.sqrt(numData[i]) > self.max){
            self.max = Math.sqrt(numData[i]);
          }
          else if(Math.sqrt(numData[i]) < self.min){
            self.min = Math.sqrt(numData[i]);
          }
        }else{
          if(numData[i] > self.max){
            self.max = numData[i];
          }
          else if(numData[i] < self.min){
            self.min = numData[i];
          }
        }
      }
    }
  },
  /*引数 : ピクセル値, 戻り値 : RGBAの格納されたオブジェクト*/
  _getColor: function(value) {
    var diff = (this.max - this.min) / (this._colormap.length - 2);
    if( value === 0.0000000000 ){     //読み込み失敗タイルは白く塗りつぶす
      return {r:255, g:255, b:255, a:255};
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
  _rgbToNumData: function(rgba){
    var tileSize = this.getTileSize();
    var numData = [];
    var idx;
    var r,g,b;
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
  /*タイル生成*/
  createTile: function (coords) {
    var tileSize = this.getTileSize();
    tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    tile.setAttribute('height', tileSize.y);
    var ctx = tile.getContext('2d');

    var self = this;

    /*canvasインスタンス初期化*/
    var numData = document.createElement('canvas');
    numData.setAttribute('width', tileSize.x); //canvasの大きさ定義
    numData.setAttribute('height', tileSize.y);
    var d_ctx = numData.getContext('2d');

    /*canvasインスタンスにベースタイル描画*/
    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = function(){
      d_ctx.drawImage(img, 0, 0);//canvasオブジェクトの左上から画像を貼り付け
      d_imgData = d_ctx.getImageData(0,0,tileSize.x,tileSize.y);
      imgData = ctx.getImageData(0,0,tileSize.x,tileSize.y);

      num = self._rgbToNumData(d_imgData.data);
      /*実数値から塗りつぶす色決定しイメージデータを書き換え*/
      for(var i = 0; i < tileSize.y * tileSize.x; i++){
        idx = i * 4;
        imgData.data[idx + 3] = 255;
        if(self.options.shade){
          imgData.data[idx    ] = 255;
          imgData.data[idx + 1] = 255;
          imgData.data[idx + 2] = 255;
        }else{
          imgData.data[idx + 3] = 0;
        }
        if(self.options.operation == "log10"){
          color = self._getColor(Math.log10(num[i])); //数値に対して色を決める
        }else if(self.options.operation == "sqrt"){
          color = self._getColor(Math.sqrt(num[i])); //数値に対して色を決める
        }else{
          color = self._getColor(num[i]); //数値に対して色を決める
        }
        imgData.data[idx    ] = color.r;
        imgData.data[idx + 1] = color.g;
        imgData.data[idx + 2] = color.b;

      }
      /*等高線描画*/
      if(self.options.contour){
        imgData.data = self._drawContour(num, imgData.data);
      }
      /*canvasにイメージデータを貼り付ける*/
      ctx.putImageData(imgData, 0, 0);
      /*タイルの縁を描く*/
      if(self.options.isGrid){
        ctx.strokeRect(0, 0, tileSize.x, tileSize.y);
      }
      /*タイル座標をかく*/
      /*ctx.font = "20px 'ＭＳ ゴ20ク'";
      ctx.fillText("z = "+coords.z+", x = "+coords.x+", y = "+coords.y+"",5,15);*/
      //return tile;
    }
    return tile;
  },
  /*引数 : coords , 戻り値 : canvasオブジェクト*/
  getCanvasElement: function(coords, point){
    var tileSize = this.getTileSize();
    tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    tile.setAttribute('height', tileSize.y);
    var ctx = tile.getContext('2d');
    var self = this;
    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = function(){
      ctx.drawImage(img, 0, 0);//canvasオブジェクトの左上から画像を貼り付け
    }
    return tile;
  }
});

L.gridLayer.numData = function(url, opts) {
  return new L.GridLayer.NumData(url, opts);
};
