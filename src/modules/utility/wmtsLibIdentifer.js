const wmtsLibIdentifer = class{
    constructor(lib_type){
        if(typeof lib_type === "string"){
            const type = { "Cesium": 0, "Leaflet": 1, "OpenLayers": 2 };
            this.lib_type = type[lib_type];
        }else if(typeof lib_type === "number"){
            this.lib_type = lib_type;
        }else{ 
            console.error("Pass a variable of number or string as argument of constructor !"); 
        }
    }

    whichLib = (cesium, leaflet, openlayers) => {
        const type = { 0: cesium, 1: leaflet, 2: openlayers };
        return type[this.lib_type];
    }
}

export default wmtsLibIdentifer;
