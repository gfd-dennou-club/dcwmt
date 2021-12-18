const Map = class{
    constructor(viewer, baselayers, overlaylayers, diagram){
        this.name = "map";
        this.element = undefined;
        this.diagram = diagram || "Cesium";

        this.viewer = viewer;
        this.baselayers = baselayers;
        this.overlaylayers = overlaylayers;
    }

    draw = (options) => {
        this._create();
        this.viewer.show();
    }

    redraw = (options) => {
        this._destroy();
        this.draw(options);
    }

    addBaseLayer = () => {

    }

    addOverlayLayer = () => {

    }

    _destroy = () => {
        if(document.getElementById(this.name) !== null){
            document.getElementById(this.name).remove();
        }
    }

    _create = () => {
        // viewerを表示するためのdiv要素を作成
        const map_ele = document.createElement("div");
        map_ele.setAttribute("id", this.name);

        // viewer_elementを大枠のメインの要素に子要素として追加
        const mainScreen = document.getElementById("main-screen");
        mainScreen.appendChild(map_ele);

        this.element = map_ele;
    }
}