const Layer = class{
    // DEFINE.COUTNER: {url, size}, clrmap, opacity
    constructor(options){
        this.url = options.url;
        this.size = options.size;

        const clrmap = new colormap(options.clrindex);
        if(options.url === 2){
            this.diagram = new VectorDiagram(clrmap.getClrmap());
        }else{
            this.diagram = new CounterDiagram(clrmap.getClrmap(), options.opacity);
        }
    }

    for3D = (muximumLevel, minimumLevel) => {
        const options = {
            url: this.url,
            tileHeight: this.size.Y,
            tileWidth: this.size.X,
            maximumLevel: muximumLevel,
            minimumLevel: minimumLevel,
            diagram: this.diagram,
            name: this.name,
        };
        return new layer3D(options);
    }

    forCartesian = () => {
        const options = {
            url: this.url,
            size: this.size,
            diagram: this.diagram,
            name: this.name,
        };
        return new layerCartesian(options);
    }

}