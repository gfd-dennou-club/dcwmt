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

    create = async (wmtsLibIdentifer) => {
        const options = this.options;
        const clrmap = new colormap(options.clrindex);
        if ( !options.diagram ) {
            this.diagram = this._getDiagram(clrmap);
            if ( this.diagram.isTone() ) {
                const url = options.url[0].concat("/0/0/0.png");
                const size = options.size;
                this.maxmin = await this.diagram.calcMaxMin(url, size);
            }
        } else {
            this.diagram = options.diagram;
        }
        
        return this._getLayerWithSuitableLib(wmtsLibIdentifer, this.diagram);
    }

    getProps = () => {
        if ( this.maxmin ){
            const maxmin = this.maxmin;
            return { name: this.options.name, max: maxmin.max, min: maxmin.min };
        } else {
            return undefined;
        }
    }

    _getDiagram = (clrmap) => {
        if(this.options.url.length === 2){
            return new vectorDiagram(clrmap.getClrmap());
        }else{
            return new toneDiagram(
                clrmap.getClrmap(), 
                this.options.range,
                this.options.math_method
            );
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
