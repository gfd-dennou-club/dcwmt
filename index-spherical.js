
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
                const context = getCanvasContext(imageryProvider, image);                               // 画像のコンテキストを取得
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

    // 最大値と最小値を確保
    for(let i = 0; i < lendth; i++){
        if(min === undefined || max === undefined)  { min = max = image.data[i];    }
        else if(min <= image.data[i])               { min = image.data[i];          }
        else if(max >= image.data[i])               { max = image.data[i];          }
    }

    // 色を塗り替えてゆく
    for(let i = 0; i < lendth; i+=4){
        red     = image.data[i     ] << 24;
        green   = image.data[i + 1 ] << 16;
        blue    = image.data[i + 2 ] << 8;

        dataView.setUint32(0, red + green + blue);
        const rgb = recolorFunc(dataView.getFloat32(0), min, max);
        image.data[i    ] = rgb.r;
        image.data[i + 1] = rgb.g;
        image.data[i + 2] = rgb.b;
        image.data[i + 3] = rgb.a;
    }
    return image;
};

// @method: getCanvasContext(imageryProvider: 画像の参照を行うインスタンス, image: 読み込んだ画像) => context: 読み込んだ画像のコンテキスト
// 読み込んだ画像のコンテキストを取得するための関数
const getCanvasContext = (imageryProvider, image) => { 
    let canvas = document.createElement("canvas");                  // キャンバス要素を作成
    [canvas.width, canvas.height] = [image.width, image.height];    // 画像の大きさにキャンバスを合わせる
    context = canvas.getContext("2d");                              // コンテキストを取得
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
let custom_imageryProdiver = new Cesium.OpenStreetMapImageryProvider({
    url: `../tile/PRCP/time=32125/`,
    tileHeight: 192,
    tileWidth: 384,
});

const recolorFunc = (data, min, max) => {
   // カラーマップの配列の要素値を作成(以下の比の計算)
    // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
    const colormap_per_scalardata = clrmap_04.length / (max - min);
    const colormap_index = parseInt(colormap_per_scalardata * (data - min));

    // 読み込み失敗時は白を返す
    if(data === 0.0000000000)   { return {r:255, g:255, b:255, a:255}; }

    if(clrmap_04.length <= colormap_index) { return clrmap_04[clrmap_04.length - 1]; }
    else if (0 > colormap_index)                       { return clrmap_04[0]; }
    else                                               { return clrmap_04[colormap_index]; }                          // それ以外は対応する色を返す
}

imageryProviderHooks.addRecolorFunc(custom_imageryProdiver, recolorFunc);

const viewer = new Cesium.Viewer(
    `spherical-map`, {   // 表示するhtml要素
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

const scene = new Cesium.Scene({
    backgroundColor: "#FFFFFF",
});
//scene.requestRender();