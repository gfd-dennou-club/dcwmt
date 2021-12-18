const viewer3D = (viewer_ele, layer) => {
    // // イメージプロバイダに対する独自の処理を実装するためのインスタンス
    // let imageryProviderHooks = {};

    // // @method: addRecolorFunc(imageryProvider: 画像を参照を行うインスタンス, recolorFunc: 数値データを復元するための関数) => image(HTMLCanvasElement): 取得した画像から絵を描き直した画像(キャンバス)
    // // 数値データタイルを復元するための関数をインスタンス変数に追加
    // imageryProviderHooks.addRecolorFunc = (imageryProvider) => {
    //     // @method: imageProvider.requestImage(x,y: 座標, level: 高度, request: リクエストオブジェクト) => HTMLImageElement: 読み込んだ画像 | undefined
    //     // 与えられるタイルに対するイメージを要求するメソッド
    //     imageryProvider.base_requestImage = imageryProvider.requestImage;   // 画像のオブジェクトを指定して, 画像を返してもらうハンドラのバックアップをとる
    //     // requestImageメソッドを上書き
    //     imageryProvider.requestImage = (x, y, level) => {
    //         // urlを解析
    //         const urls = [];
    //         imageryProvider._resource.forEach((ele) => {
    //             const url = ele.replace(/{(.*?)}/g, (_, key) => {
    //                 switch(key){
    //                     case "z": return level.toString();
    //                     case "x": return x.toString();
    //                     case "y": return y.toString();
    //                 }
    //             })
    //             urls.push(url);
    //         });

    //         const canvas = document.createElement("canvas");
    //         [canvas.width, canvas.height] = option.diagram.isCounter([256, 256], [320, 320]);
            
    //         const counterFunc = () => {
    //             return option.diagram.url2tile(urls[0], canvas);
    //         }
    //         const vectorFunc = () => {
    //             return option.diagram.urls2tile(urls, canvas);
    //         }

    //         return option.diagram.isCounter(counterFunc, vectorFunc)();
    //     }
    // };

    // const url = option.url.concat("/{z}/{x}/{y}.png");
    // const urls = option.urls.map(url => url.concat("/{z}/{x}/{y}.png"));

    // // 表示領域のインスタンスを作成
    // // プロパティはとりあえず指定しない
    // let custom_imageryProdiver = new Cesium.UrlTemplateImageryProvider({
    //     url: option.diagram.isCounter([url], urls),
    //     tileHeight: 256,
    //     tileWidth: 256,
    //     maximumLevel: 2,
    //     mimimumLevel: 0,
    // });

    // imageryProviderHooks.addRecolorFunc(custom_imageryProdiver);

    const viewer = new Cesium.Viewer(
        viewer_ele, 
        {   // 表示するhtml要素
            // 画像参照を行うインスタンを設定
            imageryProvider: layer,
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