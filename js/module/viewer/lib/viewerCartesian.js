const viewerCartesian = (viewer_ele, baselayers, overlaylayers, options) => {
    const viewer  = L.map(
        viewer_ele,
        {
            preferCanvas: true, // Canvasレンダラーを選択
            center:     [0, 0],
            crs:        L.CRS.Simple,
            maxZoom:    options.maximumLevel,
            minZoom:    options.minimumLevel,
            zoom:       0,
        }
    );

    // レイヤをまとめておく変数を用意
    const layers = new L.control.layers();

    baselayers.forEach(layer => { layers.addBaseLayer(layer, layer.getName()); });
    overlaylayers.forEach(layer => { layers.addOverlay(layer, layer.getName()); });

    // mapにレイヤを追加
    layers.addTo(viewer);
}