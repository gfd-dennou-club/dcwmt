const layerManagerCartesian = class{
    constructor(original_layer, layer_controller){
        this.original_layer = original_layer;
    }

    addBaseLayer = (layer, name) => {
        this.original_layer.addBaseLayer(layer, name);
    }

    addOverlayLayer = (layer, name, alpha = 1.0, show = false) => {
        this.original_layer.addOverlay(layer, name);
    }

    setup = (viewer) => {
        this.original_layer.addTo(viewer);
    }
}