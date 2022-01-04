const viewerProjection = (viewer_ele) => {
    return new ol.Map({
        target: viewer_ele,
        view: new ol.View({
            center: ol.extent.getCenter([-18e6, -9e6, 18e6, 9e6]),
            zoom: 0,
        })
    })
};
