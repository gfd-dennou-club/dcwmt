window.onload = function(){
    const CoordinateSystem = class{
        constructor(name){
            this.name = name;
        }

        view(){
            // 既にマップが存在するのであれば, html要素を消しておく
            if(document.getElementById("map") !== null)
                document.getElementById("map").remove();

            // div要素のmain-screenの中にmapを作成
            const mainDiv = document.getElementById("main-screen");
            const map = document.createElement("div");
            map.setAttribute("id", "map");
            mainDiv.appendChild(map);

            switch(this.name){
                case "Cesium":
                    const defined = Cesium.defined;                 // Cesium.defined:          オブジェクトが定義されていたら真を返して, そうでなければ偽を返す関数
                    const when = Cesium.when;                       // Cesium.when:             非同期処理を実現するための関数
                    const DeveloperError = Cesium.DeveloperError;   // Cesium.DeveloperError:   開発者のエラーが原因でスローされる例外オブジェクトを作成する関数
                                
                    // イメージプロバイダに対する独自の処理を実装するためのインスタンス
                    let imageryProviderHooks = {};
                                
                    // @method: addRecolorFunc(imageryProvider: 画像を参照を行うインスタンス, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 取得した画像から絵を描き直した画像(キャンバス)
                    // 数値データタイルを復元するための関数をインスタンス変数に追加
                    imageryProviderHooks.addRecolorFunc = (imageryProvider, recolorFunc) => {
                        // @method: imageProvider.requestImage(x,y: 座標, level: 高度, request: リクエストオブジェクト) => HTMLImageElement: 読み込んだ画像 | undefined
                        // 与えられるタイルに対するイメージを要求するメソッド
                        imageryProvider.base_requestImage = imageryProvider.requestImage;   // 画像のオブジェクトを指定して, 画像を返してもらうハンドラのバックアップをとる
                        imageryProvider.recolorFunc = recolorFunc;                          // 引数により与えられたハンドラをimageProviderのハンドラとして登録
                        // requestImageメソッドを上書き
                        imageryProvider.requestImage = (x, y, level) => {
                            // 読み込んだ画像(HTMLCanvasElement)を変数に保存
                            const imagePromise = imageryProvider.base_requestImage(x, y, level);
                            // 読み込んだ画像がundefinedだった場合, それをそのまま返す.
                            if(!defined(imagePromise)){ return imagePromise; } 
                            // 画像の読み込みを終了したら...
                            return when(imagePromise, image => {
                                if(defined(image)){ // imageオブジェクトがundefinedでなければ...
                                    const context = getCanvasContext(imageryProvider, image);                             // 画像のコンテキストを取得
                                    image = recolorImageWithCanvasContext(context, image, imageryProvider.recolorFunc);   // 数値データを可視化した画像に変換
                                }
                                return image; // 変換した画像を返す
                            })
                        }
                    };
                    
                    // @method: visualizeImage(image: 元画像データ, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 数値データに復元された画像
                    // 画像に対して色を塗っていく関数
                    imageryProviderHooks.visualizeImage = (image, recolorFunc) => {
                        const lendth = image.data.length;                                                       // イメージデータより配列の長さを取得
                        let min = undefined, max = undefined;                                                   // 最小値と最大値を保存しておくための変数を用意
                        let red, green, blue;
                        let dataView = new DataView(new ArrayBuffer(32));                                       // 32bit値を保存しておく変数
                        let scalarData = new Array();
                    
                        for(let i = 0; i < lendth; i++){
                            const bias_rgb_index = i*4;
                            red     = image.data[bias_rgb_index     ] << 24;
                            green   = image.data[bias_rgb_index + 1 ] << 16;
                            blue    = image.data[bias_rgb_index + 2 ] << 8;
                        
                            dataView.setUint32(0, red + green + blue);
                            scalarData[i] = dataView.getFloat32(0);

                            if(i == 0)
                                min = max = scalarData[i];
                            else{
                                if(min >= scalarData[i]) min = scalarData[i];
                                if(max <= scalarData[i]) max = scalarData[i];
                            }
                        }

                        // 色を塗り替えてゆく
                        for(let i = 0; i < lendth; i++){
                            const bias_rgb_index = i*4;
                            const rgb = recolorFunc(scalarData[i], min, max);
                            image.data[bias_rgb_index    ] = rgb.r;
                            image.data[bias_rgb_index + 1] = rgb.g;
                            image.data[bias_rgb_index + 2] = rgb.b;
                            image.data[bias_rgb_index + 3] = 255;
                        }
                        
                        return image;
                    };
                    
                    // @method: getCanvasContext(imageryProvider: 画像の参照を行うインスタンス, image: 読み込んだ画像) => context: 読み込んだ画像のコンテキスト
                    // 読み込んだ画像のコンテキストを取得するための関数
                    const getCanvasContext = (imageryProvider, image) => { 
                        let canvas = document.createElement("canvas");                  // キャンバス要素を作成
                        [canvas.width, canvas.height] = [image.width, image.height];    // 画像の大きさにキャンバスを合わせる
                        const context = canvas.getContext("2d");                        // コンテキストを取得
                        imageryProvider._canvas2dContext = context;                     // イメージプロバイダーのインスタンス変数に今作成したコンテキストを格納
                    
                        return context;
                    }
                    
                    // @method: recolorImageWithCanvasContext(context: 画像のコンテキスト, image: 読み込んだ画像, recolorFunc) => img: 数値データを復元した画像
                    // 画像を取得し, 色を塗り替えてゆく関数？(書き方が変)
                    const recolorImageWithCanvasContext = (context, image, recolorFunc) => {
                        // 引数により与えられたcontextがundefinedだった場合...
                        // エラーを投げる
                        if(!defined(context)){ throw new DeveloperError('No context for image recoloring'); }
                    
                        context.clearRect(0, 0, context.canvas.width, context.canvas.height);                   // コンテキストの初期化
                        context.drawImage(image, 0, 0);                                                         // 読み込んだ画像の描画
                        let img = context.getImageData(0, 0, context.canvas.width, context.canvas.height);      // 読み込んだ画像の各画素の値を取得
                        img = imageryProviderHooks.visualizeImage(img, recolorFunc);                            // 各画素の値を元に数値データを復元する
                        return img;
                    }
                    
                    // @method: addPickFeaturesHook(imagetyProvider: 画像を参照を行うインスタンス, hook: ？) => featurePromise: プロミス(特徴)
                    // おそらくタイル内のデータを取得する際に使用するメソッドだと思われる. (マウスでクリックしたら物理量取得のようなことをする感じ)
                    imageryProviderHooks.addPickFeaturesHook = (imageryProvider, hook) => {
                        // @method: pickFeatures(x, y: 座標, level: 高度, longitude, latitude: 緯度経度) => featurePromise: プロミス(特徴)
                        // タイル内の特定の緯度経度に特徴？がある場合は, 非同期的に決定します?? (どういうこと？)
                        imageryProvider.base_pickFeatures = imageryProvider.pickFeatures;
                        // pickFeaturesメソッドを上書き
                        imageryProvider.pickFeatures = (x, y, level, longitude, latitude) => {
                            // 特徴を含んだプロミスを取得
                            const featurePromise = this.base_pickFeatures(x, y, level, longitude, latitude);
                            // undefinedだった場合...
                            if(!deined(featurePromise)) { return featurePromise;                }
                            // オブジェクトが存在した場合は, 引数で受け取ったホックを実行し, その返り値を含んだプロミスを返す
                            else                        { return featurePromise.then(hook);     }
                        }
                    }
                    
                    // 表示領域のインスタンスを作成
                    // プロパティはとりあえず指定しない
                    let custom_imageryProdiver = new Cesium.UrlTemplateImageryProvider({
                        url: "../tile/Ps/time=32112/{z}/{x}/{y}.png",
                        tileHeight: 256,
                        tileWidth: 256,
                        maximumLevel: 2,
                        mimimumLevel: 0,
                    });

                    const recolorFunc = (data, min, max) => {
                       // カラーマップの配列の要素値を作成(以下の比の計算)
                        // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
                        const colormap_per_scalardata = clrmap_04.length / (max - min);
                        const colormap_index = parseInt(colormap_per_scalardata * (data - min));
                    
                        // 読み込み失敗時は白を返す
                        if(data === 0.0000000000)   { return {r:255, g:255, b:255}; }
                    
                        if(clrmap_04.length <= colormap_index)             { return clrmap_04[clrmap_04.length - 1]; }
                        else if (0 >= colormap_index)                      { return clrmap_04[0]; }
                        else                                               { return clrmap_04[colormap_index]; }                          // それ以外は対応する色を返す
                    }
                    
                    imageryProviderHooks.addRecolorFunc(custom_imageryProdiver, recolorFunc);

                    const viewer = new Cesium.Viewer(
                        map, 
                        {   // 表示するhtml要素
                            // 画像参照を行うインスタンを設定
                            imageryProvider: custom_imageryProdiver,
                            baseLayerPicker: false,
                            requestRenderMode: true,
                            masximumRenderTimeChange: Infinity,
                            timeline : false,
                            animation : false,
                            homeButton: false,
                            vrButton: false,
                            geocoder:false,
                            sceneModePicker:false,
                            navigationHelpButton:false,
                            fullscreenButton: false,
                            skyBox: false,
                            skyAtmosphere: false,
                        }
                    );

                    // ひとまず背景を白色にしておく
                    viewer.scene.backgroundColor = Cesium.Color.WHITE;

                    // 大気を消すことで球体の周りの奇妙な光を消す
                    viewer.scene.globe.showGroundAtmosphere = false;
                    break;
                case "Leaflet":
                    map.setAttribute("style", "height: 500px;");
                    let ScalarData = L.GridLayer.extend({
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
                            [tile.width, tile.height] = [256, 256];
                    
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
                                scalarData = new Array();                                                           // Float32を保管しておく配
                            
                            for(let i = 0; i < tile.width * tile.height; i++){
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

                            self.options.context = tile.getContext('2d');
                        },
                    
                        _draw: function(tile){
                            let ctx = tile.getContext('2d');
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
                    
                            // 読み込み失敗時は白を返す
                            if(data === 0.0000000000)   { return {r:0, g:255, b:255, a:255}; }
                    
                            if(this.options.colormap.length <= colormap_index) { return this.options.colormap[this.options.colormap.length - 1]; }
                            else if (0 > colormap_index)                       { return this.options.colormap[0]; }
                            else                                               { return this.options.colormap[colormap_index]; }                          // それ以外は対応する色を返す
                        },
                    });
                    
                    // DCWMT.layer.scalarData: function(options: Object)    ->  Object
                    // ファクトリ関数
                    let scalarData = function(options){
                        return new ScalarData(options);
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
                    const scalar_layer = scalarData(
                        { 
                            scalar_layer_of_dir: "../tile/Ps/time=32112",
                        }
                    );
                    layers.addBaseLayer(scalar_layer, "Ps");
                    layers.addOverlay(scalar_layer, "Ps");
                   
                    // mapにレイヤを追加
                    scalar_layer.addTo(view);
                    break;
                    case "OpenLayers":
                        map.setAttribute("style", "height: 500px; width: 100%;");
                        const olMap = new ol.Map({
                            target: map,
                            layers: [
                                new ol.layer.Tile({
                                    source: new ol.source.XYZ({
                                        url: `${DEFINE.ROOT}/Ps/time=32112/{z}/{x}/{y}.png`,
                                        tileLoadFunction: (imageTile, src) => {
                                            const canvas = document.createElement("canvas");
                                            [canvas.width, canvas.height] = [256, 256];
                                            const img = new Image();
                                            const onload = new Promise((resolve, reject) => {
                                                img.src = src;
                                                resolve(img)
                                            })
                                            
                                            onload.then(
                                                value => {
                                                    const redraw = new Promise((resolve, reject) => {
                                                        const context = canvas.getContext('2d');
                                                        context.drawImage(value, 0, 0);
                                                        const img = context.getImageData(0, 0, canvas.width, canvas.height);
                                                        const rgba = img.data;
                                                        let min, max;
                                                        let red, green, blue;
                                                        let dataView = new DataView(new ArrayBuffer(32));
                                                        let scalarData = new Array();

                                                        for(let i = 0; i < canvas.height * canvas.width; i++){
                                                            const bias_rgb_index = i*4;
                                                            red =   rgba[bias_rgb_index    ]  << 24;
                                                            green = rgba[bias_rgb_index + 1]  << 16;
                                                            blue =  rgba[bias_rgb_index + 2]  << 8;
                                                        
                                                            dataView.setUint32(0, red + green + blue);
                                                            scalarData[i] = dataView.getFloat32(0);
                                                        
                                                            if(i === 0)
                                                                min = max = scalarData[i];
                                                            else{
                                                                if(min > scalarData[i]) min = scalarData[i];
                                                                if(max < scalarData[i]) max = scalarData[i];
                                                            }
                                                        }
                                                    
                                                        for(let i = 0; i < canvas.height * canvas.width; i++){
                                                            const bias_rgb_index = i*4;
                                                            const colormap_per_scalardata = clrmap_04.length / (max - min);
                                                            const colormap_index = parseInt(colormap_per_scalardata * (scalarData[i] - min));
                                                            let rgb;
                                                        
                                                            if(scalarData[i] === 0.0000000000)          { rgb = {r:255, g:255, b:255}; }
                                                            else if(clrmap_04.length <= colormap_index) { rgb = clrmap_04[clrmap_04.length - 1]; }
                                                            else if(0 >= colormap_index)                { rgb = clrmap_04[0]; }
                                                            else                                        { rgb = clrmap_04[colormap_index]; } 
                                                        
                                                            img.data[bias_rgb_index  ] = rgb.r;
                                                            img.data[bias_rgb_index+1] = rgb.g;
                                                            img.data[bias_rgb_index+2] = rgb.b;
                                                            img.data[bias_rgb_index+3] = 255;
                                                        }

                                                        context.putImageData(img, 0, 0);

                                                        resolve(canvas);
                                                    })

                                                    redraw.then(
                                                        canvas => {
                                                            imageTile.getImage().src = canvas.toDataURL("image/png");
                                                        },
                                                        reason => {console.error(reason)}
                                                    );
                                                },
                                                reason => { console.error(reason); }
                                            )
                                        }
                                    })
                                })
                            ],
                            view: new ol.View({
                                center: [-472202, 7530279],
                                zoom: 2,
                            })
                        })
                        break;
            }
            return true;
        }   
    }

    let viewModel = {
        coordinate_systems: [
            new CoordinateSystem("Cesium"),
            new CoordinateSystem("Leaflet"),
            new CoordinateSystem("OpenLayers"),
        ],     // 座標系の種類
        selectedCoordinate: null,   // 選択されている表系
    }

    const selecter = document.getElementById("selecter");
    ko.applyBindings(viewModel, selecter);
}