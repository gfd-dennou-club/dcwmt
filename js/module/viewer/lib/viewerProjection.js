const viewerProjection = (map, diagram) => {
    proj4.defs('ESRI:54009','+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' + '+units=m +no_defs');
    ol.proj.proj4.register(proj4);
    const proj32662 = ol.proj.get('EPSG:54009');
    
    const olMap = new ol.Map({
        target: map,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: (coord) => {
                        const Z = 0, X = 1, Y = 2;
                        return diagram.isCounter(
                            [`${DEFINE.ROOT}/Ps/time=32112/${coord[Z]}/${coord[X]}/${coord[Y]}.png`],
                            [
                                `${DEFINE.ROOT}/VelX/1.4002e+06/z=47200/${coord[Z]}/${coord[X]}/${coord[Y]}.png`, 
                                `${DEFINE.ROOT}/VelY/1.4002e+06/z=51000/${coord[Z]}/${coord[X]}/${coord[Y]}.png`
                            ]
                        );
                    },
                    tileLoadFunction: async (imageTile, urls) => {
                        let canvas = document.createElement("canvas");
                        [canvas.width, canvas.height] = diagram.isCounter([256, 256], [320, 320]);
                    
                        const counterFunc = async function(){
                            const isLevel0 = imageTile.tileCoord[0] === 2;
                            canvas = await diagram.url2canvas(urls[0], canvas, isLevel0);
                        };

                        const vectorFunc = async function(){
                            await diagram.urls2canvas(urls, canvas);
                        };

                        await diagram.isCounter(counterFunc, vectorFunc)();

                        imageTile.getImage().src = canvas.toDataURL("image/png");
                    },
                    maxZoom: diagram.isCounter(2, 1),
                    minZoom: 0,
                    wrapX: false,
                    noWrap: true,
                }),
            })
        ],
        view: new ol.View({
            center: ol.extent.getCenter([-18e6, -9e6, 18e6, 9e6]),
            zoom: 0,
            projection: proj32662,
            extent: [-18e6, -9e6, 18e6, 9e6],
        })
    })
};
