const Viewer = class{
    constructor(options){
        this.options = options;

        this.options.viewer_name = options.viewer_name ?? "Cesium";
        this.options.clrindex = options.clrindex ?? 4;

        this.redraw(this.options);
    }

    redraw = (options) => {
        for(const prop in options){
            this.options[prop] = options[prop];
        }

        const viewer_ele = this._createViewerElement();
        options.counter.forEach((ele) => {
            const layer = new Layer({
                url: ele.url,
                size: ele.size,
                clrindex: this.options.clrindex,
                opacity: this.options.opacity,
            });
            this._view(viewer_ele, layer.for3D(2, 0));
        });
        // const diagram = this._createDiagram(
        //     //this.options.diagram_type, // 今はなき
        //     this.options.clrindex,
        //     this.options.opacity || 255,
        // );

        // this.options.counter_url.forEach(url => { 
        //     const level0_url = url.concat("/0/0/0.png");
        //     diagram.calcMaxMin(level0_url);    
        // });
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

    _view = (viewer_ele, layer) => {
        switch(this.options.viewer_name){
            case "Cesium":
                viewer3D(viewer_ele, layer);
                break;
            case "Leaflet":
                viewerCartesian(viewer_ele, layer);
                break;
            case "OpenLayers":
                viewerProjection(viewer_ele, layer);
                break;
        }
    }
} 