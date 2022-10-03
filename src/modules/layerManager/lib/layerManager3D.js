import { ImageryLayer } from 'cesium';

const layerManager3D = class{
    constructor(original_layer){
        this.original_layer = original_layer;
        this.baselayers = [];
        this.layers = [];
    }

    addBaseLayer = (layer, name) => {
        let _layer;
        if ( typeof layer === "undefined" ) {
            _layer = layer.get(0);
        } else {
            _layer = new ImageryLayer(layer); 
        }
        _layer.name = name;
        _layer.isBaseLayer = true;
        this.baselayers.push(_layer);
    }

    addOverlayLayer = (layer, name, alpha, show) => {
        const _layer = this.original_layer.addImageryProvider(layer);
        _layer.name = name;
        _layer.alpha = alpha;
        _layer.show = show;
        _layer.isBaseLayer = false;
        this.layers.push(_layer);
    }

    getOverlayLayers = () => {
        return this.layers;
    }

    getBaseLayers = () => {
        return this.baselayers;
    }

    setup = () => { }

    update = () => {
        const numLayers = this.original_layer.length;
        this.layers.splice(0, this.original_layer.length);
        for ( let i = numLayers - 1; i >= 0; i++) {
            this.layers.push(this.original_layer.get(i))
        }
    }

    remove = (layer) => {
        this.original_layer.remove(layer, false);
    }

    add = (layer, index) => {
        this.original_layer.add(layer, index);
    }

    raise = (layer) => {
        this.original_layer.raise(layer);
    }

    lower = (layer) => {
        this.original_layer.lower(layer);
    }

    // setup = (viewer, ele) => {
    //     document.getElementsByName("baselayer").forEach( layer => {
    //         layer.addEventListener("change", this._eventListerner_changeBaseLayer);
    //     });

    //     document.getElementsByName("overlay").forEach( layer => {
    //         layer.addEventListener("change", this._eventListerner_changeOverlayLayer);
    //     });
    // }

    // _eventListerner_changeBaseLayer = (baselayer) => {
    //     const purpose_layer = this.baselayers.find(item => item.options.name === baselayer.target.value);
    //     this.bottomlayer = purpose_layer;
    //     this._update();
    // }

    // _eventListerner_changeOverlayLayer = (overlaylayer) => {
    //     const purpose_layer = this.overlaylayers.find(item => item.layer.options.name === overlaylayer.target.value);
    //     purpose_layer.show = overlaylayer.target.checked;
    //     this._update();
    // }

    // _update = () => {
    //     console.log(this.bottomlayer);
    //     console.log(this.original_layer);
    //     this.original_layer.removeAll(false);
    //     this.original_layer.add(this.bottomlayer, 0);
    //     this.overlaylayers.forEach( ( layer, index ) => {
    //         if ( layer.show && layer.layer.options.name !== this.bottomlayer.options.name ) {
    //             this.original_layers.add(layer.layer, index + 1);
    //         }
    //     });
    // }
}

export default layerManager3D;