L.GridLayer.NumData = L.GridLayer.extend({
  initialize: function(url, options){
    this._url = url;
    L.Util.setOptions(this, options);
    var coords  = new L.Point(0, 0);
    coords.z = 0;
  },
  /*タイル生成*/
  createTile: function (coords) {
    var tileSize = this.getTileSize();
    tile = document.createElement('canvas');
    tile.setAttribute('width', tileSize.x); //canvasの大きさ定義
    tile.setAttribute('height', tileSize.y);
    var ctx = tile.getContext('2d');
    /*canvasインスタンスにベースタイル描画*/
    var img = new Image();
    img.src = `${this._url}${coords.z}/${coords.x}/${coords.y}.png`;
    ctx.drawImage(img, 0, 0);//canvasオブジェクトの左上から画像を貼り付け
    return tile;
  }
});


L.gridLayer.numData = function(url, opts) {
  return new L.GridLayer.NumData(url, opts);
};
