const layerManagerProjection = class{
    constructor(original_layer){
        this.original_layer = original_layer;
    }

    addBaseLayer = (layer, name) => {
        this.original_layer.addLayer(layer);
    }

    addOverlayLayer = (layer, name, show = false) => {
    }

    setup = (viewer, ele) => {

    }
}