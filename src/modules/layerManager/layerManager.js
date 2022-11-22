import L from "leaflet";

import layerManager3D from "./lib/layerManager3D";
import layerManagerCartesian from "./lib/layerManagerCartesian";
import layerManagerProjection from "./lib/layerManagerProjection";

import layer from "../layer/layer"
import { contourDiagram } from "../layer/diagram/diagram";

const layerManager = class{
    constructor(wmtsLibIdentifer, viewer, layers){
        this.wmtsLibIdentifer = wmtsLibIdentifer;

        // レイヤの元となるものを取得
        const original_layer = this._getOriginalLayer(viewer);

        // ライブラリに適したLayerManagerを取ってくる
        this.layer_manager = this._getLayerManager(original_layer);

        this.layers = layers;

        this.layer_props = [];
    }

    addBaseLayer = async (layer, name) => {
        const baselayer = await layer.create(this.wmtsLibIdentifer);
        
        const layer_props = layer.getProps();
        if ( !this.layer_props.includes(layer_props) ) {
            this.layer_props.push(layer_props);
        }

        this.layer_manager.addBaseLayer(baselayer, name);
    }

    addLayer = async (_layer, name, alpha = 1.0, show = true) => {
        const overlaylayer = await _layer.create(this.wmtsLibIdentifer); 
        this.layer_manager.addLayer(overlaylayer, name, alpha, show);

        if ( _layer.diagram.isTone() ){
            const diagram = new contourDiagram({
                min: _layer.diagram.min,
                max: _layer.diagram.max,
            });

            const options = { 
                ..._layer.options, 
                name: _layer.options.name.concat("_contour"),
                diagram: diagram, 
            };
            _layer = new layer(options);
            const contourlayer = await _layer.create(this.wmtsLibIdentifer);
            this.layer_manager.addLayer(contourlayer, options.name, alpha, show);
        }
    }

    getLayers = () => {
        return this.layer_manager.getLayers();
    }

    getBaseLayers = () => {
        return this.layer_manager.getBaseLayers();
    }

    setup = (viewer) => {
        this.layer_manager.setup(viewer);

        if( this.layers.length != 0 ) {
            const layers = this.layer_manager.getLayers();
            for ( let i = 0; i < layers.length; i++ ) {
                this.layer_manager.remove(layer[i]);
            }
            console.log(this.layer_manager.getLayers())
            for ( let i = 0 ; i < layers.length; i++ ) {
                for ( let j = 0; j < layers.length; j++) {
                    if ( 
                        ( this.layers[i].name == layers[j].name ) && 
                        ( this.layers[i].isBaselayer == layers[j].isBaselayer ) 
                    ){
                        this.layer_manager.add(layers[j], 0);
                        break;
                    } 
                }
            }
            console.log(original_layer)
            console.log(this.layer_manager.getLayers().map(v=>v.name))
        }

        
        return this.layer_props;
    }

    update = () => {
        this.layer_manager.update();
    }

    remove = (layer) => {
        this.layer_manager.remove(layer);
    }

    add = (layer, index) => {
        this.layer_manager.add(layer, index);
    }

    raise = (layer) => {
        this.layer_manager.raise(layer);
    }

    lower = (layer) => {
        this.layer_manager.lower(layer);
    }

    _getOriginalLayer = (viewer) => {
        const cesium = viewer.imageryLayers;
        const leaflet = new L.control.layers();
        const openlayers = viewer;
        return this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
    }

    _getLayerManager = (original_layer) => {
        const cesium = () => new layerManager3D(original_layer);
        const leaflet = () => new layerManagerCartesian(original_layer);
        const openlayers = () => new layerManagerProjection(original_layer);
        const suitableFunc = this.wmtsLibIdentifer.whichLib(cesium, leaflet, openlayers);
        return suitableFunc();
    }
}

export default layerManager;
