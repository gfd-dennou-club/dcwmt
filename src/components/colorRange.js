// class name:  DCWMT.Module.ColorRange
// role:        シミュレーションデータのカラーレンジに関するクラス
// propaty:     options: {}                          ->  クラス内の共有変数を定義群
//              initialize: function()               ->  コンストラクタ
//              onAdd: function()                    ->  カラーレンジの描画(必ず呼ばれる関数)
//
//              _drawPhysicalQuantity: function()    ->  物理量を描画
//              _drawMinMax: function()              ->  最大値と最小値を描画
//              _drawTriangle: function()            ->  カラーレンジの左右にある三角形の描画
//              _drawRect: function()                ->  カラーバーの描画

DCWMT.Modlue.ColorRange = DCWMT.Modlue.extend({
    // options: {}
    // クラス内の共有変数を定義群
    options: {
        size: {},           // size: { x: Int, y: Int }             ->  カラーレンジの一色分の幅
        start_pos: {},      // start_pos: { x: Int, y: Int }        ->  カラーレンジを書き始める座標 
        range_index: {},    // range_index: { min: Int, max: Int }  ->  レンジの添字 
    },

    // initialize: function(viewLayer: Object) -> void
    // コンストラクタ
    initialize: function(options){
        L.Util.setOptions(this, options);                                                           // 引数で渡されたオブションをこのクラスにも追加
        DCWMT.Control.prototype.initialize.call(this, options);                                     // 継承元のコンストラクタを呼ぶ

        this.options.size.x = 3;                                                                    // カラーレンジの一色分の幅を定義
        this.options.start_pos = 100;                                                               // カラーレンジを書き始める座標xを定義

        this.options.range_index.min = 0;                                                           // レンジの添字の最小値
        this.options.range_index.max = DCWMT.Layer.ScalarData.prototype.options.colormap.length;    // レンジの添字の最大値
    },

    // draw: function(viewLayer: Object) -> void
    // カラーレンジの描画 
    onAdd: function(map){
        // カラーレンジを描画するキャンバスを作成
        const colorRange = L.DomUtil.create('canvas', 'dcwmt-colorRange');
        // コンテキストを取得
        let ctx = colorRange.getContext('2d');
        
        // this._drawPhysicalQuantity(ctx);   // 物理量(t, h, opasity)の表示
        // this._drawMinMax(ctx);             // 最小値, 最大値の表示

        // this._drawTriangle("left");     // 範囲外の左側の三角形の描画
        // this._drawRect();               // カラーバーの描画
        // this._drawTriangle("right");    // 範囲外の右側の三角形の描画
        ctx.font = "bold 16px 'Arial'";
        ctx.fillText("aa", 0, 0);

        return colorRange;
    },

    // _drawPhysicalQuantity: function(ctx: Object) -> void
    // 物理量(h, t, opacity)を表示する関数
    _drawPhysicalQuantity: function(ctx){
        ctx.font = "bold 16px 'Arial'";
        ctx.fillText(" "+layergroup.active.name+"  (opacity : "+viewLayer.options.opacity+")", 120, window.innerHeight-20);
        ctx.fillText(" "+viewLayer.optionss.dir_d[viewLayer.activeD]+"", 380, window.innerHeight-35);
        ctx.fillText(" "+viewLayer.optionss.dir_t[viewLayer.activeT]+"", 380, window.innerHeight-10);
    },

    // _drawMinMax: function(viewLayer: Obhject) -> void
    // カラーレンジの最小値と最大値を表示する関数
    _drawMinMax: function(ctx){
        ctx.fillStyle = `rgb(0, 0, 0)`;
        ctx.fillText(viewLayer.min.toPrecision(5),this.options.start.x-40, window.innerHeight-25);
        ctx.fillText(viewLayer.max.toPrecision(5),this.options.start.x+this.options.size.x*this.options.range_index.max-50, window.innerHeight-25);
    },

    // _drawTriangle: function(position: String) -> void
    // カラーレンジの左右にある三角形を描画するための関数
    _drawTriangle: function(ctx, position){
        switch(position){
            case "left":
                // 三角形を描くためのパスを決定
                ctx.beginPath();
                ctx.moveTo(this.options.start.x,window.innerHeight-70);      //1番目の点の場所
                ctx.lineTo(this.options.start.x,window.innerHeight-40);      //2番目の点の場所
                ctx.lineTo(this.options.start.x-15,window.innerHeight-55);   //3番目の点の場所
                ctx.closePath();

                // 描画(線をなぞる -> 塗り潰し)
                ctx.fillStyle = `rgb(0, 0, 0)`;
                ctx.stroke();
                ctx.fillStyle = `rgb(${viewLayer._colormap[0].r},${viewLayer._colormap[0].g},${viewLayer._colormap[0].b})`;
                ctx.fill();
                break;
            case "right":
                // 三角形を描くためのパスを決定
                ctx.beginPath();
                ctx.moveTo(this.options.start.x+size.x*this.options.range_index.max,window.innerHeight-70);                  //1番目の点の場所
                ctx.lineTo(this.options.start.x+this.options.size.x*this.options.range_index.max,window.innerHeight-40);      //2番目の点の場所
                ctx.lineTo(this.options.start.x+this.options.size.x*this.options.range_index.max+15,window.innerHeight-55);   //3番目の点の場所
                ctx.closePath();
                
                // 描画(線をなぞる -> 塗り潰し)
                ctx.fillStyle = `rgb(0, 0, 0)`;
                ctx.stroke();
                ctx.fillStyle = `rgb(${viewLayer._colormap[this.options.range_index.max-1].r},${viewLayer._colormap[this.options.range_index.max-1].g},${viewLayer._colormap[this.options.range_index.max-1].b})`;
                ctx.fill();
                break;
        }
    },

    // _drawRect: function(viewLayer: Object) -> void
    // カラーバーの描画を行う関数
    _drawRect: function(ctx){
        for(let i = this.options.range_index.max; i < this.options.range_index.max; i++){
            // 描画(線でなぞる -> 塗り潰し)
            ctx.fillStyle = `rgb(0, 0, 0)`;
            ctx.strokeRect(this.options.start.x+this.options.size.x*i, window.innerHeight-70, this.options.size.x, 30);
            // コンター図の場合は全て白色にする
            if(viewLayer.optionss.contour)  { ctx.fillStyle = `rgb(255, 255, 255)`; }
            else                            { ctx.fillStyle = `rgb(${viewLayer._colormap[i].r},${viewLayer._colormap[i].g},${viewLayer._colormap[i].b})`; }
            ctx.fillRect(this.options.start.x+this.options.size.x*i, window.innerHeight-70, this.options.size.x, 30);
        }
    },
});

// DCWMT.control.colorRange: function(viewLayer: object, options: Object)    ->  Object
// ファクトリ関数
DCWMT.control.colorRange = function(options){
    return new DCWMT.Control.ColorRange(options);
}