//            [処理の流れ]
// url -> bitmap -> data -> (color -> tile) -> canvas
// 
//              [用語集]
// url:         画像のurl (string)
// bitmap:      画像を描画したcanvas (HTMLElement<canvas>)  
// data:        数値データ群 (Array(number))
// color:       数値データのrgb値 (Object{red, green, blue})
// tile:        数値データタイル (ImageData)
// canvas:      数値データタイルを描画したcanvas(HTMLElement<canvas>)

const toneDiagram = class{
    constructor(colormap, range, math_method){
        if ( !range ) {
            this.min = undefined;
            this.max = undefined;
        } else {
            this.min = range.min;
            this.max = range.max;
        }
        this.means = {
            mean: undefined,
            mean_x: undefined,
            mean_y: undefined,
        };

        this.colormap = colormap;
        this.math_method = math_method;
    }

    /**
     * 画像の色の明度と透過度および最小値と最大値を取得
     *
     * @param {HTMLElement<Image>} img データを取得したいhtml要素
     * @return {Object} 画像の色の明度および透過度, 最小値, 最大値
     */
    bitmap2data = (imageData, size) => {
        const rgba = imageData.data;
        let dataView = new DataView(new ArrayBuffer(32));
        const scalarData = new Array();

        for(let i = 0; i < size.width * size.height; i++){
            const bias_rgb_index = i * 4
            const red   = rgba[ bias_rgb_index     ] << 24;
            const green = rgba[ bias_rgb_index + 1 ] << 16;
            const blue  = rgba[ bias_rgb_index + 2 ] << 8;

            dataView.setUint32(0, red + green + blue);
            const buf = dataView.getFloat32(0);
            scalarData.push(buf);
        }
       
        return scalarData;
    }

    calcMeans = ( datas, size ) => {
        let min = undefined, max = undefined;
        let maean = undefined, mean_x = undefined, mean_y = undefined;
       
        let sum = 0;
        let sum_x = new Array(size.height).fill(0);
        let sum_y = new Array(size.width).fill(0);
        for ( let y = 0; y < size.height; y++ ) {
            const offset = y * size.width;
            for ( let x = 0; x < size.width; x++ ) {
                const data = datas[ x + offset ];
                sum_x[y] += data;
                if ( min === undefined ) {
                    min = max = data;
                } else {
                    if ( min > data ) min = data;
                    if ( max < data ) max = data;
                }
            }
            sum += sum_x[y];
        }

        for ( let x = 0; x < size.width; x++ ) {
            for ( let y = 0; y < size.height; y++ ) {
                const offset = y * size.width;
                sum_y[x] += datas[ x + offset ];
            }
        }
        
        return {
            mean_x: sum_x.map( v => v / size.width ),
            mean_y: sum_y.map( v => v / size.height ),
            mean: sum / datas.length,
        }
    }

    /**
     * キャンバス要素からカラーマップを元に色をつけて, imageDataに変換する
     *
     * @param {HTMLElement<Canvas>} canvas ビットマップ
     * @return {ImageData} 再度色付けされたビットマップ画像のimageData 
     */
    bitmap2tile = (canvas, isCalcMaxMinMean) => {
        const ctx = canvas.getContext("2d");

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const size = {width: canvas.width, height: canvas.height};
        let datas = this.bitmap2data(imageData, size, isCalcMaxMinMean);
        if ( isCalcMaxMinMean ) {
            const means = this.calcMeans(datas, size);
            this.means = { ...means };
        }
        datas = this.math_method( datas, size, this.means );
        if ( isCalcMaxMinMean ) {
            let min = undefined, max = undefined;
            datas.forEach( data => {
                if ( min == undefined ) {
                    min = max = data;
                } else {
                    if ( min > data ) min = data;
                    if ( max < data ) max = data;
                }
            });
            this.min = this.min ? this.min : min;
            this.max = this.max ? this.max : max;
        }
        for(let i = 0; i < canvas.width * canvas.height; i++){
            const bias_rgb_index = i * 4;
            const rgb = this.data2color(datas[i]);
            imageData.data[bias_rgb_index   ] = rgb.r;
            imageData.data[bias_rgb_index +1] = rgb.g;
            imageData.data[bias_rgb_index +2] = rgb.b;
            imageData.data[bias_rgb_index +3] = 255;
        }

        return imageData;
    }

    /**
     * キャンバス要素からカラーマップを元に色をつけて, キャンバス要素に変換する
     *
     * @param {HTMLElement<Canvas>} canvas ビットマップ
     */
    bitmap2canvas = (canvas, isCalcMaxMinMean) => {
        const ctx = canvas.getContext("2d");
        const imageData = this.bitmap2tile(canvas, isCalcMaxMinMean);
        if ( !imageData ) return;
        ctx.putImageData(imageData, 0, 0);
    }

    /**
     * データから色を着色する
     *
     * @param {Number} data
     * @return {Object} rgb値 
     */
    data2color = (data) => {
        // カラーマップの配列の要素値を作成(以下の比の計算)
        // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
        const colormap_per_scalardata = this.colormap.length / (this.max - this.min);
        const colormap_index = parseInt(colormap_per_scalardata * (data - this.min));
        
        // 読み込み失敗時は白を返す
        if(data === 0.0000000000)                        return {r:255, g:255, b:255};
        else if(this.colormap.length <= colormap_index)  return this.colormap[this.colormap.length - 1];
        else if (0 > colormap_index)                     return this.colormap[0];
        else                                             return this.colormap[colormap_index];                           // それ以外は対応する色を返す
    }

    /**
     * 画像のurlから引数のキャンバス要素にカラーマップを元に色をつけてゆく
     *
     * @param {String} url 画像のurl
     * @param {HTMLElement<Canvas>} canvas ビットマップ
     */
    url2canvas = async (url, canvas, isCalcMaxMinMean = false) => {
        const ctx = canvas.getContext("2d");

        const promise = new Promise(resolve => {    
            const img = new Image();
            img.crossOrigin = "anonymous";
            [img.width, img.height] = [canvas.width, canvas.height];
            
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                this.bitmap2canvas(canvas, isCalcMaxMinMean);
                resolve();
            };

            img.src = url;
        });
        await promise;
        return canvas;
    }

    url2tile = async (url, canvas) => {
        canvas = await this.url2canvas(url, canvas);
        const ctx = canvas.getContext("2d");
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    getMaxMin = async (url, size) => {
        if ( !this.min ) {
            const canvas = document.createElement("canvas");
            [canvas.width, canvas.height] = [size.X, size.Y];
            await this.url2canvas(url, canvas, true);
        }
        return { min: this.min, max: this.max };
    }



    isTone = (t=true, f=false) => { return t; }

    _whereDrawGridLine = (index, width, height) => {
        const total_pixels = width * height;
        
        return (
            ( 0 <= index && index < width ) ||                          // タイルの上辺
            ( total_pixels - width <= index && index < total_pixels )|| // タイルの下辺
            ( index % width == 0 ) ||                                   // タイルの左辺
            ( index % width == width - 1 )                              // タイルの右辺
        );
    }
}

export default toneDiagram;
