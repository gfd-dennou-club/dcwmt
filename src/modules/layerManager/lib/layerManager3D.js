import {GridImageryProvider, knockout, ImageryLayer}  from "cesium";

const layerManager3D = class{
    constructor(imageryLayers, layer_controller){
        this.imageryLayers = imageryLayers;
        this.baselayer = "Ps";
        this.overlaylayers = [];
        this.viewModel = {
            layer: [],
            overlaylayers: [],
            baselayers: [],
            upLayer: null,
            downLayer: null,
            selectedLayer: null,
            isSelectableLayer: (layer) => this.viewModel.baselayers.indexOf(layer) >= 0,
        }
        this.addBaseLayer(undefined, "tile coordinate");
        this.addOverlayLayer(
            new GridImageryProvider(),
            "Grid",
            1.0,
            false
        );
        knockout.track(this.viewModel);
    }

    addBaseLayer = (imageryProvider, name) => {
        let layer;
        if(typeof imageryProvider === "undefined"){
            layer = this.imageryLayers.get(0);
            this.viewModel.selectedLayer = layer;
        }else{
            layer = new ImageryLayer(imageryProvider);
        }
        layer.name = name;
        this.viewModel.baselayers.push(layer);
    }

    addOverlayLayer = (imageryProvider, name, alpha, show) => {
        const layer = this.imageryLayers.addImageryProvider(imageryProvider);
        layer.alpha = alpha || 0.5;
        layer.show = show || true;
        layer.name = name;
        knockout.track(layer, ["alpha", "show", "name"]);
    }

    // updateLayerList = () => {
    //     this.viewModel.layers.splice(0, this.viewModel.layers.length);

    //     for(let i = this.imageryLayers.length - 1; i >= 0; i--){
    //         this.viewModel.layers.push(this.imageryLayers.get(i));
    //     }
    // }

    setup = (viewer, ele) => {
        knockout.applyBindings(this.viewModel, ele);
        knockout
            .getObservable(this.viewModel, "baselayers")
            .subscribe(this._eventListener_changedBaseLayer);
        knockout
            .getObservable(this.viewModel, "overlaylayers")
            .subscribe(this._eventListener_changedOverlayLayer);
        this.layers = this.imageryLayers._layers;
        this._layer();
    }

    _eventListener_changedBaseLayer = (baselayer) => {
        this.baselayer = baselayer;
        this._layer();
    }

    _eventListener_changedOverlayLayer = (overlaylayers) => {
        this.overlaylayers = overlaylayers;
        this._layer();
    }

    _layer = () => {
        this.imageryLayers.removeAll(false);
        const baselayer = this.layers.find((layer) => this.baselayer === layer.name);
        this.imageryLayers.add(baselayer, 0);
        this.overlaylayers.forEach((layer, index) => {
            if(this.baselayer === layer.name) return;
            const overlay = this.layers.find((overlay) => overlay.name === layer)
            this.imageryLayers.add(overlay, index + 1);
        });
    }
}

export default layerManager3D;