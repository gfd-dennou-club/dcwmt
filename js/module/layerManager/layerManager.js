const layerManager = class{
    constructor(wmtsLibIdentifer, viewer){
        this.wmtsLibIdentifer = wmtsLibIdentifer;

        // レイヤをコントロールするLayerControllerをdocumentから取ってくる
        const layer_controller = document.getElementById("layer_controller");

        // レイヤの元となるものを取得
        const original_layer = this._getOriginalLayer(viewer);

        // ライブラリに適したLayerManagerを取ってくる
        this.layer_manager = this._getLayerManager(original_layer, layer_controller);

        this.baselayers = [];
        this.overlaylayers = [];
    }

    addBaseLayer = (layer, name) => {
        this.layer_manager.addBaseLayer(layer, name);
        this.baselayers.push(layer);
        if(this.bottomLayer === undefined) this.bottomLayer = layer;
    }

    addOverlayLayer = (layer, name, alpha = 1.0, show = false) => {
        this.layer_manager.addOverlayLayer(layer, name, alpha, show);
        this.overlaylayers.push({ layer: layer, show: false });
    }

    setup = (viewer) => {
        const original_layer = this._getOriginalLayer(viewer);
        const layer_controller = new layerController(original_layer);
        const ele = layer_controller.create(
            this.wmtsLibIdentifer,
            original_layer,
            this.baselayers,
            this.overlaylayers
        );
        this.layer_manager.setup(viewer, ele);
    }

    _getOriginalLayer = (viewer) => {
        const cesium = viewer.imageryLayers;
        const leaflet = new L.control.layers();
        const openlayers = viewer;
        return this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
    }

    _getLayerManager = (original_layer, layer_controller) => {
        const cesium = () => new layerManager3D(original_layer, layer_controller);
        const leaflet = () => new layerManagerCartesian(original_layer);
        const openlayers = () => new layerManagerProjection(original_layer);
        const suitableFunc = this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
        return suitableFunc();
    }
}
