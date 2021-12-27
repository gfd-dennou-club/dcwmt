const layerManager3D = class{
    constructor(imageryLayers){
        this.imageryLayers = imageryLayers;
        this.baselayers = [];
        this.overlayers = [];
        this.upLayer = null;
        this.downLayer = null;
        this.selectedLayer = ko.observable(null);
    }

    raise = (layer, index) => {
        this.imageryLayers.raise(layer);
        this.upLayer = layer;
        this.downLayer = this.overlayers[Math.max(0, index - 1)];
        this._updateLayerList();
    }

    lower = (layer, index) => {
        this.imageryLayers.lower(layer);
        this.upLayer = this.overlayers[Math.min(this.overlayers.length - 1, index + 1)];
        this.downLayer = layer;
        this._updateLayerList();
    }

    _updateLayerList = () => {
        this.overlayers.splice(0, this.overlayers.length);
        this.overlayers = this.imageryLayers.concat();
        this.overlayers.reverse();
    }

    canRaise = (index) => { return index > 0; }
    canLower = (index) => { return 0 <= index && index <= this.imageryLayers.length - 1; }

    addBaseLayer = (imageryProvider, name) => {
        let layer;
        if(typeof imageryProvider === undefined){
            layer = this.imageryLayers.get(0);
            this.selectedLayer = layer;
        }else{
            layer = new Cesium.ImageryLayer(imageryProvider);
        }
        layer.name = name;
        this.baselayers.push(layer);
    }

    addOverlayLayer = (imageryProvider, name, alpha, show) => {
        const layer = this.imageryLayers.addImageryProvider(imageryProvider);
        layer.alpha = alpha || 0.5;
        layer.show = show || true;
        layer.name = name;
        ko.track(layer, ["alpha", "show", "name"]);
    }

    updateLayer = (baselayer) => {
        const isSelectableLayer = layer => this.baselayers.indexOf(layer) >= 0;
        const active_layer_index = this.baselayers.findIndex(isSelectableLayer);

        this.imageryLayers.remove(layer, false);
        this.imageryLayers.add(
            baselayer,
            this.overlaylayers.length - active_layer_index - 1
        );
        this._updateLayerList();
    }
}
