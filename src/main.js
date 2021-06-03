import {DEFINE} from './define.js';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import * as Cesium from 'cesium/Cesium';
window.Cesium = Cesium;
import OLCesium from 'olcs/OLCesium.js';

const ol2dMap = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new XYZ({
                crossOrigin: null,
                url: `${DEFINE.ROOT}/Ps/time=32112/{z}/{x}/{y}.png`
            }),
        }),
    ],
    view: new View({
        center: [0, 0],
        zoom: 3,
    })
})

const ol3d = new OLCesium({map: ol2dMap});
ol3d.setEnabled(true);
