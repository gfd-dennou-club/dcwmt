import { View } from 'ol';
import { getCenter } from 'ol/extent';

const layerManagerProjection = class {
    constructor(original_layer){
        this.original_layer = original_layer;
        this.original_layers = original_layer.getLayers();
        this.layers = [];
        this.baselayers = [];
    }

    addBaseLayer = (layer, name) => {
        layer.name = name;
        layer.isBaseLayer = true;
        if ( this.baselayers.length === 0 ) {
            this.layers.push(layer);
        }
        this.baselayers.push(layer);
        

        // this.original_layer.addLayer(layer);
        // this.baselayers.push(layer);
        // if ( this.bottomlayer === undefined ) {
        //     this.bottomlayer = layer;
        // }
    }

    addLayer = (layer, name, alpha, show) => {
        layer.name = name;
        layer.alpha = alpha;
        layer.show = show;
        layer.isBaseLayer = false;
        this.original_layer.addLayer(layer);
        this.layers.push(layer);
    }

    getLayers = () => {
        return this.layers;
    }

    getBaseLayers = () => {
        return this.baselayers;
    }

    setup = () => { }

    update = () => {
        console.log("Start: update")
        console.log(this.layers.map(v => v.name));
        this.layers.splice(0, this.layers.length);
        const ary = this.original_layers.getArray();
        ary.forEach( layer => {
            this.layers.push(layer);
        });
        console.log(this.layers.map( v => v.name ));
        console.log("End: update")

        

        // document.getElementsByName("baselayer").forEach( layer => {
        //     layer.addEventListener("change", this._eventListerner_changeBaseLayer);
        // });

        // document.getElementsByName("overlay").forEach( layer => {
        //     layer.addEventListener("change", this._eventListerner_changeOverlayLayer);
        // });

        // document.getElementsByName("projection").forEach( proj => {
        //     proj.addEventListener("change", this._eventListerner_changeProjection);
        // });
    }

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
        ary.forEach( (_layer, index) => {
            if ( index > 0 && _layer === layer) {
                ary.remove(layer);
                ary.insertAt(index - 1, layer);
            }
        });
        this.original_layer.setLayers(ary);
    }

    lower = (layer) => {
        const ary = this.original_layer.getLayers();
        console.log("Start: lower")
        console.log(ary.getArray().map( v => v.name ));
        console.log(layer);
        ary.forEach( (_layer, index) => {
            console.log(_layer);
            if ( index < ary.getLength() - 1 && _layer === layer) {
                ary.remove(layer);
                ary.insetAt(index + 1, layer);
            }
        });
        this.original_layer.setLayers(ary);
        console.log(ary.getArray().map( v => v.name ));
        console.log("End: lower")
    }

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

    // _eventListerner_changeProjection = (projection) => {
    //     const purpose_projection = this.original_layer.projections.find(item => item.name === projection.target.value).proj;

    //     const view = new View({
    //         projection: purpose_projection,
    //         extent: purpose_projection.getExtent() || [0, 0, 0, 0],
    //         center: getCenter(purpose_projection.getExtent() || [0, 0, 0, 0]),
    //         zoom: 0,
    //     });

    //     this.original_layer.setView(view);
    // }

    // _update = () => {
    //     this.original_layers.remove(this.bottomlayer);
    //     this.original_layers.push(this.bottomlayer);
    //     this.original_layers.forEach( layer => {
    //         if( !layer || layer.options.name === this.bottomlayer.options.name ) {
    //             return;
    //         } else {
    //             this.original_layers.remove(layer);
    //         }
    //     })

    //     this.overlaylayers.forEach( layer => {
    //         if ( layer.show && layer.layer.options.name !== this.bottomlayer.options.name ) {
    //             this.original_layers.push(layer.layer);
    //         }
    //     })
    // }
}   

export default layerManagerProjection;