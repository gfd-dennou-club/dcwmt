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

    get = (wmtsLibIdentifer) => {
        const clrmap = new colormap(this.options.clrindex);
        const diagram = this._getDiagram(clrmap, this.options.opacity);
        
        const path = this.options.url[0].concat("/0/0/0.png");
        const size = this.options.size;
        diagram.calcMaxMin(path, size);
        
        const layer = this._getLayerWithSuitableLib(wmtsLibIdentifer, diagram);
        return layer;
    }

    _getDiagram = (clrmap, opacity) => {
        if(this.options.url.length === 2){
            return new VectorDiagram(clrmap.getClrmap());
        }else{
            return new ToneDiagram(clrmap.getClrmap(), opacity);
        }
    }

    _getLayerWithSuitableLib = (wmtsLibIdentifer, diagram) => {
        const cesium = this._for3D(diagram);
        const leaflet = this._forCartesian(diagram);
        const openlayers = this._forProjection(diagram);
        return wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
    }

    _for3D = (diagram) => {
        const options = {
            url: this.options.url,
            tileHeight: this.options.size.Y,
            tileWidth: this.options.size.X,
            maximumLevel: this.options.maximumLevel,
            minimumLevel: this.options.minimumLevel,
            diagram: diagram,
            name: this.options.name,
        };
        return new layer3D(options);
    }

    _forCartesian = (diagram) => {
        const options = {
            url: this.options.url,
            size: this.options.size,
            diagram: diagram,
            maxZoom: this.options.maximumLevel,
            minZoom: this.options.minimumLevel,
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