// class name:  DCWMT.Control.Scaling
// role:        シミュレーションデータの目盛りに関するクラス
// propaty:     options: {}          ->  クラス内の共有変数群
//              initialize: function()    ->  コンストラクター
//              draw: function()    ->  目盛りの描画

DCWMT.Control.Scaling = DCWMT.Control.extend({
    // options: {}
    // クラス内の共有関数を定義群
    options: {
        ctx: undefined,         // context
        axisNum: 4,             // axisNum: Int                     ->  タイルの一辺に軸をかく本数 (2のべき乗でなければ問題が発生するもよう)
        tile_size: undefined,   // tile_size: { x: Int, y: Int }    ->  タイルサイズ
        offset: {},             // offset: { x: Int, y: Int}        ->  
        disrance: {},           // distance: { x: Int, y: Int}      ->             
    },

    // initialize: function()
    initialize: function() {

    },

    draw: function() {
        ctx.fillStyle = `rgb(25, 0, 0)`;
        var axisNum = 4;//各タイルの一辺に軸をかく本数(2のべき乗じゃないとバグる)
        var size = viewLayer.getTileSize();
        var offset_x = scale_x[0];
        var distance_x = scale_x[1];
        var offset_y = scale_y[0];
        var distance_y = scale_y[1];
        var unit = "m";
        ctx.font = "12px 'Arial'";			//フォント指定
        ctx.fillStyle = "rgb(0,0,0)";		//色指定
            var delta_x_axis = size.x/(2**map.getZoom())/axisNum;//ブラウザ上において何ピクセル毎によこ軸を描くか
            var delta_y_axis = size.y/(2**map.getZoom())/axisNum;//ブラウザ上において何ピクセル毎にたて軸を描くか
            //var t = ctx.fillRect(0,window.innerHeight-100,1000,1000);

        ///////////////draw X axis//////////////
        for(var i = getGoodPlace_X(delta_x_axis);i<Math.floor(bounds.getEast());i+=delta_x_axis){
            ctx.fillRect(2**map.getZoom()*(i-bounds.getWest())-1+100, window.innerHeight-100, 1, 5);//x軸のめもり表示
            var num = Math.abs(i % size.x);
            if(i<0 && num!=0){num = size.x - num;}
            ctx.fillText(offset_x+num*distance_x/size.x+"("+unit+")",2**map.getZoom()*(i-bounds.getWest())-5+100,window.innerHeight-80);//x軸の値表示
        }
        ///////////////draw Y axis///////////////
        for(var i = getGoodPlace_Y(delta_y_axis);i<Math.floor(bounds.getNorth());i+=delta_y_axis){
            ctx.fillRect(90, 2**map.getZoom()*(-i+bounds.getNorth())-1+50, 10, 2);//y軸のめもり表示
            var num = Math.abs(i % size.y);
            if(i<0 && num!=0){num = size.y - num;}
            ctx.fillText(offset_y+num*distance_y/size.y+"("+unit+")", 55, 2**map.getZoom()*(-i+bounds.getNorth())-5+50);//x軸の値表示  55は左端からの幅
        }
    }
});
