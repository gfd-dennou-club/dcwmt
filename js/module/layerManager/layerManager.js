const layerManager = class{
    constructor(display_name, layer){
        this.viewer = viewer;
        switch(display_name){
            case "Cesium":  this.layer_manager = new layerManager3D(layer); break;
            case "Leaflet": this.layer_manager = new layerManagerCartesian(layer); break;
            case "OpenLayers": this.layer_manager = new layerManagerProjection(layer); break;
        }

        const layer_controller = document.getElementById("layer_controller");
        const viewModel = this.viewModel();
        ko.applyBindings(viewModel, layer_controller);
        viewModel.selectedLayer.subscribe((baselayer) => {
            const activeLayer = this.getActiveLayer();
            baselayer.show = activeLayer.show;
            baselayer.alpha = activeLayer.alpha;
            this.updateLayer(baselayer);
        })
    }

    viewModel = () => {
        return {
            baselayers: this.layer_manager.baselayers,
            overlaylayers: this.layer_manager.overlaylayers,
            upLayer: this.layer_manager.upLayer,
            downLayer: this.layer_manager.downLayer,
            selectedLayer: this.layer_manager.selectedLayer,
            raise: this.layer_manager.raise,
            lower: this.layer_manager.lower,
            canRaise: this.layer_manager.canRaise,
            canLower: this.layer_manager.canLower,
        };
    }

    addBaseLayer = (layer, name) => {
        this.layer_manager.addBaseLayer(layer, name);
    }

    addOverlayLayer = (layer, name, alpha, show) => {
        this.layer_manager.addOverlayLayer(layer, name, alpha, show);
    }

    updateLayer = (baselayer) => {
        this.layer_manager.moveLayer(baselayer);
    }

    getActiveLayer = () => {
        const isSelectableLayer = layer => this.baselayers.indexOf(layer) >= 0;
        return this.layer_manager.baselayers.find(isSelectableLayer);
    }
}