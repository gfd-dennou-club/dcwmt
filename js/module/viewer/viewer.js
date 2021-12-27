const Viewer = class{
    // options: { 
    //     display_name: String, 
    //     counter: [{
    //         name: String, 
    //         url: [String], 
    //         size: {X: Number, Y: Number},
    //     }, ...], 
    //     vector: [{
    //         name: String (for example: VelX-VelY), 
    //         url: [["String", "String"], ...],
    //         size: {X: Number, Y: Number},
    //     }, ...], 
    //     maximumLevel: Number
    // }
    constructor(options){
        this.display_name = options.display_name;
        this.map = new Map("map");
        this.maximumLevel = options.maximumLevel;

        this.baselayers = [];
        this.overlaylayers = [];

        const layer_types = [options.counter, options.vector];
        layer_types.forEach((layer_type) => {
            layer_type.forEach((layer) => {
                const options_for_layer = {
                    name: layer.name,
                    url: layer.url,
                    size: layer.size,
                    maximumLevel: this.maximumLevel,
                    minimumLevel: 0,
                    clrindex: 4,
                    opacity: 255,
                };
                const layer_instance = new Layer(options_for_layer);
                this.baselayers.push(layer_instance);
                this.overlaylayers.push(layer_instance);
            });
        });
    }

    draw = () => {
        this.map.create();
        const viewer = this._getViewerFuncWithSuitableLib();
        viewer(
            this.map.getElement(),
            this.baselayers.map(layer => layer.create(this.display_name)),
            this.overlaylayers.map(layer => layer.create(this.display_name)),
            { maximumLevel: this.maximumLevel, minimumLevel: 0 },
        );
    }

    _getViewerFuncWithSuitableLib = () => {
        switch(this.display_name){
            case "Cesium":      return viewer3D;
            case "Leaflet":     return viewerCartesian;
            case "OpenLayers":  return viewerProjection;
        }
    }

    addBaseLayer = (layer) => {
        if(layer instanceof Array){
            Array.prototype.push.apply(this.baselayers, layer);
        }else if(layer instanceof Layer){
            this.baselayers.push(layer);
        }else{
            console.error("Please pass an instance of Array or Layer to argument of addBaseLayer function !");
        }
    }

    addOverlayLayer = (layer) => {
        if(layer instanceof Array){
            Array.prototype.push.apply(this.overlaylayers, layer);
        }else if(layer instanceof Layer){
            this.overlaylayers.push(layer);
        }else{
            console.error("Please pass an instance of Array or Layer to argument of addOverlayLayer function !");
        }
    }

    getDisplayName = () => { return this.display_name; }
} 