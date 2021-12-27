const viewerProjection = (viewer_ele, baselayers, overlaylayers, options) => {
    // proj4.defs('ESRI:54009','+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' + '+units=m +no_defs');
    // ol.proj.proj4.register(proj4);
    // const proj32662 = ol.proj.get('EPSG:54009');
    
    const olMap = new ol.Map({
        target: viewer_ele,
        layers: [baselayers[0]],
        view: new ol.View({
            center: ol.extent.getCenter([-18e6, -9e6, 18e6, 9e6]),
            zoom: 0,
            // projection: proj32662,
            //extent: [-18e6, -9e6, 18e6, 9e6],
        })
    })
};
