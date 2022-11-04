import * as olProj from "ol/proj";
import * as olExtent from "ol/extent";
import {View, Map} from "ol";
import proj4 from "proj4";
import {register} from "ol/proj/proj4";
import { createXYZ } from "ol/tilegrid";


const viewerProjection = (viewer_ele, options) => {
    const getProjection = olProj.get;
    const getCenter = olExtent.getCenter;

    // 正距方位図法
    proj4.defs("ESRI:54032","+proj=aeqd +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    // モルワイデ図法
    proj4.defs("ESRI:54009","+proj=moll +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    // サンソン図法(正弦曲線図法)
    proj4.defs("ESRI:54008","+proj=sinu +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    register(proj4);

    const projection = getProjection(options.projection.code);
    projection.setExtent( projection.getExtent() || options.projection.extent );

    const tileGrid = createXYZ({
        extent: projection.getExtent(),
        maxZoom: options.maxZoom,
        minZoom: options.minZoom,
    });

    const view = new View({
        projection: projection,
        resolution: tileGrid.getResolution(options.zoom || options.minZoom),
        resolutions: tileGrid.getResolutions(),
        center: options.center || getCenter(projection.getExtent() || [0, 0, 0, 0]),
        multiWorld: true,
    });

    const map = new Map({
        target: viewer_ele,
        view: view
    });

    map.setView(view);

    return map;
};

export default viewerProjection;
