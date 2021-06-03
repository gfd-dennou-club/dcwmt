import layer from "../modules/layer.js";
import viewer from "../../main.js";
import {OrthographicProjection, OrthographicTilingScheme} from "../lib/orthographic.js"; 

/** @type {Object} 数値データを可視化する際に使用するimageryProvider */
let myImageryProdiver = layer({
    url: `${DEFINE.ROOT}/Ps/time=32112/`,
    tilingScheme: DEFINE.PROJECTION.tilingScheme,
    height: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.Y,
    width: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.X,
    maxZoom: DEFINE.PHYSICAL_QUANTITY["Ps"].MAX_ZOOM,
    minZoom: 0,
});

/** @type {ImageryLayerCollection} viewerが持つimageryLayer群を持つ配列 */
const imageryLayers = viewer.imageryLayers;

/** @type {Object} MVVM(Model-View-ViewModel)モデルにおけるViewModelが参照する変数群を持つ*/
let viewModel = {
    layers: [],         // オーバレイ・レイヤ群
    baseLayers: [],     // ベース・レイヤ群
    upLayer: null,      // 上にするレイヤを一時保持する
    downLayer: null,    // 下にするレイヤを一時保持する
    selectedLayer: null,// 選択されたレイヤを一時保持する
    /**
     * 選択されたレイヤか判断する関数
     *
     * @param {number_} layer レイヤの添字
     * @return {boolean} 選択されているかどうかの真偽値
     */
    isSelectableLayer: function(layer){
        return this.baseLayers.indexOf(layer) >= 0;
    },
    
    /**
     * 引数で与えられたレイヤを表示面のトップにする
     *
     * @param {number} layer 上にあげたいレイヤの添字
     * @param {number} index レイヤの総数
     */
    raise: function(layer, index){
        imageryLayers.raise(layer);
        viewModel.upLayer = layer;
        viewModel.downLayer = viewModel.layers[Math.max(0, index-1)];
        updateLayerList();
        window.setTimeout(function(){
            viewModel.upLayer = viewModel.downLayer = null;
        }, 10);
    },
    /**
     * 引数で与えられたレイヤを表示面の一番下にする
     *
     * @param {number} layer 下におろしたいレイヤの添字
     * @param {number} index レイヤの総数
     */
    lower: function(layer, index){
        imageryLayers.lower(layer);
        viewModel.upLayer = viewModel.layers[
            Math.min(viewModel.layers.length-1, index+1)
        ];
        viewModel.downLayer = layer;
        updateLayerList();
        window.setTimeout(function(){
            viewModel.upLayer = viewModel.downLayer = null;
        }, 10);
    },
    /**
     * 引数で与えられたレイヤの添字が上に上げることができるかどうかを判断する関数
     *
     * @param {number} layerIndex レイヤの添字
     * @return {boolean} 上に上げるかどうかの真偽値
     */
    canRaise: function(layerIndex){ return layerIndex > 0; },
    /**
     * 引数で与えられたレイヤの添字が下に下げられることができるかどうかを判断する関数
     *
     * @param {number} layerIndex レイヤの添字
     * @return {boolean} 下に下げられるかどうかの真偽値
     */
    canLower: function(layerIndex){ return layerIndex >= 0 && layerIndex < imageryLayers.length - 1; },

    mapProjections: [],
    selectedProjection: null,
    /**
     * 選択されたプロジェクションか判断する関数
     *
     * @param {number_} projection プロジェクションの添字
     * @return {boolean} 選択されているかどうかの真偽値
     */
     isSelectableProjection: function(projection){
        return this.mapProjections.indexOf(projection) >= 0;
    },
};

/** @type {Array<imageryLayer>} ベース・レイヤのインスタンスを格納しておく配列  */
let baseLayers = viewModel.baseLayers;

// MVVM(Model-View-ViewModel)モデルにおけるViewModelが変数viewModelの変更を監視するようにする(はず)
Cesium.knockout.track(viewModel);

/**
 * レイヤに関するセットアップを行う. (ベース・レイヤの設定などを行う)
 *
 */
function setupLayers(){
    addProjectOption(
        "Webメルカトル図法",
        new Cesium.WebMercatorProjection(),
        Cesium.SceneMode.COLUMBUS_VIEW,
        new Cesium.WebMercatorTilingScheme()
    );
    addProjectOption(
        "正距円筒図法",
        new Cesium.GeographicProjection(),
        Cesium.SceneMode.COLUMBUS_VIEW,
        new Cesium.GeographicTilingScheme()
    );
    addProjectOption(
        "正射図法",
        OrthographicProjection,
        Cesium.SceneMode.SCENE3D,
        OrthographicTilingScheme
    );
    
    addBaseLayerOption("Bing Maps Aerial", undefined);
    addBaseLayerOption(
        "Ps", 
        myImageryProdiver.imageryProvider()
    );
    addOverlayLayerOption(
        "Grid",
        new Cesium.GridImageryProvider(),
        1.0, 
        false 
    );
    addOverlayLayerOption(
      "Tile Coordinates",
      new Cesium.TileCoordinatesImageryProvider(),
      1.0,
      false
    );
}

function addProjectOption(name, mapProjection, sceneMode, tilingScheme){
    let projection;
    // 引数のどれか一つでも"undefine"が渡された場合には, webメルカトル図法にしておく
    if (typeof mapProjection === "undefined" || typeof sceneMode === "undefined" || typeof tilingScheme === "undefined"){
        projection = {
            name: "Webメルカトル図法",
            mapProjection: new Cesium.WebMercatorProjection(),
            sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
            tilingScheme: new Cesium.WebMercatorTilingScheme(),
        };
    }else{
        projection = {
            name: name,
            mapProjection: mapProjection,
            sceneMode: sceneMode,
            tilingScheme: tilingScheme,
        }
    }
    viewModel.mapProjections.push(projection);
}

