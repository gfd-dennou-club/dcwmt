/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// class name:  DCWMT.Layer.Globe.ScalarData
// role:        トーン図やコンター図を球面上に表示するためのクラス
//
// member:     
//              [public]
//              options: {}                                                                 ->  クラス内の共有変数を定義群
//              constructor: constructor(options: Object)                                   ->  コンストラクタ
//              imageryProvider: function()                                                 ->  メンバ変数 _myImageryProvider　のゲッタ
//
//              [private]
//              _addRecolorFunc: function(imageryProvider: Object, recolorFunc: Function)   ->  imageProviderのrecolorFuncを書き換える
//              _visualizeImage: function(image: HTMLImageElement, recolorFunc: Function)   ->  指定のURLから受け取った画像を塗り替える
//              _addPickFeaturesHook: function(imageryProvider: Object, hook: Object)       ->  PickFeaturesHookを書き換える
//
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

DCWMT.Layer.Globe.ScalarData = class{
    options = {
        _myImageryProdiver: undefined, // 数値データタイルから数値データを取り出し可視化させたレイヤーを作成する
        _imageryProviderHooks: {},     // レイヤーに関するホック
        _zoomLevel: new Number(),
        _min: new Number(),
        _max: new Number(),
        tileSize: {},
    }

    // @cunstructor(options)
    // 数値データタイルを復元する機能を搭載したimageProviderを返す
    constructor(options){
        [this.options.tileSize.x, this.options.tileSize.y] = [options.width, options.height];

        // ホックを定義しておく
        this.options._imageryProviderHooks.addRecolorFunc = this._addRecolorFunc;
        this.options._imageryProviderHooks.visualizeImage = this._visualizeImage;
        this.options._imageryProviderHooks.addPickFeaturesHook = this._addPickFeaturesHook;

        let custom_imageryProdiver = new Cesium.UrlTemplateImageryProvider({
            url: options.url + "{z}/{x}/{y}.png",
            tilingScheme: new Cesium.GeographicTilingScheme({
                numberOfLevelZeroTilesX: 1
            }),
            tileHeight: this.options.tileSize.y,
            tileWidth: this.options.tileSize.x,
            maximumLevel: options.maxZoom,
            mimimumLevel: options.minZoom,
        })

        // let custom_imageryProdiver = new Cesium.OpenStreetMapImageryProvider({
        //     url: options.url,
        //     tileHeight: this.options.tileSize.y,
        //     tileWidth: this.options.tileSize.x,
        //     maximumLevel: options.maxZoom,
        //     mimimumLevel: options.minZoom,
        // });

        this.options._imageryProviderHooks.addRecolorFunc(custom_imageryProdiver, this.recolorFunc);
        this.options._imageryProviderHooks.addPickFeaturesHook(custom_imageryProdiver, this.options.hooks);

        this.options._myImageryProdiver = custom_imageryProdiver;
    }

    // @method: imageProvider() => custom_imageryProdiver: Object
    // クラス変数 custom_imageryProdiver のゲッタ
    imageryProvider = () => {
        return this.options._myImageryProdiver;
    }

    // @method: _addRecolorFunc(imageryProvider: 画像を参照を行うインスタンス, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 取得した画像から絵を描き直した画像(キャンバス)
    // 数値データタイルを復元するための関数をインスタンス変数に追加
    _addRecolorFunc = (imageryProvider, recolorFunc) => {
        imageryProvider.base_requestImage = imageryProvider.requestImage;   // 画像のオブジェクトを指定して, 画像を返してもらうハンドラのバックアップをとる
        imageryProvider.recolorFunc = recolorFunc;                          // 引数により与えられたハンドラをimageProviderのハンドラとして登録
        // requestImageメソッドを上書き
        imageryProvider.requestImage = (x, y, level) => {
            // 読み込んだ画像(HTMLCanvasElement)を変数に保存
            const imagePromise = imageryProvider.base_requestImage(x, y, level);
            // 読み込んだ画像がundefinedだった場合, それをそのまま返す.
            if(!Cesium.defined(imagePromise)){ return imagePromise; } 
            // 画像の読み込みを終了したら...
            return Cesium.when(imagePromise, image => {
                let img;
                if(Cesium.defined(image)){ // imageオブジェクトがundefinedでなければ...
                    const context = this._getCanvasContext(imageryProvider, image);                           // 画像のコンテキストを取得
                    this.options._zoomLevel = level;
                    img = this._recolorImageWithCanvasContext(context, image, imageryProvider.recolorFunc);   // 数値データを可視化した画像に変換
                }
                return img; // 変換した画像を返す
            })
        }
    }

    // @method: _visualizeImage(image: 元画像データ, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 数値データに復元された画像
    // 画像に対して色を塗っていく関数
    _visualizeImage = (image, recolorFunc) => {
        const length = this.options.tileSize.x * this.options.tileSize.y;                       // イメージデータより配列の長さを取得
        let red, green, blue;
        let dataView = new DataView(new ArrayBuffer(32));                                       // 32bit値を保存しておく変数
        let scalarData = new Array();

        // 数値データの復元に加えて, 最大値と最小値を確保
        for(let i = 0; i < length; i++){
            const bias_rgb_index = i * 4;
            red     = image.data[bias_rgb_index     ] << 24;
            green   = image.data[bias_rgb_index + 1 ] << 16;
            blue    = image.data[bias_rgb_index + 2 ] << 8;

            dataView.setUint32(0, red + green + blue);
            scalarData[i] = dataView.getFloat32(0);

            if(this.options._zoomLevel == 0){
                if(i == 0)                                                  { this.options._min = this.options._max = scalarData[i];    }
                else if(this.options._min >= scalarData[i])                 { this.options._min = scalarData[i];          }
                else if(this.options._max <= scalarData[i])                 { this.options._max = scalarData[i];          }
            }
        }

        // クロミウムの場合, タイルが上下反転してしまうという問題があるためそれを対処
        if(useBlowser() === "Chrome"){ 
            let tempAry = new Array();
            for(let x = 0; x < this.options.tileSize.x; x++){
                let colAry = new Array();
                for(let y = 0; y < this.options.tileSize.y; y++){
                    colAry[y] = scalarData[y*this.options.tileSize.x + x];
                }
                colAry.reverse();
                for(let y = 0; y < this.options.tileSize.y; y++){
                    tempAry[y*this.options.tileSize.x + x] = colAry[y];
                }
            }
            scalarData = Array.from(tempAry);
        }

        // 色を塗り替えてゆく
        for(let i = 0; i < length; i++){
            const bias_rgb_index = i * 4;
            const rgb = recolorFunc(scalarData[i]);
            image.data[bias_rgb_index    ] = rgb.r;
            image.data[bias_rgb_index + 1] = rgb.g;
            image.data[bias_rgb_index + 2] = rgb.b;
            image.data[bias_rgb_index + 3] = 255;
        }
        return image;
    }

    // @method: _getCanvasContext(imageryProvider: 画像の参照を行うインスタンス, image: 読み込んだ画像) => context: 読み込んだ画像のコンテキスト
    // 読み込んだ画像のコンテキストを取得するための関数
    _getCanvasContext = (imageryProvider, image) => { 
        let canvas = document.createElement("canvas");                  // キャンバス要素を作成
        [canvas.width, canvas.height] = [image.width, image.height];    // 画像の大きさにキャンバスを合わせる
        let context = canvas.getContext("2d");                        // コンテキストを取得
        imageryProvider._canvas2dContext = context;                     // イメージプロバイダーのインスタンス変数に今作成したコンテキストを格納
       
        return context;
    }

    // @method: _recolorImageWithCanvasContext(context: 画像のコンテキスト, image: 読み込んだ画像, recolorFunc) => img: 数値データを復元した画像
    // 画像を取得し, 色を塗り替えてゆく関数？(書き方が変)
    _recolorImageWithCanvasContext = (context, image, recolorFunc) => {
        // 引数により与えられたcontextがundefinedだった場合...
        // エラーを投げる
        if(!Cesium.defined(context)){ throw new Cesium.DeveloperError('No context for image recoloring'); }
    
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);                   // コンテキストの初期化
        context.drawImage(image, 0, 0);                                                         // 読み込んだ画像の描画
        let img = context.getImageData(0, 0, context.canvas.width, context.canvas.height);      // 読み込んだ画像の各画素の値を取得
        return this.options._imageryProviderHooks.visualizeImage(img, recolorFunc);                            // 各画素の値を元に数値データを復元する
    }

    _addPickFeaturesHook = (imageryProvider, hook) => {
        // @method: pickFeatures(x, y: 座標, level: 高度, longitude, latitude: 緯度経度) => featurePromise: プロミス(特徴)
        // タイル内の特定の緯度経度に特徴？がある場合は, 非同期的に決定します?? (どういうこと？)
        imageryProvider.base_pickFeatures = imageryProvider.pickFeatures;
        // pickFeaturesメソッドを上書き
        imageryProvider.pickFeatures = (x, y, level, longitude, latitude) => {
            // 特徴を含んだプロミスを取得
            const featurePromise = imageryProvider.base_pickFeatures(x, y, level, longitude, latitude);
            console.log("x: " + x + ", y: " + y);
            console.log("level: " + level)
            console.log("lon: " + (longitude * 180.0 / Cesium.Math.PI) + ", lat: " + (latitude* 180.0 / Cesium.Math.PI ))
            // undefinedだった場合...
            if(!Cesium.defined(featurePromise)) { return featurePromise;                }
            // オブジェクトが存在した場合は, 引数で受け取ったホックを実行し, その返り値を含んだプロミスを返す
            else                                { return featurePromise.then(hook);     }
        }
    }

    recolorFunc = (data) => {
        // カラーマップの配列の要素値を作成(以下の比の計算)
        // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
        const colormap_per_scalardata = clrmap_04.length / (this.options._max - this.options._min);
        const colormap_index = parseInt(colormap_per_scalardata * (data - this.options._min));
     
        if(colormap_index >= clrmap_04.length)             { return clrmap_04[clrmap_04.length - 1]; }
        else if (colormap_index < 0)                       { return clrmap_04[0]; }
        else                                               { return clrmap_04[colormap_index]; }                          // それ以外は対応する色を返す
     }
}

// DCWMT.layer.Globe.scalarData: function(options: Object)    ->  Object
// ファクトリ関数
DCWMT.layer.globe.scalarData = function(options){
    return new DCWMT.Layer.Globe.ScalarData(options);
}