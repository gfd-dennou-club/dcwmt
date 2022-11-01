const viewerProjection = (viewer_ele, options) => {
    const getProjection = ol.proj.get;
    const register = ol.proj.proj4.register;
    const getCenter = ol.extent.getCenter;

    // 正距方位図法
    proj4.defs("ESRI:54032","+proj=aeqd +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    // proj4.defs("ESRI:54032","+proj=aeqd +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs +type=crs");
    // モルワイデ図法
    proj4.defs("ESRI:54009","+proj=moll +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    // サンソン図法(正弦曲線図法)
    proj4.defs("ESRI:54008","+proj=sinu +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    register(proj4);

    const proj3857 = getProjection('EPSG:3857');
    const proj54032 = getProjection('ESRI:54032');
    proj54032.setExtent([-21e6, -21e6, 21e6, 21e6]);
    // proj54032.setExtent([-20e6, -20e6, 20e6, 20e6]);
    // const minBound = ol.proj.fromLonLat([-45, -145], proj54032);
    // const maxBound = ol.proj.fromLonLat([135, -145], proj54032);
    // proj54032.setExtent([...minBound, ...maxBound]);
    const proj54009 = getProjection('ESRI:54009');
    proj54009.setExtent([-18e6, -9e6, 18e6, 9e6]);
    const proj54008 = getProjection('ESRI:54008');
    proj54008.setExtent([-18e6, -9e6, 18e6, 9e6]);

    const projections = [
        {name: "メルカトル図法", proj: proj3857},
        {name: "正距方位図法", proj: proj54032},
        {name: "モルワイデ図法", proj: proj54009},
        {name: "サンソン図法", proj: proj54008},
    ];
    
    const projection = proj3857;

    const tileGrid = ol.tilegrid.createXYZ({
    	extent: projection.getExtent(),
	maxZoom: options.maxLevel,
	minZoom: options.minLevel,
    });

    const view1 = new ol.View({
        projection: projection,
	resolutions: tileGrid.getResolutions(),
        center: getCenter(projection.getExtent() || [0, 0, 0, 0]),
    	resolution: tileGrid.getResolution(options.minLevel),
	multiWorld: true,
    });

    const map = new ol.Map({
        target: viewer_ele,
        view: view1
    });
    map.projections = projections;

    map.setView(view1);

    return map;
};
