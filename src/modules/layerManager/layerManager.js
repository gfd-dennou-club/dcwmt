import L from "leaflet";

import layerManager3D from "./lib/layerManager3D";
import layerManagerCartesian from "./lib/layerManagerCartesian";
import layerManagerProjection from "./lib/layerManagerProjection";

const layerManager = class{
    constructor(wmtsLibIdentifer, viewer){
        this.wmtsLibIdentifer = wmtsLibIdentifer;

        // レイヤの元となるものを取得
        const original_layer = this._getOriginalLayer(viewer);

        // ライブラリに適したLayerManagerを取ってくる
        this.layer_manager = this._getLayerManager(original_layer);
    }

    addBaseLayer = (layer, name) => {
        this.layer_manager.addBaseLayer(layer, name);
        // this.baselayers.push(layer);
        // if(this.bottomLayer === undefined) this.bottomLayer = layer;
    }

    addLayer = (layer, name, alpha = 1.0, show = false) => {
        this.layer_manager.addLayer(layer, name, alpha, show);
        // this.overlaylayers.push({ layer: layer, show: false });
    }

    getLayers = () => {
        return this.layer_manager.getLayers();
    }

    getBaseLayers = () => {
        return this.layer_manager.getBaseLayers();
    }

    setup = (viewer) => {
        // const original_layer = this._getOriginalLayer(viewer);
        // const layer_controller = new layerController(original_layer);
        // const ele = layer_controller.create(
        //     this.wmtsLibIdentifer
        // );
        this.layer_manager.setup(viewer);
    }

    update = () => {
        this.layer_manager.update();
    }

    remove = (layer) => {
        this.layer_manager.remove(layer);
    }

    add = (layer, index) => {
        this.layer_manager.add(layer, index);
    }

    raise = (layer) => {
        this.layer_manager.raise(layer);
    }

    lower = (layer) => {
        this.layer_manager.lower(layer);
    }

    _getOriginalLayer = (viewer) => {
        const cesium = viewer.imageryLayers;
        const leaflet = new L.control.layers();
        const openlayers = viewer;
        return this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
    }

    _getLayerManager = (original_layer) => {
        const cesium = () => new layerManager3D(original_layer);
        const leaflet = () => new layerManagerCartesian(original_layer);
        const openlayers = () => new layerManagerProjection(original_layer);
        const suitableFunc = this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
        return suitableFunc();

    }
}

export default layerManager;