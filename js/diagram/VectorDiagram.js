const VectorDiagram = class{
    constructor(colormap){
        this.colormap = colormap;
    }

    /**
     * 画像の色の明度と透過度および最小値と最大値を取得
     *
     * @param {HTMLElement<Canvas>} canvas
     */
    bitmap2data = canvas => {
        const ctx = canvas.getContext("2d");

        const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let red, green, blue;
        let dataView = new DataView(new ArrayBuffer(32));
        let scalarData = new Array();

        for(let i = 0; i < canvas.width * canvas*height; i++){
            const bias_rgb_index = i * 4;
            red   = rgba[bias_rgb_index    ] << 24;
            green = rgba[bias_rgb_index + 1] << 16;
            blue  = rgba[bias_rgb_index + 2] << 8;

            dataView.setUint32(0, red + green + blue);
            scalarData[i] = dataView.getFloat32(0);
        }

        return scalarData;
    }

    data2canvas = (datas, canvas, sizeOfVector) => {
        const ctx = canvas.getContext("2d");

        // ベクトルの描画設定
        ctx.strokeStyle = "rgb(0, 0, 0)";
        ctx.lineWidth = 1;
        ctx.fillStyle = "rgb(0, 0, 0)";
        ctx.font = "bold 9px 'Arial'";

        // canvas内のベクトルの数を取得
        let numOfVectorInCanvas = {x: 0, y: 0};
        numOfVectorInCanvas.x = canvas.width / sizeOfVector.width;
        numOfVectorInCanvas.y = canvas.height / sizeOfVector.height;

        // canvas内のベクトルの数分だけ回す
        for(let y = 0; y < numOfVectorInCanvas.y - 1; y++){
            for(let x = 0; x < numOfVectorInCanvas.x - 1; x++){
                // 指定したベクトルのサイズの区画全ての値を加算し, 平均値を求める.
                let means = Array(2).fill(0);
                for(let dy = y * sizeOfVector.height; dy < (y+1)*sizeOfVector.height; dy++){
                    for(let dx = x * sizeOfVector.width; dx <(x+1)*sizeOfVector.width; dx++){
                        means += datas.map(value => {value[dy * canvas.height + dx]})
                    }
                }
                means /= sizeOfVector.width * sizeOfVector.height;

                // ベクトルを描画
                ctx.beginPath();
                let startPoint, endPoint;
                [startPoint.x, startPoint.y]    = [x+numOfVectorInCanvas.x*0.5, y+numOfVectorInCanvas.y*0.5];
                [endPoint.x, endPoint.y]        = [startPoint.x + means[0], startPoint.y - means[1]];
                ctx.arrow(startPoint.x, startPoint.y, endPoint.x, endPoint.y, [0, 1, -5, 1, -10, 5]);
                ctx.fill();
            }
        }
    }

    urls2bitmaps = (urls, canvas) => {
        // 描画用キャンバス
        const canvases = Array(urls.length).map(() => document.createElement("canvas"));
        const ctxs = Array(urls.length).map((_, i) => canvases[i].getContext("2d"));

        // 読み込み用画像
        const imgs = Array(urls.length).map(() => new Image());
        for(let i = 0; i < imgs.length; i++)
            [imgs[i].width, imgs[i].height] = [canvas.width, canvas.height];
        
        return new Promise(resolve => {
            for(let i = 0; i < imgs.length; i++){
                // 画像読み込み完了時のイベントリスナをセット
                // 描画用キャンバスに画像を描画
                imgs[i].onload = () => { ctxs[i].drawImage(imgs[i], 0, 0);　}
                imgs[i].src = urls[i];
            }
            resolve(canvases);
        })
    }

    urls2canvas = async (urls, canvas) => {
        let bitmaps = undefined;

        // 画像の読み込み(bitmapの取得)
        await this.urls2bitmaps(urls, canvas).then(canvases => {
            bitmaps = canvases;
        });

        // 数値データ群の取得(dataの取得)
        const datas = Array(2).map((_, i) => {this.bitmap2data(bitmaps[i])});

        const sizeOfVector = {widht: 10, height: 10}
        this.data2canvas(datas, canvas, sizeOfVector);
    }
}