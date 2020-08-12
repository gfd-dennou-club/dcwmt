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
    let coords  = new L.Point(0, 0);
    coords.z = 0;

    //インスタンス変数定義
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
  Loader : function(expectedCnt, callback){
    let cnt = 0;
    return function(){
      if(++cnt == expectedCnt){ callback(); }
    }
  },
  _getNumData: function(rgba){
    const tileSize = this.getTileSize();
    let numData = [];
    let idx;
    let r,g,b;
    //console.log(rgba);
    for(let i = 0; i < tileSize.y * tileSize.x; i++){
      idx = i * 4;
      r = rgba[idx] << 24;
      g = rgba[idx + 1] << 16;
      b = rgba[idx + 2] <<  8;
      data_view.setUint32(0, r+g+b);
      numData[i] = data_view.getFloat32(0);
    }
    return numData;
  },
  /*tileにrgbaデータを元に描画*/
  _draw: function(tile, rgba1, rgba2){
    const size = this.getTileSize();
    const vector_dens = this.options.dens;  //矢印をイトルのタイルに縦横何コ描画するか
    const vector_size = this.options.size;  //矢印の描画サイズ倍率(仮)
    let x,y;
    let num = new Array(2);
    let mean = new Array(2);
    let vector_intv_x, vector_intv_y;
    let ctx = tile.getContext('2d');

    ctx.strokeStyle = "rgb(0, 0, 0)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.font = "bold 9px 'Arial'";
    vector_intv_x = size.x / vector_dens;
    vector_intv_y = size.y / vector_dens;

    num[0] = this._getNumData(rgba1);//U
    num[1] = this._getNumData(rgba2);//V
    //実数値から塗りつぶす色決定しイメージデータを書き換
    let a =0
    for(let i = 0; i < size.y; i += vector_intv_y){
      for(let j = 0; j < size.x; j += vector_intv_x){
        mean[0] = 0;
        mean[1] = 0;
        for(let k = i; k < i + vector_intv_y; k++){
          for(l = j; l < j + vector_intv_x; l++){
            mean[0] += num[0][ k * size.y + l ];
            mean[1] += num[1][ k * size.y + l ];
            a++;
          }
        }
        mean[0] /= (vector_intv_x * vector_intv_y);
        mean[1] /= (vector_intv_x * vector_intv_y);
        ctx.beginPath();
        x = j+vector_intv_x*0.5;
        y = i+vector_intv_y*0.5;
        ctx.arrow(x, y, x + mean[0]*vector_size, y - mean[1]*vector_size , [0, 1, -5, 1, -10, 5]);
        ctx.fill();
      }
    }
    if(this.options.isGrid == true){
      ctx.strokeRect(0, 0, size.x, size.y);
    }
  },
  Loader: function(expectedCnt, callback){
    let cnt = 0;
    return function(){if(++cnt == expectedCnt){ callback(); }}
  },

  /*タイル生成*/
  createTile: function (coords) {
    const size = this.getTileSize(); // タイルの大きさ
    let tile, ctx;
    let d_tile = new Array(2);
    let d_ctx = new Array(2);
    let img = new Array(2);
    let d_imgData = new Array(2);
    let rgba = new Array(2);

    tile = L.DomUtil.create('canvas', 'leaflet-tile');
    tile.width = size.x;
    tile.height = size.y;
    ctx = tile.getContext('2d');

    for(let i = 0; i < 2; i++){
      img[i] = new Image();
      img[i].src = `${this._url[i]}/${coords.z}/${coords.x}/${coords.y}.png`;
      d_tile[i] = L.DomUtil.create('canvas', 'leaflet-tile');
      d_tile[i].width = size.x;
      d_tile[i].height = size.y;
      d_ctx[i] = d_tile[i].getContext('2d');
    }
    let loader = this.Loader(2, function(){
      for(let i = 0; i < 2; i++){
        d_ctx[i].drawImage(img[i], 0, 0);
        d_imgData[i] = d_ctx[i].getImageData(0, 0, size.x, size.y);
        rgba[i] = d_imgData[i].data;
      }
      this._draw(tile, rgba[0], rgba[1]);
    });
    img[0].onload = loader;
    img[1].onload = loader;
    return tile;
  }
});


L.gridLayer.vectorNumData = function(url1, url2, opts) {
  return new L.GridLayer.VectorNumData(url1, url2, opts);
};
