import map from '../component/map.js';

import viewer3D from './lib/viewer3D.js';
import viewerCartesian from './lib/viewerCartesian.js';
import viewerProjection from './lib/viewerProjection.js';

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
        return this._getViewerWithSuitableLib(map_ele, 2);
    }

    _getViewerWithSuitableLib = (map_ele, maximumLevel) => {
        const ceisum = () => this._for3D(map_ele);
        const leaflet = () => this._forCartesian(map_ele, maximumLevel);
        const openlayers = () => this._forProjection(map_ele);
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

    _forProjection = (map_ele, maximumLevel) => {
        return viewerProjection(map_ele);
    }
}

export default viewer;