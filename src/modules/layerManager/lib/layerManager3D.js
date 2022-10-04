import ImageryLayer from "cesium/Source/Scene/ImageryLayer";

const layerManager3D = class{
    constructor(original_layer){
        this.original_layer = original_layer;
        this.layers = [];
        this.baselayers = [];
    }

    addBaseLayer = (layer, name) => {
        const _layer = new ImageryLayer(layer);
        _layer.name = name;
        _layer.setAlpha = this._setAlpha;
        _layer.setShow = this._setShow; 
        _layer.isBaselayer = true;
        if ( this.baselayers.length === 0 ) {
            this.original_layer.add(_layer);
        }
        this.baselayers.push(_layer);
    }

    addLayer = (layer, name, alpha, show) => {
        const _layer = new ImageryLayer(layer);
        _layer.name = name;
        _layer.setAlpha = this._setAlpha;
        _layer.setShow = this._setShow;
        _layer.setAlpha(alpha);
        _layer.setShow(show);

        _layer.isBaselayer = false;
        this.original_layer.add(_layer);
    }

    getLayers = () => {
        return this.layers;
    }

    getBaseLayers = () => {
        return this.baselayers;
    }

    _setAlpha = function ( alpha ) {
        this.alpha = alpha;
    }

    _setShow = function ( show ) {
        this.show = show;
    }

    setup = () => {
        const defaultlayer = this.original_layer.get(0);
        this.original_layer.remove(defaultlayer, false);
        this.update();
    }

    remove = (layer) => {
        this.original_layer.remove(layer, false);
    }

    add = (layer, index) => {
        this.original_layer.add(layer, index);
    }

    raise = (layer) => {
        this.original_layer.lower(layer);
        this.update();
    }

    lower = (layer) => {
        this.original_layer.raise(layer);
        this.update();
    }

    update = () => {
        this.layers.splice(0, this.original_layer.length);
        for ( let i = 0; i < this.original_layer.length; i++ ) {
            const layer = this.original_layer.get(i);
            this.layers.push(layer);
        }
    }
}

export default layerManager3D;