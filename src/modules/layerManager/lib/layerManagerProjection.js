const layerManagerProjection = class {
    constructor(original_layer){
        this.original_layer = original_layer;
        this.baselayers = [];
    }

    addBaseLayer = (layer, name) => {
        layer.name = name;
        layer.setAlpha = this._setAlpha;
        layer.setShow = this._setShow;

        layer.isBaselayer = true;
        if ( this.baselayers.length === 0 ) {
            layer.setAlpha(1.0);
            layer.setShow(true);
            this.original_layer.addLayer(layer);
        }
        this.baselayers.push(layer);
    }

    addLayer = (layer, name, alpha, show) => {
        layer.name = name;
        layer.setAlpha = this._setAlpha;
        layer.setShow = this._setShow;
        layer.setAlpha(alpha);
        layer.setShow(show);

        layer.isBaselayer = false;
        this.original_layer.addLayer(layer);
    }

    getLayers = () => {
        return this.original_layer.getLayers().getArray();
    }

    getBaseLayers = () => {
        return this.baselayers;
    }

    _setAlpha = function ( alpha ) {
        this.alpha = alpha;
        this.setOpacity(alpha);
    }

    _setShow = function ( show ) {
        this.show = show;
        this.setVisible(show);
    }

    setup = () => { }

    update = () => { } 

    remove = (layer) => {
        const ary = this.original_layer.getLayers();
        ary.remove(layer);
        this.original_layer.setLayers(ary);
    }

    add = (layer, index) => {
        const ary = this.original_layer.getLayers();
        ary.insertAt(index, layer);
        this.original_layer.setLayers(ary);
    }

    raise = (layer) => {
        const ary = this.original_layer.getLayers();
        ary.getArray().some( (_layer, index) => {
            if ( index > 0 && _layer === layer) {
                ary.remove(layer);
                ary.insertAt(index - 1, layer);
                return true;
            }
        });
        this.original_layer.setLayers(ary);
    }

    lower = (layer) => {
        const ary = this.original_layer.getLayers();
        const maxindex = ary.getLength() - 1;
        ary.getArray().some( (_layer, index) => {
            if ( index < maxindex && _layer === layer) {
                ary.remove(layer);
                ary.insertAt(index + 1, layer);
                return true;
            }
        });
        this.original_layer.setLayers(ary);
    }
}   

export default layerManagerProjection;
