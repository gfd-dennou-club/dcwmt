import layer3D from "./lib/layer3D.js";
import layerCartesian from "./lib/layerCartesian.js";
import layerProjection from "./lib/layerProjection.js";

import colormap from "../utility/colormap/colormap.js";
import { toneDiagram, vectorDiagram } from "./diagram/diagram.js";

const layer = class{
    // options: {
    //     name: String,
    //     url: [String, ...],
    //     level: { min: Number, max: Number }
    //     clrindex: Number,
    //     opacity: Number,
    // };
    constructor(options){
        this.options = options;
    }

    create = (wmtsLibIdentifer) => {
        const clrmap = new colormap(this.options.clrindex);
        const diagram = this._getDiagram(clrmap, this.options.opacity);
        
        const url = this.options.url[0].concat("/0/0/0.png");
        const size = this.options.size;
        diagram.calcMaxMin(url, size);
        
        const layer = this._getLayerWithSuitableLib(wmtsLibIdentifer, diagram);
        return layer;
    }

    _getDiagram = (clrmap, opacity) => {
        if(this.options.url.length === 2){
            return new vectorDiagram(clrmap.getClrmap());
        }else{
            return new toneDiagram(clrmap.getClrmap(), opacity);
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
            maximumLevel: this.options.level.max,
            minimumLevel: this.options.level.min,
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
            maxZoom: this.options.level.max,
            minZoom: this.options.level.min,
            name: this.options.name,
        };
        return layerCartesian(options);
    }

    _forProjection = (diagram) => {
        const options = {
            url: this.options.url,
            size: this.options.size,
            diagram: diagram,
            maxZoom: this.options.level.max,
            minZoom: this.options.level.min,
            name: this.options.name,
        }
        return new layerProjection(options);
    }
}

export default layer;