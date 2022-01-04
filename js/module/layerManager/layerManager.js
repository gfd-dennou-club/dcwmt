const layerManager = class{
    constructor(display_name, viewer){
        this.display_name = display_name;
        // レイヤをコントロールするLayerControllerをdocumentから取ってくる
        const layer_controller = document.getElementById("layer_controller");

        const original_layer = this._getOriginalLayer(viewer);
        
        // ライブラリに適したLayerManagerを取ってくる
        switch(display_name){
            case "Cesium":  this.layer_manager = new layerManager3D(original_layer, layer_controller); break;
            case "Leaflet": this.layer_manager = new layerManagerCartesian(original_layer); break;
            case "OpenLayers": this.layer_manager = new layerManagerProjection(original_layer); break;
        }
    }

    addBaseLayer = (layer, name) => {
        this.layer_manager.addBaseLayer(layer, name);
    }

    addOverlayLayer = (layer, name, alpha = 1.0, show = false) => {
        this.layer_manager.addOverlayLayer(layer, name, alpha, show);
    }

    updateLayerList = () => {
        this.layer_manager.updateLayerList();
    }

    initialize = () => {
        this.layer_manager.initialize();
    }

    _getOriginalLayer = (viewer) => {
        switch(this.display_name){
            case "Cesium": return viewer.imageryLayers;
            case "Leaflet": return new L.control.layers();
            case "OpenLayers": return viewerProjection(map_ele);
        }
    }
}