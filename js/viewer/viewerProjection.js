const viewerProjection = (map, diagram) => {
    const olMap = new ol.Map({
        target: map,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: (coord) => {
                        const Z = 0, X = 1, Y = 2;
                        if(diagram instanceof CounterDiagram){
                            return [`${DEFINE.ROOT}/Ps/time=32112/${coord[Z]}/${coord[X]}/${coord[Y]}.png`];
                        }else if(diagram instanceof VectorDiagram){
                            return [
                                `${DEFINE.ROOT}/VelX/1.4002e+06/z=47200/${coord[Z]}/${coord[X]}/${coord[Y]}.png`, 
                                `${DEFINE.ROOT}/VelY/1.4002e+06/z=51000/${coord[Z]}/${coord[X]}/${coord[Y]}.png`
                            ];
                        }
                    },
                    tileLoadFunction: async (imageTile, urls) => {
                        let canvas = document.createElement("canvas");
                        [canvas.width, canvas.height] = [256, 256];
                        // [canvas.width, canvas.height] = [320, 320];
                    
                        if(diagram instanceof CounterDiagram){
                            const isLevel0 = imageTile.tileCoord[0] === 2;
                            canvas = await diagram.url2canvas(urls[0], canvas, isLevel0);
                        }else if (diagram instanceof VectorDiagram){
                            await diagram.urls2canvas(urls, canvas);
                        }

                        imageTile.getImage().src = canvas.toDataURL("image/png");
                    },
                    maxZoom: 2,
                    minZoom: 0,
                })
            })
        ],
        view: new ol.View({
            center: [0, 0],
            zoom: 0,
        })
    })
};
