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
                             
                    // イメージプロバイダに対する独自の処理を実装するためのインスタンス
                    let imageryProviderHooks = {};
                                
                    // @method: addRecolorFunc(imageryProvider: 画像を参照を行うインスタンス, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 取得した画像から絵を描き直した画像(キャンバス)
                    // 数値データタイルを復元するための関数をインスタンス変数に追加
                    imageryProviderHooks.addRecolorFunc = (imageryProvider) => {
                        // @method: imageProvider.requestImage(x,y: 座標, level: 高度, request: リクエストオブジェクト) => HTMLImageElement: 読み込んだ画像 | undefined
                        // 与えられるタイルに対するイメージを要求するメソッド
                        imageryProvider.base_requestImage = imageryProvider.requestImage;   // 画像のオブジェクトを指定して, 画像を返してもらうハンドラのバックアップをとる
                        // requestImageメソッドを上書き
                        imageryProvider.requestImage = (x, y, level) => {
                            // 読み込んだ画像(HTMLCanvasElement)を変数に保存
                            const imagePromise = imageryProvider.base_requestImage(x, y, level);
                            // 読み込んだ画像がundefinedだった場合, それをそのまま返す.
                            if(!defined(imagePromise)){ return imagePromise; } 
                            return when(imagePromise, image => {
                                if(defined(image)){ // imageオブジェクトがundefinedでなければ...
                                    const canvas = document.createElement("canvas");
                                    [canvas.width, canvas.height] = [image.width, image.height];
                                    const context = canvas.getContext("2d");
                                    context.drawImage(image, 0, 0);
                                    image = bitmap2datas(canvas, clrmap_04);
                                }
                                return image; // 変換した画像を返す
                            })
                        }
                    };

                    // 表示領域のインスタンスを作成
                    // プロパティはとりあえず指定しない
                    let custom_imageryProdiver = new Cesium.UrlTemplateImageryProvider({
                        url: "../tile/Ps/time=32112/{z}/{x}/{y}.png",
                        tileHeight: 256,
                        tileWidth: 256,
                        maximumLevel: 2,
                        mimimumLevel: 0,
                    });

                    imageryProviderHooks.addRecolorFunc(custom_imageryProdiver);

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
                            const canvas = L.DomUtil.create('canvas', 'dcwmt-tile');
                            [canvas.width, canvas.height] = [256, 256];
                            const url = `${this.options.scalar_layer_of_dir}/${coords.z}/${coords.x}/${coords.y}.png`;
                            url2canvas(url, clrmap_04, canvas);
                            return canvas;
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
                                            async function imagePromise() {
                                                try{
                                                    const canvas = document.createElement("canvas");
                                                    [canvas.width, canvas.height] = [256, 256];
                                                    url2canvas(src, clrmap_04, canvas);
                                                    return canvas;
                                                }catch(error){
                                                    return error;
                                                }
                                            }

                                            imagePromise()
                                            .then(
                                                canvas => { 
                                                    imageTile.getImage().src = canvas.toDataURL("image/png"); 
                                                }
                                            )
                                            .catch( 
                                                reject => { console.log(reject); } 
                                            );
                                            // const canvas = document.createElement("canvas");
                                            // [canvas.width, canvas.height] = [256, 256];
                                            // const img = new Image();
                                            // const onload = new Promise((resolve, reject) => {
                                                // img.src = src;
                                                // resolve(img)
                                            // })
                                            
                                            // onload.then(
                                                // value => {
                                                    // const redraw = new Promise((resolve, reject) => {
                                                        // const context = canvas.getContext('2d');
                                                        // context.drawImage(value, 0, 0);
                                                        // const img = context.getImageData(0, 0, canvas.width, canvas.height);
                                                        // const rgba = img.data;
                                                        // let min, max;
                                                        // let red, green, blue;
                                                        // let dataView = new DataView(new ArrayBuffer(32));
                                                        // let scalarData = new Array();

                                                        // for(let i = 0; i < canvas.height * canvas.width; i++){
                                                            // const bias_rgb_index = i*4;
                                                            // red =   rgba[bias_rgb_index    ]  << 24;
                                                            // green = rgba[bias_rgb_index + 1]  << 16;
                                                            // blue =  rgba[bias_rgb_index + 2]  << 8;
                                                        
                                                            // dataView.setUint32(0, red + green + blue);
                                                            // scalarData[i] = dataView.getFloat32(0);
                                                        
                                                            // if(i === 0)
                                                                // min = max = scalarData[i];
                                                            // else{
                                                                // if(min > scalarData[i]) min = scalarData[i];
                                                                // if(max < scalarData[i]) max = scalarData[i];
                                                            // }
                                                        // }
                                                    
                                                        // for(let i = 0; i < canvas.height * canvas.width; i++){
                                                            // const bias_rgb_index = i*4;
                                                            // const colormap_per_scalardata = clrmap_04.length / (max - min);
                                                            // const colormap_index = parseInt(colormap_per_scalardata * (scalarData[i] - min));
                                                            // let rgb;
                                                        
                                                            // if(scalarData[i] === 0.0000000000)          { rgb = {r:255, g:255, b:255}; }
                                                            // else if(clrmap_04.length <= colormap_index) { rgb = clrmap_04[clrmap_04.length - 1]; }
                                                            // else if(0 >= colormap_index)                { rgb = clrmap_04[0]; }
                                                            // else                                        { rgb = clrmap_04[colormap_index]; } 
                                                        
                                                            // img.data[bias_rgb_index  ] = rgb.r;
                                                            // img.data[bias_rgb_index+1] = rgb.g;
                                                            // img.data[bias_rgb_index+2] = rgb.b;
                                                            // img.data[bias_rgb_index+3] = 255;
                                                        // }

                                                        // context.putImageData(img, 0, 0);

                                                        // resolve(canvas);
                                                    // })

                                                    // redraw.then(
                                                        // canvas => {
                                                            // imageTile.getImage().src = canvas.toDataURL("image/png");
                                                            // console.log(imageTile.getImage())
                                                        // },
                                                        // reason => {console.error(reason)}
                                                    // );
                                                // },
                                                // reason => { console.error(reason); }
                                            // )
                                        }
                                    })
                                })
                            ],
                            view: new ol.View({
                                // center: [-472202, 7530279],
                                center: [0, 0],
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