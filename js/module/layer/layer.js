const Layer = class{
    // options: {
    //     name: String,
    //     url: [String, ...],
    //     maximumLevel: Number,
    //     minimumLevel: Number,
    //     clrindex: Number,
    //     opacity: Number,
    // };
    constructor(options){
        this.options = options;
    }

    changeOpacity = (opacity) => { this.options.opacity = opacity; }
    changeClrindex = (clrindex) => { this.options.clrindex = clrindex; }

    create = (display_name) => {
        const clrmap = new colormap(this.options.clrindex);
        const diagram = this._getDiagram(clrmap, this.options.opacity);
        diagram.calcMaxMin(this.options.url[0].concat("/0/0/0.png"));
        const layer = this._getLayerWithSuitableLib(display_name, diagram);
        return layer;
    }

    _getDiagram = (clrmap, opacity) => {
        if(this.options.url.length === 2){
            return new VectorDiagram(clrmap.getClrmap());
        }else{
            return new CounterDiagram(clrmap.getClrmap(), opacity);
        }
    }

    _getLayerWithSuitableLib = (display_name, diagram) => {
        switch(display_name){
            case "Cesium":      return this._for3D(diagram);
            case "Leaflet":     return this._forCartesian(diagram);
            case "OpenLayers":  return this._forProjection(diagram);
        }
    }

    _for3D = (diagram) => {
        const options = {
            url: this.options.url,
            tileHeight: this.options.size.Y,
            tileWidth: this.options.size.X,
            maximumLevel: this.options.muximumLevel,
            minimumLevel: this.options.minimumLevel,
            diagram: diagram,
        };
        return new layer3D(options);
    }

    _forCartesian = (diagram) => {
        const options = {
            url: this.options.url,
            size: this.options.size,
            diagram: diagram,
            name: this.options.name,
        };
        return layerCartesian(options);
    }

    _forProjection = (diagram) => {
        const options = {
            url: this.options.url,
            size: this.options.size,
            diagram: diagram,
            maxZoom: this.options.maximumLevel,
            minZoom: this.options.minimumLevel,
            name: this.options.name,
        }
        return new layerProjection(options);
    }
}