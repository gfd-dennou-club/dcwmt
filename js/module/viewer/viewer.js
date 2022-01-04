const Viewer = class{
    // options: { 
    //     display_name: String, 
    //     counter: [{
    //         name: String, 
    //         url: [String], 
    //         size: {X: Number, Y: Number},
    //     }, ...], 
    //     vector: [{
    //         name: String (for example: VelX-VelY), 
    //         url: [["String", "String"], ...],
    //         size: {X: Number, Y: Number},
    //     }, ...], 
    //     maximumLevel: Number
    // }
    constructor(options){
        // 表示するライブラリの名前を取得
        this.display_name = options.display_name;
        // ビュワの作成
        const viewer = this.draw();
        // レイヤマネージャを作成
        const layer_manager = new layerManager(options.display_name, viewer);
      
        // レイヤの作成とマネージャへの追加
        const layer_types = [options.counter, options.vector];
        layer_types.forEach((layer_type) => {
            layer_type.forEach((layer) => {
                const options_for_layer = {
                    name: layer.name,
                    url: layer.url,
                    size: layer.size,
                    maximumLevel: this.maximumLevel,
                    minimumLevel: 0,
                    clrindex: 4,
                    opacity: 255,
                };
                const layer_instance = new Layer(options_for_layer);
                layer_manager.addBaseLayer(layer_instance.create(this.display_name), layer.name);
                layer_manager.addOverlayLayer(layer_instance.create(this.display_name), layer.name);
            });
        });

        layer_manager.updateLayerList();
        layer_manager.initialize();
    }

    draw = () => {
        const map = new Map("map");
        map.create();
        const map_ele = map.getElement();
        return this._getViewerWithSuitableLib(map_ele, 2);
    }

    _getViewerWithSuitableLib = (map_ele, maximumLevel) => {
        switch(this.display_name){
            case "Cesium":
                return viewer3D(map_ele);
            case "Leaflet":
                const options = { maximumLevel: maximumLevel, minimumLevel: 0 };
                return viewerCartesian(map_ele, options);
            case "OpenLayers":
                return viewerProjection(map_ele);
        }
    }
} 