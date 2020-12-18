/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// class name:  DCWMT.Layer.Plane.ScalarData
// role:        トーン図やコンター図を平面上に表示するためのクラス
//
// member:     
//              [public]
//              options: {}                                                         ->  クラス内の共有変数を定義群
//              initialize: function()                                              ->  コンストラクタ
//              createTile: function(coords -> {x: Number, y: Number, z: Number})   ->  表示用のタイルを作成(ファクトリ関数を実行した際に呼ばれる関数)
//
//              [private]
//              _draw: function(tile: Object)                                       ->  シミュレーションデータの描画
//              _loadedImage: function(selft: Object, tile: Object)                 ->  imgオブジェクトで画像を読み終わった際に呼ばれるイベントハンドラー
//              _getColor: function(data: Number)                                   ->  数値データからカラーマップを参照して, 色を選択
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

DCWMT.Layer.Plane.ScalarData = DCWMT.Layer.Plane.extend({
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
        // 数値タイルを描くためのキャンバス要素を作成
        let tile = L.DomUtil.create('canvas', 'dcwmt-tile');
        
        // tileの大きさを取得
        [tile.width, tile.height] = [this.options.tileSize.x, this.options.tileSize.y];

        // 数値データタイルの画像を読み込むためのオブジェクトを用意
        let img = new Image();

        // イベントハンドラーの設定
        const loadedImage = this._loadedImage.bind(img);    // この関数をimgオブジェクトにバインド
        img.onload = () => loadedImage(this, tile);         // 画像がロードし終わったら関数が実行されるように設定
       
        // 読み込み処理を実行
        img.src = `${this.options.scalar_layer_of_dir}/${coords.z}/${coords.x}/${coords.y}.png`;

        return tile;
    },

    _loadedImage: function(self, tile){
        // キャンバスを操作するためにコンテキストを取得
        const ctx = tile.getContext('2d');

        ctx.drawImage(this, 0, 0);                                                              // キャンバス要素に数値データを描画
        const rgba = ctx.getImageData(0, 0, tile.width, tile.height).data;                      // rgbaデータの取得
        
        let red, green, blue,                                                                   // red値, green値, blue値, それぞれの保管用変数
            dataView = new DataView(new ArrayBuffer(32)),                                       // 32bit値を保存しておく変数
            scalarData = new Array();                                                           // Float32を保管しておく配列
        for(let i = 0; i < tile.width*tile.height; i++){
            const bias_rgb_index = i * 4;
            red =   rgba[bias_rgb_index    ]  << 24;
            green = rgba[bias_rgb_index + 1]  << 16;
            blue =  rgba[bias_rgb_index + 2]  << 8;
            
            dataView.setUint32(0, red + green + blue);
            scalarData[i] = dataView.getFloat32(0);

            if(i != 0){
                if(self.options._min >= scalarData[i]){ self.options._min = scalarData[i]; }    // 最小値を求める
                if(self.options._max <= scalarData[i]){ self.options._max = scalarData[i]; }    // 最大値を求める
            }else{ 
                self.options._min = self.options._max = scalarData[i]; 
            }
        }

        self.options._scalarData = scalarData;

        self._draw(tile);
    },

    _draw: function(tile){
        const ctx = tile.getContext('2d');
        let imgData = ctx.getImageData(0, 0, tile.width, tile.height);

        for(let i = 0; i < tile.width * tile.height; i++){
            const bias_rgb_index = i * 4;
            const rgb = this._getColor(this.options._scalarData[i]);
            imgData.data[bias_rgb_index  ] = rgb.r;
            imgData.data[bias_rgb_index+1] = rgb.g;
            imgData.data[bias_rgb_index+2] = rgb.b;
            imgData.data[bias_rgb_index+3] = 255;
        }

        ctx.putImageData(imgData, 0, 0);
    },

    _getColor: function(data){
        // カラーマップの配列の要素値を作成(以下の比の計算)
        // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
        const colormap_per_scalardata = this.options.colormap.length / (this.options._max - this.options._min);
        const colormap_index = parseInt(colormap_per_scalardata * (data - this.options._min));

        if(this.options.colormap.length <= colormap_index) { return this.options.colormap[this.options.colormap.length - 1]; }
        else if (0 > colormap_index)                       { return this.options.colormap[0]; }
        else                                               { return this.options.colormap[colormap_index]; }                          // それ以外は対応する色を返す
    },
});

// DCWMT.layer.scalarData: function(options: Object)    ->  Object
// ファクトリ関数
DCWMT.layer.plane.scalarData = function(options){
    return new DCWMT.Layer.Plane.ScalarData(options);
}