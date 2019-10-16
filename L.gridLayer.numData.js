L.GridLayer.NumData = L.GridLayer.extend({
  initialize: function(url, options){
    this._url = url;
    L.Util.setOptions(this, options);
    var coords  = new L.Point(0, 0);
    coords.z = 0;
    this.getInitRange(coords);
    this._colormap = clrmap_04;
    this._cnt =0;
  },
  getInitRange: function(coords){
   this.max = -1000000;
   this.min =  1000000;
   this._mean = []
   var imgData, rgba, num = [];
   var size, self, canvas, ctx, imgData, rgba, pxNum;
   var mean;
   size = this.getTileSize();
   self = this;
   canvas = document.createElement('canvas');
   canvas.setAttribute('width', size.x); //canvasの大きさ定義
   canvas.setAttribute('height', size.y);
   ctx = canvas.getContext('2d');
   var img = new Image();
   img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
   img.onload = function(){
       ctx.drawImage(img, 0, 0);
       imgData = ctx.getImageData(0, 0, size.x, size.y);
       rgba = imgData.data;
       //console.log(rgba);
       num = self._getNumData(rgba);
       if(self.options.operation == "eddy" || self.options.operation == "eddy_y" || self.options.operation == "eddy_x"){
         this._mean = self._getMean(num);
         num = self._getNumDataDiff(num);
         //console.log(mean);
       }
       //console.log(num);
       for(var i = 0; i < size.y * size.x; i++){
         if(num[i] > self.max){
           self.max = num[i];
         }
         else if(num[i] < self.min){
           self.min = num[i];
         }
      }
      //alert(self.min);
      drawText(self);
    }
     //alert("init");
  },
  _getMean : function(num){
    //var mean = [];
    var i,x,y,size;
    size = this.getTileSize();

    if(this.options.operation == "eddy"){
      this._mean = 0;

        for(var i = 0; i < size.y * size.x; i++){
            this._mean += num[i];
        }
        this._mean /= size.y * size.x;
        //console.log(this._mean);
    }else if(this.options.operation == "eddy_y"){
      for(i = 0; i < size.x; i++){    //配列の初期化
        this._mean[i] = 0;
      }

      for(y = 0; y < size.y; y++){
        for(x = 0; x < size.x; x++){
            this._mean[y] += num[y*size.x+x];
        }
        this._mean[y] /= size.x;
      }
    }else if(this.options.operation == "eddy_x"){
      for(i = 0; i < size.y; i++){  //配列の初期化
        this._mean[i] = 0;
      }
    //  console.log(mean);
      for(x = 0; x < size.x; x ++){
        for(y = 0; y < size.y; y++){
          this._mean[x] += num[y*size.x+x];
          if(x == 0){
            //console.log(y*size.x+x);
          }
        }
        this._mean[x] /= size.y;
      }
      //console.log(mean[1]);
    }else{
      alert("Error");
    }
    //console.log(mean)
  },
  _getNumDataDiff : function(num){
    var size, i;
    size = this.getTileSize();
    //console.log(this._mean);
    //console.log(num);
    for(var i = 0; i < size.y * size.x; i++){
      if(this.options.operation == "eddy"){
        num[i] = num[i] - this._mean;
      }else if(this.options.operation == "eddy_y"){
        num[i] = num[i] - this._mean[i%size.x];
      }else if(this.options.operation == "eddy_x"){
        num[i] = num[i] - this._mean[i%size.x];
        this._cnt++;
        //if(this._cnt<100)console.log(i%size.x);
      }else{
        alert("Error");
      }
    }
    //console.log(num);
    return num;
  },
  _loader : function(expectedCnt, callback){
    var cnt = 0;
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
      if(this.options.operation == "log10"){
        numData[i] = Math.log10(numData[i]);
      }
      if(this.options.operation == "sqrt"){
        numData[i] = Math.sqrt(numData[i]);
      }

    }
    return numData;
  },
  _getColor: function(value) {
    //console.log(this.max);

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
    //console.log("a");
    return {r:255, g:255, b:255, a:255};
  },
   /*_draw: function(rgba){
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
   },*/
  getNum: function(coords, point){
    var imgData, rgba, num;
    var size, self, canvas, ctx, imgData, rgba, pxNum;
    size = this.getTileSize();
    self = this;
    canvas = document.createElement('canvas');
    canvas.setAttribute('width', size.x); //canvasの大きさ定義
    canvas.setAttribute('height', size.y);
    ctx = canvas.getContext('2d');
    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = function(){
        ctx.drawImage(img, 0, 0);
        imgData = ctx.getImageData(point.x, point.y, 1, 1);
        rgba = imgData.data;
        num = self._getNumData(rgba);
        if(self.options.operation == "eddy" || self.options.operation == "eddy_y" || self.options.operation == "eddy_x"){
          num = self._getNumDataDiff(num);
          //console.log(mean);
        }
        alert( num[0].toPrecision(5) );
    }
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
  /*tileにrgbaデータを元に描画*/
  _draw: function(tile, rgba){
    var size, tile, num, imgData, idx;
    size = this.getTileSize();
    ctx = tile.getContext('2d');
    imgData = ctx.getImageData(0, 0, size.x, size.y);

    num = this._getNumData(rgba);
    if(this.options.operation == "eddy" || this.options.operation == "eddy_y" || this.options.operation == "eddy_x"){
      num = this._getNumDataDiff(num);
      //console.log(mean);
    }

    if( this.options.shade ){
      //実数値から塗りつぶす色決定しイメージデータを書き換
      for(var i = 0; i < size.y * size.x; i++){
         idx = i * 4;
         color = this._getColor(num[i]); //数値に対して色を決める
         imgData.data[idx + 3] = 255;
         imgData.data[idx    ] = color.r;
         imgData.data[idx + 1] = color.g;
         imgData.data[idx + 2] = color.b;
       }
       if(0){
         for(var y = 0; y < size.y; y+=2){
           for(var x = 0; x < size.x; x+=2){
             color = this._getColor(num[i]);
             imgData.data[idx    ] = color.r;
             imgData.data[idx + 4] = color.r;
             imgData.data[idx + 1] = color.g;
             imgData.data[idx + 2] = color.b;
           }
         }
       }

     }
     if( this.options.contour ){
      imgData.data = this._drawContour(num, imgData.data);
     }
     ctx.putImageData(imgData, 0, 0);
     if(this.options.isGrid){
       ctx.strokeRect(0, 0, size.x, size.y);
     }
  },

  /*タイル生成*/
  createTile: function (coords) {
    var size, self;
    var tile, ctx, d_tile, d_ctx, img, num;

    self = this;
    size = this.getTileSize();

    tile = L.DomUtil.create('canvas', 'leaflet-tile');
    tile.width = size.x;
    tile.height = size.y;
    ctx = tile.getContext('2d');

    d_tile = L.DomUtil.create('canvas', 'leaflet-tile');
    d_tile.width = size.x;
    d_tile.height = size.y;
    d_ctx = d_tile.getContext('2d');

    img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    img.onload = function(){
      d_ctx.drawImage(img, 0, 0);
      d_imgData = d_ctx.getImageData(0, 0, size.x, size.y);
      rgba = d_imgData.data;
      self._draw(tile, rgba);
    }
    // create a <canvas> element for drawing
    return tile;
  }
});


L.gridLayer.numData = function(url, opts) {
  return new L.GridLayer.NumData(url, opts);
};
