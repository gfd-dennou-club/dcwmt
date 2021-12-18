const layerCartesian = L.GridLayer.extend({
    options:{
        coords: {x: 0, y: 0, z: 0},                             // タイルを参照するための座標
    },

    initialize: function(options){
        L.GridLayer.prototype.initialize.call(this, options);   // 継承元のコンストラクタを呼び出し
        L.Util.setOptions(this, options);                       // 引数で渡されたプロパティを代入
    },

    createTile: function(coords){
        const canvas = L.DomUtil.create('canvas', 'dcwmt-tile');
        [canvas.width, canvas.height] = [option.size.X, option.size.Y];

        const counterFunc = () => {
            option.diagram.url2canvas(option.url, canvas);
        }

        const vectorFunc = () => {
            option.diagram.urls2canvas(option.url, canvas);
        }
        
        option.diagram.isCounter(counterFunc, vectorFunc)();

        return canvas;
    },
});