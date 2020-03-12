L.GridLayer.VectorNumData = L.GridLayer.extend({
  initialize: function(url1, url2, options){
    this.activeT = 0;
    this.activeD = 0;
    this._url = new Array(2);
    L.Util.setOptions(this, options);
    this._imgRootDir1 = url1;
    this._imgRootDir2 = url2;
    this.switchLayer("t",0);
    this.switchLayer("d",0);
    this.options.shade=true

    //Z=0のタイル座標の生成
    var coords  = new L.Point(0, 0);
    coords.z = 0;

    //インスタンス変数定義
//    this.getInitRange(coords);
//    this._colormap = clrmap_04;
    this._cnt = 0;
  },
  switchLayer : function(dim, num){
    if(dim == "d"){
      this.activeD += num;
      if(this.activeD < 0){
        this.activeD = this.options.dir_d.length-1;
      }else if(this.activeD >= this.options.dir_d.length){
        this.activeD = 0;
      }
      this._url[0] = `${this._imgRootDir1}/${this.options.dir_t[this.activeT]}/${this.options.dir_d[this.activeD]}`;
      this._url[1] = `${this._imgRootDir2}/${this.options.dir_t[this.activeT]}/${this.options.dir_d[this.activeD]}`;
      return this.activeD;
    }else if(dim == "t"){
      this.activeT += num;
      if(this.activeT < 0){
        this.activeT = this.options.dir_t.length-1;
      }else if(this.activeT >=  this.options.dir_t.length){
        this.activeT = 0;
      }
      this._url[0] = `${this._imgRootDir1}/${this.options.dir_t[this.activeT]}/${this.options.dir_d[this.activeD]}`;
      this._url[1] = `${this._imgRootDir2}/${this.options.dir_t[this.activeT]}/${this.options.dir_d[this.activeD]}`;
      return this.activeT;
    }
  },
  /*
  getInitRange: function(coords){
   this.max = -1000000;
   this.min =  1000000;
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
       imgData = ctx.getImageData(0, 0, size.x, size.y);
       rgba = imgData.data;
       num = self._getNumData(rgba);
       for(var i = 0; i < size.y * size.x; i++){
         if(num[i] > self.max){
           self.max = num[i];
         }
         else if(num[i] < self.min){
           self.min = num[i];
         }
       }
       alert(self.min);
     }
     alert("init");
   },
   */
  Loader : function(expectedCnt, callback){
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
    }
    return numData;
  },
  /*
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
  */
  /*
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
   */
  /*getNum: function(coords, point){
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
        alert( num[0].toPrecision(5) );
    }
  },*/
  /*tileにrgbaデータを元に描画*/
  _draw: function(tile, rgba1, rgba2){
    //console.log(rgba1);
    //console.log(rgba2);
    var size, tile, imgData, idx, i, j, k;
    var x,y;
    var num = new Array(2);
    var mean = new Array(2);
    var vector_dens = this.options.dens;  //矢印をイトルのタイルに縦横何コ描画するか
    var vector_size = this.options.size;  //矢印の描画サイズ倍率(仮)
    var vector_intv_x, vector_intv_y;
    size = this.getTileSize();
    ctx = tile.getContext('2d');

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "bold 9px 'Arial'";
    vector_intv_x = size.x / vector_dens;
    vector_intv_y = size.y / vector_dens;

    num[0] = this._getNumData(rgba1);//U
    num[1] = this._getNumData(rgba2);//V
    //実数値から塗りつぶす色決定しイメージデータを書き換
    var a =0
    for(i = 0; i < size.y; i += vector_intv_y){
      //console.log(size);
      for(j = 0; j < size.x; j += vector_intv_x){
        //console.log(j);
        mean[0] = 0;
        mean[1] = 0;
        for(k = i; k < i + vector_intv_y; k++){
          for(l = j; l < j + vector_intv_x; l++){//console.log(`( ${j}, ${k} )`);}
            mean[0] += num[0][ k * size.y + l ];
            mean[1] += num[1][ k * size.y + l ];
            a++;
          }

          //console.log(`( ${mean[0]}, ${mean[1]} )`);
          //ctx.moveTo( l, k ) ;
          //ctx.lineTo( l + mean[0]*100, l + mean[1]*100 );
          //ctx.stroke() ;
        }
        mean[0] /= (vector_intv_x * vector_intv_y);
        mean[1] /= (vector_intv_x * vector_intv_y);
        //mean[0] = Math.round(mean[0] * 10) / 10;
        //mean[1] = Math.round(mean[1] * 10) / 10;//小数点第2位を四捨五入
        ctx.beginPath();
        x = j+vector_intv_x*0.5;
        y = i+vector_intv_y*0.5;
        ctx.arrow(x, y, x + mean[0]*vector_size, y - mean[1]*vector_size , [0, 1, -5, 1, -10, 5]);
        ctx.fill();

        //ctx.fillText(`${mean[0]}, ${mean[1]}`, x, y);
      }
    }
    if(this.options.isGrid == true){
      ctx.strokeRect(0, 0, size.x, size.y);
    }
  },
  Loader: function(expectedCnt, callback){
    var cnt = 0;
    return function(){if(++cnt == expectedCnt){ callback(); }}
  },

  /*タイル生成*/
  createTile: function (coords) {
    var size, self;
    var tile, ctx, num, i;
    var d_tile = new Array(2);
    var d_ctx = new Array(2);
    var img = new Array(2);
    var d_imgData = new Array(2);
    var rgba = new Array(2);

    self = this;
    size = this.getTileSize();

    tile = L.DomUtil.create('canvas', 'leaflet-tile');
    tile.width = size.x;
    tile.height = size.y;
    ctx = tile.getContext('2d');

    for(i = 0; i < 2; i++){
      img[i] = new Image();
      img[i].src = `${this._url[i]}/${coords.z}/${coords.x}/${coords.y}.png`;
      d_tile[i] = L.DomUtil.create('canvas', 'leaflet-tile');
      d_tile[i].width = size.x;
      d_tile[i].height = size.y;
      d_ctx[i] = d_tile[i].getContext('2d');
    }
    var loader = this.Loader(2, function(){
      for(i = 0; i < 2; i++){
        d_ctx[i].drawImage(img[i], 0, 0);
        d_imgData[i] = d_ctx[i].getImageData(0, 0, size.x, size.y);
        rgba[i] = d_imgData[i].data;
      }
      self._draw(tile, rgba[0], rgba[1]);
    });
    img[0].onload = loader;
    img[1].onload = loader;
    // create a <canvas> element for drawing
    return tile;
  }
});


L.gridLayer.vectorNumData = function(url1, url2, opts) {
  return new L.GridLayer.VectorNumData(url1, url2, opts);
};
