const contourDiagram = class {
    
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
                this.canvas2bitmap(canvas);
                resolve();
            }

            img.src = url;
        });

        await promise;
        return canvas;
    }

    canvas2bitmap = ( canvas ) => {
        const ctx = canvas.getContext("2d");
        const imageData = this.bitmap2tile(canvas);
        ctx.putImageData(imageData, 0, 0);
    }

    bitmap2tile = ( canvas ) => {
        const ctx = canvas.getContext("2d");

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const size = { width: canvas.width, height: canvas.height };
        let datas = this.bitmap2data( imageData, size );
        const meanFunc = (sum, prev, _, {length}) => sum + prev / length;
        const mean = datas.reduce(meanFunc);
        datas = datas.map( data => data - mean );

        const onRightEdge = i => ( i + 1 )%size.width == 0;
        const onBottomEdge = i => (i / size.height ) >= ( size.height - 1 );

        const center = i => datas[i];
        const right = i => datas[i+1];
        const bottom = i => datas[i+size.width];
        const rightbottom = i => datas[i+size.width + 1];

        for (let i = 0; i < size.width * size.height; i++ ) {
            const bias_rgb_index = i * 4;

            
            if ( onRightEdge(i) || onBottomEdge(i) ) {
                continue;
            }

            if ( 
                ( center(i) !== right(i)  ) ||
                ( center(i) !== bottom(i) ) ||
                ( center(i) !== rightbottom(i) )
               )
            {
                imageData.data[ bias_rgb_index     ] = 0;
                imageData.data[ bias_rgb_index + 1 ] = 0;
                imageData.data[ bias_rgb_index + 2 ] = 0;
                imageData.data[ bias_rgb_index + 3 ] = 255;
            }
        }

        return imageData;
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
