const Viewer = class{
    constructor(options){
        this.options = {
            viewer_name: options.name ? options.name : "Cesium",
            diagram_name: options.diagram ? options.diagram : "counter",
            clrindex: options.clrindex ? options.clrindex : 4,
        };
        this.redraw(this.options);
    }

    redraw = (options) => {
        for(const prop in options){
            this.options[prop] = options[prop];
        }

        const viewer_ele = this._createViewerElement();
        const diagram = this._createDiagram(this.options.diagram_name, this.options.clrindex);
        switch(this.options.viewer_name){
            case "Cesium":
                viewer3D(viewer_ele, diagram);
                break;
            case "Leaflet":
                viewer_ele.setAttribute("style", "height: 500px;");
                viewerCartesian(viewer_ele, diagram);
                break;
            case "OpenLayers":
                viewer_ele.setAttribute("style", "height: 700px; width: 100%;");
                viewerProjection(viewer_ele, diagram);
                break;
        }
    }

    _createViewerElement = () => {
        // 既にビュワーが存在するのであれば, html要素を消しておく
        if(document.getElementById("viewer") !== null){
            document.getElementById("viewer").remove();
        }

        // viewerを表示するためのdiv要素を作成
        const viewer_element = document.createElement("div");
        viewer_element.setAttribute("id", "viewer");

        // viewer_elementを大枠のメインの要素に子要素として追加
        const mainScreen = document.getElementById("main-screen");
        mainScreen.appendChild(viewer_element);

        return viewer_element;
    }

    _createDiagram = (diagram_type, clrindex) => {
        const clrmap = new colorbar(clrindex);
        switch(diagram_type){
            case "counter": return new CounterDiagram(clrmap.getClrmap());
            case "vector":  return new VectorDiagram(clrmap.getClrmap());
        }
    }
} 