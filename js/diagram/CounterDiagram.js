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

const CounterDiagram = class{
    constructor(colormap){
        this.min = undefined;
        this.max = undefined;
        this.colormap = colormap;
    }

    /**
     * 画像の色の明度と透過度および最小値と最大値を取得
     *
     * @param {HTMLElement<Image>} img データを取得したいhtml要素
     * @return {Object} 画像の色の明度および透過度, 最小値, 最大値
     */
    bitmap2data = (imageData, size, isLevel0 = false) => {
        const rgba = imageData.data;
        let red, green, blue;
        let dataView = new DataView(new ArrayBuffer(32));
        let scalarData = new Array();
        
        for(let i = 0; i < size.width * size.height; i++){
            const bias_rgb_index = i * 4;
            red   = rgba[bias_rgb_index    ] << 24;
            green = rgba[bias_rgb_index + 1] << 16;
            blue  = rgba[bias_rgb_index + 2] << 8;

            dataView.setUint32(0, red + green + blue);
            scalarData[i] = dataView.getFloat32(0);

            if(isLevel0){
                if(this.min === undefined)
                    this.min = this.max = scalarData[i];
                else{
                    if(this.min > scalarData[i]) this.min = scalarData[i];
                    if(this.max < scalarData[i]) this.max = scalarData[i];
                }
            }
        }
       
        return scalarData;
    }

    /**
     * キャンバス要素からカラーマップを元に色をつけて, imageDataに変換する
     *
     * @param {HTMLElement<Canvas>} canvas ビットマップ
     * @return {ImageData} 再度色付けされたビットマップ画像のimageData 
     */
    bitmap2tile = (canvas, isLevel0 = false) => {
        const ctx = canvas.getContext("2d");

        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const size = {width: canvas.width, height: canvas.height};
        const datas = this.bitmap2data(imageData, size, isLevel0);
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
    bitmap2canvas = (canvas, isLevel0 = false) => {
        const ctx = canvas.getContext("2d");
        const imageData = this.bitmap2tile(canvas, isLevel0);
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
    url2canvas = (url, canvas, isLevel0 = false) => {
        return new Promise(resolve => {
            console.log("hhh")
            const ctx = canvas.getContext("2d");

            const img = new Image();
            [img.width, img.height] = [canvas.width, canvas.height];

            img.src = url;

            img.onload = () => {
                ctx.drawImage(img, 0, 0);
                this.bitmap2canvas(canvas, isLevel0);
            }

            resolve(canvas);
        });
    }
}