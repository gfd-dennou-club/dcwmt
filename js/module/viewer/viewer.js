const Viewer = class{
    constructor(options){
        this.options = options;

        this.options.viewer_name = options.viewer_name ?? "Cesium";
        this.options.diagram_name = options.diagram_name ?? "counter";
        this.options.clrindex = options.clrindex ?? 4;

        this.redraw(this.options);
    }

    redraw = (options) => {
        for(const prop in options){
            this.options[prop] = options[prop];
        }

        const viewer_ele = this._createViewerElement();
        const diagram = this._createDiagram(
            this.options.diagram_name, 
            this.options.clrindex,
            this.options.opacity || 255,
        );

        if(diagram.isCounter()){
            const level0_url = this.options.url.concat("/0/0/0.png");
            diagram.calcMaxMin(level0_url);
        }

        const vieweroption = {
            map: viewer_ele, 
            diagram: diagram,
            url: this.options.url, 
            urls: this.options.urls,
        };

        switch(this.options.viewer_name){
            case "Cesium":
                viewer3D(vieweroption);
                break;
            case "Leaflet":
                viewerCartesian(vieweroption);
                break;
            case "OpenLayers":
                viewerProjection(vieweroption);
                break;
        }
    }

    getCurrentColorIndex = () => {
        return this.options.clrindex;
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

    _createDiagram = (diagram_type, clrindex, opacity) => {
        const clrmap = new colormap(clrindex);
        switch(diagram_type){
            case "counter": return new CounterDiagram(clrmap.getClrmap(), opacity);
            case "vector":  return new VectorDiagram(clrmap.getClrmap());
        }
    }
} 