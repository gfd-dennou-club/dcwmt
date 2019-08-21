L.GridLayer.View = L.GridLayer.extend({
  /*コンストラクタ*/
  initialize: function (options) {
		L.Util.setOptions(this, options);
    var coords  = new L.Point(0, 0);
    coords.z = 0;
    this.getInitRange(coords);
    this._colormap = clrmap_04;
	},
  /*最初に一度だけ実行　タイル内の最大・最小値を取得*/
  getInitRange: function(coords){
    this.max = -10000000;
    this.min =  10000000;
    var tileSize = this.getTileSize();
    var tile;
    var d_ctx, v_ctx;
    var d_imgData, v_imgData;
    var numData;  //sizeX * sizeY 個の配列
    var sum_w = [], sum_h = [];
    this._ave_w = [], this._ave_h = [];

    for(var i =0; i< 240; i++){
      sum_w[i]=0;
      sum_h[i]=0;
    }

    /*canvasエレメントからコンテキストを取得*/
    d_ctx = this._getNumDataTileCtx(coords);
    /*コンテキストからタイルのイメージデータを取得*/
    d_imgData = d_ctx.getImageData(0,0,tileSize.x,tileSize.y);
    /*イメージデータ（数値データタイルの）から実数値を取得*/
    numData = this._getNumData(d_imgData.data);
    /*全ピクセル値を調べて最大・最小値を求める*/
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      //sum_w[ parseInt(i/tileSize.y) ] += numData[i];
      //sum_h[ parseInt(i%tileSize.x) ] += numData[i];
      if(this.options.operation == "log10"){
        if(Math.log10(numData[i]) > this.max){
          this.max = Math.log10(numData[i]);
        }
        else if(Math.log10(numData[i]) < this.min){
          this.min = Math.log10(numData[i]);
        }
      }else if(this.options.operation == "sqrt"){
        if(Math.sqrt(numData[i]) > this.max){
          this.max = Math.sqrt(numData[i]);
        }
        else if(Math.sqrt(numData[i]) < this.min){
          this.min = Math.sqrt(numData[i]);
        }
      }else{
        if(numData[i] > this.max){
          this.max = numData[i];
        }
        else if(numData[i] < this.min){
          this.min = numData[i];
        }
      }
    }
    /*for(var i = 0; i < sum_w.length; i++){
        this._ave_w[i] = sum_w[i] / tileSize.x;
    }
    for(var i = 0; i < sum_h.length; i++){
        this._ave_h[i] = sum_h[i] / tileSize.y;
    }*/
    /*
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      if(numData[i] - this._ave_w[i] > this.max){
        this.max = numData[i] - this._ave_w[i];
      }
      else if(numData[i] - this._ave_w[i] < this.min){
        this.min = numData[i] - this._ave_w[i];
      }
    }*/
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
  _getNumData: function(rgba){
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
  _drawContour: function(numData, color_array){
    var tileSize = this.getTileSize();
    var idx;
    var numData_sub = [];
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      numData_sub[i] = Math.floor(numData[i]/10);
    }
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      idx = i * 4;
      if((i + 1)%tileSize.x == 0 || i/tileSize.y >= tileSize.y-1 ){
        continue;
      }
      if(numData_sub[i] !== numData_sub[i+1] || numData_sub[i] !== numData_sub[i+tileSize.x] || numData_sub[i] !== numData_sub[i+tileSize.x+1]){
        color_array[idx    ] = 0;
        color_array[idx + 1] = 0;
        color_array[idx + 2] = 0;
        color_array[idx + 3] = 255;
      }
    }
    return color_array;
  },
  /*数値データレイヤからcanvasコンテキストを取得*/
  _getNumDataTileCtx: function(coords){
    var numDataLayer = this.options.dtLayerObj;  //データレイヤのインスタンス
    var key = numDataLayer._tileCoordsToKey(coords);
    //なんかよく分からないが先にviewが読み込まれる時があるので、その時は強制的にタイルを取得(無駄にcreateTile()を実行する)
    try{
      var el = numDataLayer._tiles[key].el;
    }catch(e){
      var el = numDataLayer.createTile(coords);
    }
    return el.getContext('2d');
  },
  /*引数: coords  戻り値: タイル*/
  createTile: function (coords) {
    var tile;
    var d_ctx, v_ctx;
    var d_imgData, v_imgData;
    var numData;  //sizeX * sizeY 個の配列
    var color;
    var tileSize = this.getTileSize();
    var idx;

    /*canvasエレメント生成*/
    tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x);
    tile.setAttribute('height', tileSize.y);
    /*canvasエレメントからコンテキストを取得*/
    d_ctx = this._getNumDataTileCtx(coords);
    v_ctx = tile.getContext('2d');
    /*コンテキストからタイルのイメージデータを取得*/
    d_imgData = d_ctx.getImageData(0,0,tileSize.x,tileSize.y);
    v_imgData = v_ctx.getImageData(0,0,tileSize.x,tileSize.y);
    /*イメージデータ（数値データタイルの）から実数値を取得*/
    numData = this._getNumData(d_imgData.data);
    /*実数値から塗りつぶす色決定しイメージデータを書き換え*/
    for(var i = 0; i < tileSize.y * tileSize.x; i++){
      idx = i * 4;
      v_imgData.data[idx + 3] = 255;
      if(this.options.shade){
        v_imgData.data[idx    ] = 255;
        v_imgData.data[idx + 1] = 255;
        v_imgData.data[idx + 2] = 255;
      }else{
        v_imgData.data[idx + 3] = 0;
      }
      if(this.options.operation == "log10"){
        color = this._getColor(Math.log10(numData[i])); //数値に対して色を決める
      }else if(this.options.operation == "sqrt"){
        color = this._getColor(Math.sqrt(numData[i])); //数値に対して色を決める
      }else{
        color = this._getColor(numData[i]); //数値に対して色を決める
      }
      v_imgData.data[idx    ] = color.r;
      v_imgData.data[idx + 1] = color.g;
      v_imgData.data[idx + 2] = color.b;

    }
    /*等高線描画*/
    if(this.options.contour){
      v_imgData.data = this._drawContour(numData, v_imgData.data);
    }
    /*canvasにイメージデータを貼り付ける*/
    v_ctx.putImageData(v_imgData, 0, 0);
    /*タイルの縁を描く*/
    if(this.options.isGrid){
      v_ctx.strokeRect(0, 0, tileSize.x, tileSize.y);
    }
    /*タイル座標をかく*/
    /*v_ctx.font = "20px 'ＭＳ ゴ20ク'";
    v_ctx.fillText("z = "+coords.z+", x = "+coords.x+", y = "+coords.y+"",5,15);*/
    return tile;
  },
  /*引数 : coords , 戻り値 : canvasオブジェクト*/
  getCanvasElement: function(coords){
    var key = this._tileCoordsToKey(coords);
    try{
      return this._tiles[key].el;
    }catch(e){
      console.log("key : "+key);
    }
  }
});

L.gridLayer.view = function(opts) {
  return new L.GridLayer.View(opts);
};
