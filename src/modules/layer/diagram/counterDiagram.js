import * as contour from "d3-contour";
import { geoPath, geoIdentity } from "d3-geo";

const contourDiagram = class {
    constructor(options) {
        this.options = options;
    }
    
    url2tile = async ( url, canvas ) => {
        canvas = await this.url2canvas( url, canvas );
        const ctx = canvas.getContext("2d");
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    url2canvas = async ( url, canvas ) => {
        const ctx = canvas.getContext("2d");

        const promise = new Promise( resolve => {
            const img = new Image();
            img.crossOrigin = "anonymous";
            [img.width, img.height] = [canvas.width, canvas.height];

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                this.bitmap2tile(canvas);
                resolve();
            }

            img.src = url;
        });

        await promise;
        return canvas;
    }

    bitmap2tile = ( canvas ) => {
        const ctx = canvas.getContext("2d");
        
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const size = { width: canvas.width, height: canvas.height };
        const datas = this.bitmap2data( imageData, size );

        const projection = geoIdentity().scale(1);
        const path = geoPath(projection, ctx);
        const split = 10;
        const min = this.options.min;
        const max = this.options.max;
        const thresholds = new Array(split).fill(0).map((_, i) => {
            return min + ( (max - min) / split ) * i;
        });

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.lineWidth = 1.5;

        for ( const threshold of thresholds ) {
            ctx.beginPath();
            const contours = contour.contours().size([size.width, size.height]);
            const object = contours.contour(datas, threshold);
            path( object );
            ctx.stroke();
            ctx.closePath();
        }
    }

    bitmap2data = ( imageData, size ) => {
        const rgba = imageData.data;
        const dataView = new DataView( new ArrayBuffer(32) );
        const scalarData = new Array();

        for ( let i = 0; i < size.width * size.height; i++ ){
            const bias_rgb_index = i * 4;
            const red   = rgba[ bias_rgb_index     ] << 24;
            const green = rgba[ bias_rgb_index + 1 ] << 16;
            const blue  = rgba[ bias_rgb_index + 2 ] << 8;

            dataView.setUint32(0, red + green + blue );
            scalarData.push(dataView.getFloat32(0));
        }

        return scalarData;
    }

    isTone = (t=true, f=false) => { return t; }
}

export default contourDiagram;
