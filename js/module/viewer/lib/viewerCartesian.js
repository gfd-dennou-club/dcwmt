const viewerCartesian = (map_ele, options) => {
    return L.map(
        map_ele,
        {
            preferCanvas: true, // Canvasレンダラーを選択
            center:     [0, 0],
            // crs:        L.CRS.Simple,
            crs: L.Util.extend({}, L.CRS.Simple, {
              wrapLng: [0, tile_size_y]
            }),
            maxZoom:    options.maximumLevel,
            minZoom:    options.minimumLevel,
            zoom:       0,
        }
    );
}