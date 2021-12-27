const layerProjection = class extends ol.layer.Tile{
    constructor(options){
        super({});
        this.options = options;

        const xyz_options = {
            tileUrlFunction: this.tileUrlFunction,
            tileLoadFunction: this.tileLoadFunction,
            maxZoom: this.options.maxZoom,
            minZoom: this.options.minZoom,
            wrapX: false,
            noWrap: true,
        };
        const source = new ol.source.XYZ(xyz_options);
        this.setSource(source);
    }

    tileUrlFunction = (coord) => {
        const Z = 0, X = 1, Y = 2;
        const url = this.options.url.map(v => v.concat(`/${coord[Z]}/${coord[X]}/${coord[Y]}.png`));
        return url;
    }

    tileLoadFunction = async (imageTile, url) => {
        const canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [this.options.size.X, this.options.size.Y];

        const counterFunc = async () => {
            await this.options.diagram.url2canvas(url[0], canvas);
        }

        const vectorFunc = async () => {
            await this.options.diagram.urls2canvas(url, canvas);
        }

        await this.options.diagram.isCounter(counterFunc, vectorFunc)();
        imageTile.getImage().src = canvas.toDataURL();
    }
}