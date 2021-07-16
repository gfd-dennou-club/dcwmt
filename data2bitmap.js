/**
 * 画像の色の明度および透過度を取得
 *
 * @param {HTMLElement<Image>} img データを取得したいhtml要素
 * @return {ImageData} 画像の色の明度および透過度
 */
const getDataFromImage = (canvas) => {
    const ctx = canvas.getContext("2d");

    const rgba = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let min, max;
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

        if(i === 0)
            min = max = scalarData[i];
        else{
            if(min > scalarData[i]) min = scalarData[i];
            if(max < scalarData[i]) max = scalarData[i];
        }
    }

    return {
        data: scalarData,
        min: min,
        max: max,
    }
}

const bitmap2datas = (canvas, colormap) => {
    const ctx = canvas.getContext("2d");

    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const datas = getDataFromImage(canvas);
    for(let i = 0; i < canvas.width * canvas.height; i++){
        const bias_rgb_index = i * 4;
        const rgb = data2color(datas.data[i], datas.min, datas.max, colormap);
        imageData.data[bias_rgb_index   ] = rgb.r;
        imageData.data[bias_rgb_index +1] = rgb.g;
        imageData.data[bias_rgb_index +2] = rgb.b;
        imageData.data[bias_rgb_index +3] = 255;
    }

    return imageData;
}

const bitmap2canvas = (canvas, colormap) => {
    const ctx = canvas.getContext("2d");
    const imageData = bitmap2datas(canvas, colormap);
    ctx.putImageData(imageData, 0, 0);
}

/**
 * データから色を着色する
 *
 * @param {*} data
 * @param {*} min
 * @param {*} max
 * @param {*} colormap
 * @return {*} 
 */
const data2color = (data, min, max, colormap) => {
    // カラーマップの配列の要素値を作成(以下の比の計算)
    // colomap の長さ : scalardata の長さ(_max - _min) = colormap_index : data - this.options._min (_minに基準を合わせている)
    const colormap_per_scalardata = colormap.length / (max - min);
    const colormap_index = parseInt(colormap_per_scalardata * (data - min));
    // 読み込み失敗時は白を返す
    if(data === 0.0000000000)                   return {r:255, g:255, b:255};
    else if(colormap.length <= colormap_index)  return colormap[colormap.length - 1];
    else if (0 > colormap_index)                return colormap[0];
    else                                        return colormap[colormap_index];                           // それ以外は対応する色を返す
}

const url2canvas = (src, colormap, canvas) => {
    const ctx = canvas.getContext("2d");
    
    const img = new Image();
    [img.width, img.height] = [canvas.width, canvas.height];
    
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
        bitmap2canvas(canvas, colormap);
    }

    img.src = src;
}