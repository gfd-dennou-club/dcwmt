import tileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { get } from "ol/proj";
import { createXYZ } from "ol/tilegrid";
import WMTS from "ol/tilegrid/WMTS";

const layerProjection = class extends tileLayer{
    constructor(options){
        super({});
        this.options = options;

        const projection = get('EPSG:3857');

        const defaultTileGrid = createXYZ({
            extent: projection.getExtent(),
            minZoom: this.options.minZoom,
            maxZoom: this.options.maxZoom,
        });

        const tilegrid_options = {
            origin: defaultTileGrid.getOrigin(0),
            resolutions: defaultTileGrid.getResolutions(),
            tileSize: [
                this.options.size.X,
                this.options.size.Y
            ],
        };

        const tileGrid = new WMTS(tilegrid_options);

        const xyz_options = {
            tileUrlFunction: this._tileUrlFunction,
            tileLoadFunction: this._tileLoadFunction,
            projection: projection.getCode(),
            tileGrid: tileGrid,
            wrapX: true,
        };

        const source = new XYZ(xyz_options);
        this.setExtent(projection.getExtent());
        this.setSource(source);
    }

    _tileUrlFunction = (coord) => {
        const Z = 0, X = 1, Y = 2;
        const url = this.options.url.map(v => v.concat(`/${coord[Z]}/${coord[X]}/${coord[Y]}.png`));
        return url;
    }

    _tileLoadFunction = async (imageTile, url) => {
        const canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [this.options.size.X, this.options.size.Y];

        const toneFunc = async () => {
            await this.options.diagram.url2canvas(url[0], canvas);
        }

        const vectorFunc = async () => {
            await this.options.diagram.urls2canvas(url, canvas);
        }

        await this.options.diagram.isTone(toneFunc, vectorFunc)();
        imageTile.getImage().src = canvas.toDataURL();
    }
}

export default layerProjection;
