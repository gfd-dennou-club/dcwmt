const viewer3D = (map, diagram) => {
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

                    // const counterDiagram = new CounterDiagram(clrmap_04);
                    const isLevel0 = (level === 0);
                    image = diagram.bitmap2tile(canvas, isLevel0);
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
}