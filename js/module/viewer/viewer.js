const Viewer = class{
    constructor(baselayers, overlaylayers, viewer_name, options){
        switch(viewer_name){
            case "Cesium":
                this.baselayers = baselayers.map(layer => 
                    layer.for3D(options.maxLevel, options.miniLevel)
                );
                this.overlaylayers = overlaylayers.map(layer => 
                    layer.for3D(options.maximumLevel, options.minimumLevel)
                );
                this.viewer = viewer3D;
                break;
            case "Leaflet":
                this.baselayers = baselayers.map(layer => layer.forCartesian());
                this.overlaylayers = overlaylayers.map(layer => layer.forCartesian());
                this.viewer = viewerCartesian;
                break;
            case "OpenLayers":
                this.baselayers = baselayers.map(layer => layer.forProjection());
                this.overlaylayers = overlaylayers.map(layer => layer.forProjection());
                this.viewer = viewerProjection;
                break; 
        }
    }

    addBaseLayer = (layer) => {
        if(layer instanceof Array){
            Array.prototype.push.apply(this.baselayers, layer);
        }else if(layer instanceof Layer){
            this.baselayers.push(layer);
        }else{
            console.error("Please pass an instance of Array or Layer to argument of addBaseLayer function !");
        }
    }

    addOverlayLayer = (layer) => {
        if(layer instanceof Array){
            Array.prototype.push.apply(this.overlaylayers, layer);
        }else if(layer instanceof Layer){
            this.overlaylayers.push(layer);
        }else{
            console.error("Please pass an instance of Array or Layer to argument of addOverlayLayer function !");
        }
    }

    show = (viewer_ele) => {
        this.viewer(
            viewer_ele, 
            this.baselayers, 
            this.overlaylayers,
            options
        );
    }
} 