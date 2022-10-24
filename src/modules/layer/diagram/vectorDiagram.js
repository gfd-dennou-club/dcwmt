const vectorDiagram = class{
    constructor(colormap){
        this.colormap = colormap;
    }

    /**
     * 画像の色の明度と透過度および最小値と最大値を取得
     *
     * @param {HTMLElement<Canvas>} canvas
     */
    bitmap2data = (canvas) => {
        const ctx = canvas.getContext("2d");

        const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let red, green, blue;
        let dataView = new DataView(new ArrayBuffer(32));
        let scalarData = new Array();

        for(let i = 0; i < canvas.width * canvas.height; i++){
            const bias_rgb_index = i * 4;
            red   = rgba[bias_rgb_index    ] << 24;
            green = rgba[bias_rgb_index + 1] << 16;
            blue  = rgba[bias_rgb_index + 2] << 8;

            dataView.setUint32(0, red + green + blue);
            scalarData[i] = dataView.getFloat32(0);
        }

        return scalarData;
    }

    data2canvas = (datas, canvas, dencityOfVectorInCanvas) => {
        const HORIZON = 0, VERTICAL = 1;
        const ctx = canvas.getContext("2d");

        // 1つのベクトルを描画するためのブロックのサイズを計算
        const blockSizeForDrawingVector = { 
            x: canvas.width / dencityOfVectorInCanvas.x, 
            y: canvas.height / dencityOfVectorInCanvas.y,
        };

        // ブロックごとで平均を計算して, 配列にする
        let meanOfBlockArrays = new Array(2).fill(0).map((_, direction) => 
            new Array( dencityOfVectorInCanvas.x * dencityOfVectorInCanvas.y ).fill(0).map((_, i) => {
                const startPoint = {
                    x: ( ( i * blockSizeForDrawingVector.x ) % canvas.width ) / blockSizeForDrawingVector.x,
                    y: Math.floor( ( i * blockSizeForDrawingVector.x ) / canvas.width )
                };

                let applicable_array = new Array();
                for ( let y = 0; y < blockSizeForDrawingVector.y; y++ ) {
                    const slice = {
                        start:  ( startPoint.x * blockSizeForDrawingVector.x ) + ( startPoint.y * blockSizeForDrawingVector.y + y ) * canvas.width,
                        end:    ( (startPoint.x + 1) * blockSizeForDrawingVector.x ) + ( startPoint.y * blockSizeForDrawingVector.y + y ) * canvas.width,
                    };
                    const xSlicedArray = datas[direction].slice(slice.start, slice.end);
                    applicable_array = applicable_array.concat(xSlicedArray);
                }
                const mean = applicable_array.reduce((accumulator, current, _, { length }) => accumulator + current / length );
                return mean;
            }
        ));

        // 正規化をするために絶対値の最大値を計算
        const max = meanOfBlockArrays.map(datas => Math.max(...datas.map(Math.abs)) );

        // -1〜1の範囲に正規化する.
        meanOfBlockArrays = meanOfBlockArrays.map( ( datas, direction ) => 
            datas.map( data => data / max[direction] )
        );

        // ブロックごとにベクトルを描画していく
        for ( let y = 0; y < dencityOfVectorInCanvas.y; y++ ) {
            for (let x = 0; x < dencityOfVectorInCanvas.x; x++ ) {
                const halfOfBlockSize = {
                    x: blockSizeForDrawingVector.x / 2,
                    y: blockSizeForDrawingVector.y / 2,
                };

                ctx.beginPath();
                const arrow = {
                    length: 3,  // <- の - の長さ
                    bold: 1,    // <- の - の太さ
                    width: 3,   // <- の < の横幅
                }
                // ベクトルの始点: 各ブロックの中点
                const startPoint = {
                    x: ( x * blockSizeForDrawingVector.x ) + halfOfBlockSize.x,
                    y: ( y * blockSizeForDrawingVector.y ) + halfOfBlockSize.y,
                };
                // ベクトルの終点: ベクトルの長さ <= ブロックの半分の長さ
                const endPoint = {
                    x: startPoint.x + ( meanOfBlockArrays[HORIZON][x + ( y * dencityOfVectorInCanvas.x )] * halfOfBlockSize.x ),
                    y: startPoint.y + ( meanOfBlockArrays[VERTICAL][x + ( y * dencityOfVectorInCanvas.x )] * halfOfBlockSize.y ),
                }
                const controlPoint = [ 0, arrow.bold, -arrow.length, arrow.bold, -arrow.length, arrow.width ];

                ctx.arrow(startPoint.x, startPoint.y, endPoint.x, endPoint.y, controlPoint);
                ctx.fill();
            }
        }
    }

    urls2bitmaps = async (urls, canvas) => {
        // 描画用キャンバス
        const canvases = new Array(urls.length).fill(undefined).map(() => document.createElement("canvas"));
        canvases.forEach(_canvas => [_canvas.width, _canvas.height] = [canvas.width, canvas.height]);
        const ctxs = new Array(urls.length).fill(undefined).map((_, i) => canvases[i].getContext("2d"));
        const promises = new Array();

        urls.forEach( (url, index) => {
            const promise = new Promise(resolve => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                [img.width, img.height] = [canvas.width, canvas.height];
                img.onload = () => {
                    ctxs[index].drawImage( img, 0, 0 );
                    resolve();
                }
                img.src = url; // 描画用キャンバスに画像を描画
            })
            promises.push(promise);
        });

        await Promise.all(promises);
        return canvases;
    }

    urls2canvas = async (urls, canvas) => {
        // 画像の読み込み(bitmapの取得)
        const bitmaps = await this.urls2bitmaps(urls, canvas);

        // 数値データ群の取得(dataの取得)
        const datas = bitmaps.map(bitmap => this.bitmap2data(bitmap));

        const dencityOfVectorInCanvas = { x: 8, y: 8 };
        this.data2canvas(datas, canvas, dencityOfVectorInCanvas);
    }

    urls2tile = async (urls, canvas) => {
        await this.urls2canvas(urls, canvas);
        const ctx = canvas.getContext("2d");
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    calcMaxMin = (url) => {}

    isTone = (t=true, f=false) => { return f; }
}

export default vectorDiagram;