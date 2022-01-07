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
        this.options = options;
        this.draw();
    }

    draw = () => {
        // ビュワの作成
        const viewer = this._getViewer();
        // レイヤマネージャを作成
        const layer_manager = new layerManager(this.options.display_name, viewer);

        // レイヤの作成とマネージャへの追加
        const layer_types = [this.options.counter, this.options.vector];
        layer_types.forEach((layer_type) => {
            layer_type.forEach((layer_info) => {
                const options_for_layer = {
                    name: layer_info.name,
                    url: layer_info.url,
                    size: layer_info.size,
                    maximumLevel: layer_info.maximumLevel,
                    minimumLevel: 0,
                    clrindex: this.options.clrindex || 4,
                    opacity: 255,
                };
                const layer = new Layer(options_for_layer);
                layer_manager.addBaseLayer(layer.get(this.options.display_name), layer_info.name);
                layer_manager.addOverlayLayer(layer.get(this.options.display_name), layer_info.name);
            });
        });

        // レイヤ・マネージャのセットアップ
        layer_manager.setup(viewer);
    }

    redraw = (options) => {
        for(const prop in options)
            this.options[prop] = options[prop];
        this.draw();
    }

    _getViewer = () => {
        const map = new Map("map");
        map.create();
        const map_ele = map.getElement();
        return this._getViewerWithSuitableLib(map_ele, 2);
    }

    _getViewerWithSuitableLib = (map_ele, maximumLevel) => {
        switch(this.options.display_name){
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