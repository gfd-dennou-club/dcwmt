const viewerProjection = (map, diagram) => {
    const olMap = new ol.Map({
        target: map,
        layers: [
            new ol.layer.Tile({
                source: new ol.source.XYZ({
                    url: `${DEFINE.ROOT}/Ps/time=32112/{z}/{x}/{y}.png`,
                    tileLoadFunction: (imageTile, src) => {
                        let canvas = document.createElement("canvas");
                        [canvas.width, canvas.height] = [256, 256];

                        const imagePromise = () => {
                            return new Promise( async (resolve) => {
                                const isLevel0 = imageTile.tileCoord[0] === 2;
                                console.log("aa");
                                await diagram.url2canvas(src, canvas, isLevel0);
                                console.log("ii");
                                resolve(canvas);
                            })
                        }

                        const displayPromise = async () => {
                            await imagePromise();
                            console.log("uu");
                            imageTile.getImage().src = canvas.toDataURL("image/png");
                        }

                        displayPromise();
                        
                        // const canvas = document.createElement("canvas");
                        // [canvas.width, canvas.height] = [256, 256];
                        // const img = new Image();
                        // const onload = new Promise((resolve, reject) => {
                            // img.src = src;
                            // resolve(img)
                        // })
                        
                        // onload.then(
                            // value => {
                                // const redraw = new Promise((resolve, reject) => {
                                    // const context = canvas.getContext('2d');
                                    // context.drawImage(value, 0, 0);
                                    // const img = context.getImageData(0, 0, canvas.width, canvas.height);
                                    // const rgba = img.data;
                                    // let min, max;
                                    // let red, green, blue;
                                    // let dataView = new DataView(new ArrayBuffer(32));
                                    // let scalarData = new Array();

                                    // for(let i = 0; i < canvas.height * canvas.width; i++){
                                        // const bias_rgb_index = i*4;
                                        // red =   rgba[bias_rgb_index    ]  << 24;
                                        // green = rgba[bias_rgb_index + 1]  << 16;
                                        // blue =  rgba[bias_rgb_index + 2]  << 8;
                                    
                                        // dataView.setUint32(0, red + green + blue);
                                        // scalarData[i] = dataView.getFloat32(0);
                                    
                                        // if(i === 0)
                                            // min = max = scalarData[i];
                                        // else{
                                            // if(min > scalarData[i]) min = scalarData[i];
                                            // if(max < scalarData[i]) max = scalarData[i];
                                        // }
                                    // }
                                
                                    // for(let i = 0; i < canvas.height * canvas.width; i++){
                                        // const bias_rgb_index = i*4;
                                        // const colormap_per_scalardata = clrmap_04.length / (max - min);
                                        // const colormap_index = parseInt(colormap_per_scalardata * (scalarData[i] - min));
                                        // let rgb;
                                    
                                        // if(scalarData[i] === 0.0000000000)          { rgb = {r:255, g:255, b:255}; }
                                        // else if(clrmap_04.length <= colormap_index) { rgb = clrmap_04[clrmap_04.length - 1]; }
                                        // else if(0 >= colormap_index)                { rgb = clrmap_04[0]; }
                                        // else                                        { rgb = clrmap_04[colormap_index]; } 
                                    
                                        // img.data[bias_rgb_index  ] = rgb.r;
                                        // img.data[bias_rgb_index+1] = rgb.g;
                                        // img.data[bias_rgb_index+2] = rgb.b;
                                        // img.data[bias_rgb_index+3] = 255;
                                    // }

                                    // context.putImageData(img, 0, 0);

                                    // resolve(canvas);
                                // })

                                // redraw.then(
                                    // canvas => {
                                        // imageTile.getImage().src = canvas.toDataURL("image/png");
                                        // console.log(imageTile.getImage())
                                    // },
                                    // reason => {console.error(reason)}
                                // );
                            // },
                            // reason => { console.error(reason); }
                        // )
                    }
                })
            })
        ],
        view: new ol.View({
            // center: [-472202, 7530279],
            center: [0, 0],
            zoom: 0,
        })
    })
}