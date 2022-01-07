const layerManager = class{
    constructor(display_name, viewer){
        this.display_name = display_name;
        // レイヤをコントロールするLayerControllerをdocumentから取ってくる
        const layer_controller = document.getElementById("layer_controller");

        // レイヤの元となるものを取得
        const original_layer = this._getOriginalLayer(viewer);

        // ライブラリに適したLayerManagerを取ってくる
        this.layer_manager = this._getLayerManager(original_layer, layer_controller);
    }

    addBaseLayer = (layer, name) => {
        this.layer_manager.addBaseLayer(layer, name);
    }

    addOverlayLayer = (layer, name, alpha = 1.0, show = false) => {
        this.layer_manager.addOverlayLayer(layer, name, alpha, show);
    }

    setup = (viewer) => {
        this.layer_manager.setup(viewer);
    }

    _getOriginalLayer = (viewer) => {
        switch(this.display_name){
            case "Cesium": return viewer.imageryLayers;
            case "Leaflet": return new L.control.layers();
            case "OpenLayers": return viewer;
        }
    }

    _getLayerManager = (original_layer, layer_controller) => {
        switch(this.display_name){
            case "Cesium": return new layerManager3D(original_layer, layer_controller);
            case "Leaflet": return new layerManagerCartesian(original_layer);
            case "OpenLayers": return new layerManagerProjection(original_layer);
        }
    }
}