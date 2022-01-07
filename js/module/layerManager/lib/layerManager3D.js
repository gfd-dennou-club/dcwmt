const layerManager3D = class{
    constructor(imageryLayers, layer_controller){
        this.imageryLayers = imageryLayers;
        this.imageryLayers.removeAll();
        this.layer_controller = layer_controller;
        this.viewModel = {
            layers: [],
            baselayers: [],
            upLayer: null,
            downLayer: null,
            selectedLayer: null,
            isSelectableLayer: (layer) => this.viewModel.baselayers.indexOf(layer) >= 0,
            raise: (layer, index) => {
                imageryLayers.raise(layer);
                this.viewModel.upLayer = layer;
                this.viewModel.downLayer = this.viewModel.layers[Math.max(0, index - 1)];
                this._updateLayerList();
                window.setTimeout(() => {
                    this.viewModel.upLayer = this.viewModel.downLayer = null;
                }, 10);
            },
            lower: (layer, index) => {
                imageryLayers.lower(layer);
                this.viewModel.upLayer= this.viewModel.layers[
                    Math.min(this.viewModel.layers.length - 1, index + 1)
                ];
                this.viewModel.downLayer = layer;
                this._updateLayerList();
                window.setTimeout(() => {
                    this.viewModel.upLayer = this.viewModel.downLayer = null;
                }, 10);
            },
            canRaise: (layerindex) => layerindex > 0,
            canLower: (layerindex) => 0 <= layerindex && layerindex < imageryLayers.length - 1, 
        };
        this.addOverlayLayer(
            new Cesium.GridImageryProvider(),
            "Grid",
            1.0,
            false
        );
        Cesium.knockout.track(this.viewModel);
    }

    addBaseLayer = (imageryProvider, name) => {
        const layer = new Cesium.ImageryLayer(imageryProvider);
        layer.name = name;
        this.viewModel.selectedLayer = layer;
        this.viewModel.baselayers.push(layer);
    }

    addOverlayLayer = (imageryProvider, name, alpha, show) => {
        const layer = this.imageryLayers.addImageryProvider(imageryProvider);
        layer.alpha = alpha || 0.5;
        layer.show = show || true;
        layer.name = name;
        Cesium.knockout.track(layer, ["alpha", "show", "name"]);
    }

    setup = () => {
        this._updateLayerList();
        Cesium.knockout.cleanNode(this.layer_controller);
        Cesium.knockout.applyBindings(this.viewModel, this.layer_controller);
        Cesium.knockout
            .getObservable(this.viewModel, "selectedLayer")
            .subscribe(this._changeSelectedLayer);
    }

    _updateLayerList = () => {
        this.viewModel.layers.splice(0, this.viewModel.layers.length);

        for(let i = this.imageryLayers.length - 1; i >= 0; i--){
            this.viewModel.layers.push(this.imageryLayers.get(i));
        }
    }

    _changeSelectedLayer = (baselayer) => {
        const isSelectableLayer = this.viewModel.isSelectableLayer;              
        const activelayer_index = this.viewModel.layers.findIndex(isSelectableLayer);
        const activelayer = this.viewModel.layers[activelayer_index];
        const [show, alpha] = [activelayer.show, activelayer.alpha];
        this.imageryLayers.remove(activelayer, false);
        this.imageryLayers.add(
            baselayer, 
            this.viewModel.layers.length - activelayer_index - 1
        );
        [baselayer.show, baselayer.alpha] = [show, alpha];
        this._updateLayerList();
    }
}
