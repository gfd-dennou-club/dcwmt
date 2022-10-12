const LayerCartesian = L.GridLayer.extend({
    options:{
        coords: {x: 0, y: 0, z: 0},                             // タイルを参照するための座標
    },

    initialize: function(options){
        L.GridLayer.prototype.initialize.call(this, options);   // 継承元のコンストラクタを呼び出し
        L.Util.setOptions(this, options);                       // 引数で渡されたプロパティを代入
    },

    createTile: function(coords){
        const canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [this.options.size.X, this.options.size.Y];
        const url = this.options.url.map(v => v.concat(`/${coords.z}/${coords.x}/${coords.y}.png`));

        const toneFunc = () => {
            this.options.diagram.url2canvas(url[0], canvas);
        }

        const vectorFunc = () => {
            this.options.diagram.urls2canvas(url, canvas);
        }
        
        this.options.diagram.isTone(toneFunc, vectorFunc)();

        return canvas;
    },

    getName: function(){ return this.options.name; },
});

const layerCartesian = function(options){
    return new LayerCartesian(options);
}