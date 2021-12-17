const viewerProjection = (option) => {
    proj4.defs('ESRI:54009','+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 ' + '+units=m +no_defs');
    ol.proj.proj4.register(proj4);
    const proj32662 = ol.proj.get('EPSG:54009');
    
    const olMap = new ol.Map({
        target: option.map,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    tileUrlFunction: (coord) => {
                        const Z = 0, X = 1, Y = 2;
                        const url = option.url.concat(`/${coord[Z]}/${coord[X]}/${coord[Y]}.png`);
                        const urls = option.urls.map(url => url.concat(`/${coord[Z]}/${coord[X]}/${coord[Y]}.png`));
                        return option.diagram.isCounter([url], urls);
                    },
                    tileLoadFunction: async (imageTile, urls) => {
                        let canvas = document.createElement("canvas");
                        [canvas.width, canvas.height] = option.diagram.isCounter([256, 256], [320, 320]);
                    
                        const counterFunc = async function(){
                            canvas = await option.diagram.url2canvas(urls[0], canvas);
                        };

                        const vectorFunc = async function(){
                            await option.diagram.urls2canvas(urls, canvas);
                        };

                        await option.diagram.isCounter(counterFunc, vectorFunc)();

                        imageTile.getImage().src = canvas.toDataURL("image/png");
                    },
                    maxZoom: option.diagram.isCounter(2, 1),
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
