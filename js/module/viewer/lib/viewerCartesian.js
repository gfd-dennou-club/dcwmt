const viewerCartesian = (map, diagram) => {
    let CounterData = L.GridLayer.extend({
        options:{
            _scalarData: new Float32Array(),                        // 数値シミュレーションデータから読み取ったデータ
            _min: new Number(),                                     // スカラーデータの最小値
            _max: new Number(),                                     // スカラーデータの最大値
            coords: {x: 0, y: 0, z: 0},                             // タイルを参照するための座標
            colormap: clrmap_04,                                    // カラーマップ
        },
    
        initialize: function(options){
            L.GridLayer.prototype.initialize.call(this, options);   // 継承元のコンストラクタを呼び出し
            L.Util.setOptions(this, options);                       // 引数で渡されたプロパティを代入
        },
    
        createTile: function(coords){
            const canvas = L.DomUtil.create('canvas', 'dcwmt-tile');
            [canvas.width, canvas.height] = diagram.isCounter([256, 256], [320, 320]);

            const counterFunc = () => {
                const url = `${this.options.scalar_layer_of_dir}/${coords.z}/${coords.x}/${coords.y}.png`;
                const isLevel0 = coords.z === 0;
                diagram.url2canvas(url, canvas, isLevel0);
            }

            const vectorFunc = () => {
                const url = this.options.vector_layer_of_dir.map( v => `${v}/${coords.z}/${coords.x}/${coords.y}.png` );
                diagram.urls2canvas(url, canvas);
            }
            
            diagram.isCounter(counterFunc, vectorFunc)();

            return canvas;
        },
    });
    
    // DCWMT.layer.scalarData: function(options: Object)    ->  Object
    // ファクトリ関数
    let counterData = function(options){
        return new CounterData(options);
    }

    const view  = L.map(
        map,
        {
            preferCanvas: true, // Canvasレンダラーを選択
            center:     [0, 0],
            crs:        L.CRS.Simple,
            maxZoom:    2,
            minZoom:    0,
            zoom:       0,
        }
    )

    // レイヤをまとめておく変数を用意
    let layers = new L.control.layers();

    // 物理量を元にベースレイヤとオーバレイレイヤを作成, 変数に追加
    //[TODO]: ディレクトリの受け渡しが決め打ちになっている. 時間と高さを変更できるように拡張すべし.
    const counter_layer = counterData(
        { 
            scalar_layer_of_dir: "../tile/Ps/time=32112",
            vector_layer_of_dir: [
                "../tile/VelX/1.4002e+06/z=47200",
                "../tile/VelY/1.4002e+06/z=51000"
            ],
        }
    );
    layers.addBaseLayer(counter_layer, "Ps");
    layers.addOverlay(counter_layer, "Ps");
   
    // mapにレイヤを追加
    counter_layer.addTo(view);
}