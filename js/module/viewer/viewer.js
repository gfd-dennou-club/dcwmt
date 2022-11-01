const Viewer = class{
    // options: { 
    //     wmtsLibIdentifer: wmtsLibIdentifer, 
    //     tone: [{
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

        const wmtsLibIdentifer = this.options.wmtsLibIdentifer;

        // レイヤマネージャを作成
        const layer_manager = new layerManager(wmtsLibIdentifer, viewer);

        // レイヤの作成とマネージャへの追加
        const layer_types = [this.options.tone, this.options.vector];
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
                layer_manager.addBaseLayer(layer.get(wmtsLibIdentifer), layer_info.name);
                layer_manager.addOverlayLayer(layer.get(wmtsLibIdentifer), layer_info.name);
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
        const ceisum = () => this._for3D(map_ele);
        const leaflet = () => this._forCartesian(map_ele, maximumLevel);
        const openlayers = () => this._forProjection(map_ele, maximumLevel);
        const suitableFunc = this.options.wmtsLibIdentifer.whichLib(ceisum, leaflet, openlayers);
        return suitableFunc();
    }

    _for3D = (map_ele) => { 
        return viewer3D(map_ele); 
    }

    _forCartesian = (map_ele, maximumLevel) => {
        const options = { maximumLevel: maximumLevel, minimumLevel: 0 };
        return viewerCartesian(map_ele, options); 
    }

    _forProjection = (map_ele, maximumLevel) => {
	const options = { 
		maxLevel: maximumLevel, 
		minLevel: 0, 
	};
        return viewerProjection(map_ele, options);
    }
} 
