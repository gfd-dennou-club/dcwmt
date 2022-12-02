import viewer3D from './lib/viewer3D.js';
import viewerCartesian from './lib/viewerCartesian.js';
import viewerProjection from './lib/viewerProjection.js';

import map from './map.js';

const viewer = class{
    // options: { 
    //     wmtsLibIdentifer: wmtsLibIdentifer, 
    //     maximumLevel: Number
    // }
    constructor(options){
        this.options = options;
    }

    getSuitableViewer = () => {
        const map_obj = new map("map");
        map_obj.create();
        const map_ele = map_obj.getElement();

        const zoomNativeLevel = this.options.zoomNativeLevel;
        return this._getViewerWithSuitableLib(map_ele, zoomNativeLevel);
    }

    _getViewerWithSuitableLib = (map_ele, zoomNativeLevel) => {
        const ceisum = () => this._for3D(map_ele);
        const leaflet = () => this._forCartesian(map_ele, zoomNativeLevel);
        const openlayers = () => this._forProjection(map_ele, zoomNativeLevel);
        const suitableFunc = this.options.wmtsLibIdentifer.whichLib(ceisum, leaflet, openlayers);
        return suitableFunc();
    }

    _for3D = (map_ele) => { 
        return viewer3D(map_ele); 
    }

    _forCartesian = (map_ele, maximumLevel) => {
        const options = { maximumLevel: maximumLevel, minimumLevel: 0 };
        return viewerCartesian(map_ele, options); 
    }

    _forProjection = (map_ele, zoomNativeLevel) => {
        const options = { 
            projection: this.options.projection, 
            zoomNativeLevel: zoomNativeLevel,
            zoom: this.options.zoom,
            center: this.options.center
        }; 
        return viewerProjection(map_ele, options);
    }
}

export default viewer;
