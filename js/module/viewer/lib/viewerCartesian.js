const viewerCartesian = (map_ele, options) => {
    return L.map(
        map_ele,
        {
            preferCanvas: true, // Canvasレンダラーを選択
            center:     [0, 0],
            // crs:        L.CRS.Simple,
            maxZoom:    options.maximumLevel,
            minZoom:    options.minimumLevel,
            zoom:       0,
        }
    );
}