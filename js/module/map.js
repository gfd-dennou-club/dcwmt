const Map = class{
    constructor(options){
        this.name = "map";
        this.element = undefined;
        this.viewer_name = options.viewer_name || "Cesium";
        
        const baselayers = [];
        const overlaylayer = [];

        options.counter.forEach((value) => {
            const layer_options = {
                name: value.name,
                url: value.url,
                size: value.size,
                clrindex: options.clrindex,
                opacity: options.opacity,
            };
            baselayers.push(new Layer(layer_options));
            overlaylayer.push(new Layer(layer_options));
        });        
        this.viewer = new Viewer(
            baselayers, 
            overlaylayer, 
            options.viewer_name, 
        );
    }

    draw = (options) => {
        this._createElement();
        this.viewer.show();
    }

    redraw = (options) => {
        this._destroyElement();
        this.draw(options);
    }

    addBaseLayer = () => {

    }

    addOverlayLayer = () => {

    }

    _destroyElement = () => {
        if(document.getElementById(this.name) !== null){
            document.getElementById(this.name).remove();
        }
    }

    _createElement = () => {
        // viewerを表示するためのdiv要素を作成
        const map_ele = document.createElement("div");
        map_ele.setAttribute("id", this.name);

        // viewer_elementを大枠のメインの要素に子要素として追加
        const mainScreen = document.getElementById("main-screen");
        mainScreen.appendChild(map_ele);

        this.element = map_ele;
    }
}