/**
 * ベース・レイヤを変数baseLayersに追加する
 *
 * @param {String} name 追加したいベース・レイヤの名前
 * @param {imageryLayer} imageryProvider 追加したいベース・レイヤのインスタンス
 */
function addBaseLayerOption(name, imageryProvider){
    let layer;
    if(typeof imageryProvider === "undefined"){
        layer = imageryLayers.get(0);
        viewModel.selectedLayer = layer;
    }else{
        layer = new Cesium.ImageryLayer(imageryProvider);
    }

    layer.name = name;
    baseLayers.push(layer);
}

/**
 * オーバーレイ・レイヤ(透過や表示,非表示の選択が可能なレイヤ)をマップ上に表示する
 *
 * @param {String} name 追加したいレイヤの名前
 * @param {imageryLayer} imageryProvider 追加したいレイヤのインスタンス
 * @param {number} alpha レイヤのアルファ値
 * @param {number} show レイヤを表示するかどうか
 */
function addOverlayLayerOption(name, imageryProvider, alpha, show){
    let layer = imageryLayers.addImageryProvider(imageryProvider);
    layer.alpha = Cesium.defaultValue(alpha, 0.5);
    layer.show = Cesium.defaultValue(show, true);
    layer.name = Cesium.defaultValue(name, "no name");
    Cesium.knockout.track(layer, ["alpha", "show", "name"]);
}

/**
 * オブジェクト"viewModel"のプロパティ"layers"が配列として持っているimageryLayer群を更新する
 *
 */
function updateLayerList(){
    let numLayers = imageryLayers.length;
    // 配列の0番目以降の要素を全て削除
    viewModel.layers.splice(0, viewModel.layers.length); 
    for(let i = numLayers - 1; i >= 0; i--)
        viewModel.layers.push(imageryLayers.get(i));
}

// ---------------------------------------------------------- //

setupLayers();      // レイヤのセットアップ
updateLayerList();  // レイヤリストのアップデート

/** @type {HTMLElement} レイヤ切り替えに用いるツールバーのHTML要素*/
let toolbar = document.getElementById("toolbar");
Cesium.knockout.applyBindings(viewModel, toolbar);

Cesium.knockout
    .getObservable(viewModel, "selectedLayer")    // オブジェクトviewModelのプロパティselectedLayerを監視する（多分）
    .subscribe(
        // 上記のプロパティに変更があった場合に変数として渡したハンドラを実行
        function(baseLayer){                    
            // 選択されているレイヤの添字を取得
            let activeLayerIndex = 0;
            let numLayers = viewModel.layers.length;
            for(let i = 0; i < viewModel.layers.length; i++){   
                if(viewModel.isSelectableLayer(viewModel.layers[i])){
                    activeLayerIndex = i;
                    break;
                }
            }
            const activeLayer = viewModel.layers[activeLayerIndex];
            const show = activeLayer.show;
            const alpha = activeLayer.alpha;

            // imageryLayerを消して, 書いてを行なっている.
            console.log(imageryLayers);
            imageryLayers.remove(activeLayer, false);                       // activeLayer自体は破壊せずにimageryLayersからのみactiveLayerを削除
            imageryLayers.add(baseLayer, numLayers - activeLayerIndex - 1); // baseLayerを添字(numLayers - activeLayerIndex - 1)に追加する
            console.log(imageryLayers)

            baseLayer.show = show;
            baseLayer.alpha = alpha;
            updateLayerList();
        }
    )

Cesium.knockout
    .getObservable(viewModel, "selectedProjection") // 地図投影法を切り替えるselect要素を監視している
    .subscribe(
        /**
         * 監視している要素に変更があったときに実行するイベントハンドラ
         * 
         * @param {Objetc} projection setLayer関数で渡した引数の要素
         */
        function(projection){
            // sceneModeを切り替え
            viewer.scene.mode = projection.sceneMode;
            // activeLayerの地図投影に関する部分のみの切り替え
            // 選択されているレイヤを取得
            let activeProjectionIndex = 0;
            let numProjection = viewModel.mapProjections.length;

            // 配列viewModel内のactiveLayerの添字を取得する
            for(let i = 0; i < viewModel.mapProjections.length; i++){
                if(viewModel.isSelectableLayer(viewModel.mapProjections[i])){
                    activeLayerIndex = i;
                    break;
                }
            }
            // アクティブレイヤを取得
            const activeLayer = viewModel.layers[activeLayerIndex];

            // タイリングスキーマを変更したimageruProviderを作成
            const recreateImageryProdiver = layer({
                url: `${DEFINE.ROOT}/Ps/time=32112/`,
                tilingScheme: projection.tilingScheme,
                height: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.Y,
                width: DEFINE.PHYSICAL_QUANTITY["Ps"].SIZE.X,
                maxZoom: DEFINE.PHYSICAL_QUANTITY["Ps"].MAX_ZOOM,
                minZoom: 0,
            });

            const recreateLayer = recreateImageryProdiver.imageryProvider();

            imageryLayers.remove(activeLayer, false);                // activeLayerを削除
            imageryLayers.add(recreateLayer, numLayers - activeLayerIndex - 1);

            updateLayerList();
        }
    );