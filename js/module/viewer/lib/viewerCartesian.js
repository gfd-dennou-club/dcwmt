const viewerCartesian = (viewer_ele, baselayers, overlaylayers, options) => {
    const view  = L.map(
        viewer_ele,
        {
            preferCanvas: true, // Canvasレンダラーを選択
            center:     [0, 0],
            crs:        L.CRS.Simple,
            maxZoom:    options.maxLevel,
            minZoom:    options.miniLevel,
            zoom:       0,
        }
    )

    // レイヤをまとめておく変数を用意
    let layers = new L.control.layers();

    baselayers.forEach(layer => { layers.addBaseLayer(layer, layer.getName()); });
    overlaylayers.forEach(layer => { layers.addOverlay(layer, layer.getName()); });
   
    // mapにレイヤを追加
    layers.addTo(view);
}