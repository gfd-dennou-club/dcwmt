import { UrlTemplateImageryProvider } from "cesium";

const layer3D = class extends UrlTemplateImageryProvider{
    constructor(options){
        super(options);
        this._maximumLevel = options.maximumLevel;
        this._minimumLevel = options.minimumLevel;
        this._diagram = options.diagram;
        this._name = options.name; 
    }

    // override
    requestImage(x, y, level){
        const urls = [];
        this._resource.forEach((ele) => {
            const url = ele.concat(`/${level}/${x}/${y}.png`);
            urls.push(url);
        });

        const canvas = document.createElement("canvas");
        [canvas.width, canvas.height] = [this._tileWidth, this._tileHeight];

        const toneFunc = () => {
            return this._diagram.url2tile(urls[0], canvas);
        }

        const vectorFunc = () => {
            return this._diagram.urls2tile(urls, canvas);
        }

        return this._diagram.isTone(toneFunc, vectorFunc)();
    }

}

export default layer3D;