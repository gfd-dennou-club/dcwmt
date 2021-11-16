const VectorDiagram = class{
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

    data2canvas = (datas, canvas, dencityOfVector, sizeOfVector) => {
        const ctx = canvas.getContext("2d");

        // ベクトルの描画設定
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#000000";
        ctx.font = "bold 9px 'Arial'";

        // canvas内のベクトルの数を取得
        let numOfVectorInCanvas = {x: 0, y: 0};
        numOfVectorInCanvas.x = canvas.width / dencityOfVector.x;
        numOfVectorInCanvas.y = canvas.height / dencityOfVector.y;

        // canvas内のベクトルの数分だけ回す
        for(let y = 0; y < canvas.height; y+=numOfVectorInCanvas.y){
            for(let x = 0; x < canvas.width; x+=numOfVectorInCanvas.x){
                // 指定したベクトルのサイズの区画全ての値を加算し, 平均値を求める.
                let means = new Array(2).fill(0);
                for(let dy = y; dy < y + numOfVectorInCanvas.y; dy++){
                    for(let dx = x; dx < x + numOfVectorInCanvas.x; dx++){
                        for(let i = 0; i < 2; i++){ means[i] += datas[i][dy * canvas.height + dx]; }
                    }
                }

                means = means.map(mean => mean / (numOfVectorInCanvas.x * numOfVectorInCanvas.y));

                // ベクトルを描画
                ctx.beginPath();
                let startPoint = {x: 0, y: 0};
                let endPoint = {x: 0, y: 0};
                // 矢印(<-)の制御点
                const arrow = {
                    length: 3, // <- の - の長さ
                    bold: 1,    // <- の - の太さ
                    width: 3,   // <- の < の横幅
                }
                const controlPoint = [0, arrow.bold, -arrow.length, arrow.bold, -arrow.length*1.5, arrow.width];
                [startPoint.x, startPoint.y]    = [x+numOfVectorInCanvas.x*0.5, y+numOfVectorInCanvas.y*0.5];
                [endPoint.x, endPoint.y]        = [startPoint.x + means[0]*sizeOfVector.width, startPoint.y - means[1]*sizeOfVector.height];
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
                    ctxs[index].drawImage(img, 0, 0);
                    resolve();
                }
                img.src = url;                                     // 描画用キャンバスに画像を描画
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

        const dencityOfVector = {x: 20, y: 20};
        const sizeOfVector = {width: 5, height: 5};
        this.data2canvas(datas, canvas, dencityOfVector, sizeOfVector);
    }

    urls2tile = async (urls, canvas) => {
        await this.urls2canvas(urls, canvas);
        const ctx = canvas.getContext("2d");
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    isCounter = (t, f) => { return f; }
}