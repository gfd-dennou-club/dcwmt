import Vue from "vue";
import Vuex from "vuex";

import wmtsLibIdentifer from "../modules/utility/wmtsLibIdentifer";

Vue.use(Vuex);

const state = {
    drawingOptions: {},
    config: {
        clrindex: 3,
        wmtsLibIdentifer: new wmtsLibIdentifer("OpenLayers"),
        projection: {
            code: 'EPSG:3857',
            extent: undefined,
        },
        toneRange: { name: undefined, min: undefined, max: undefined },
        fixedDim: null, 
        mathMethod: ( datas ) => datas,
    },
    layersprops: [],
    zoom: 0,
    center: [0, 0],
    layers: [],
};

const getters = {
    drawingOptions: state => state.drawingOptions,
    config: state => state.config,
    layersprops: state => state.layersprops,
    selectedlayer: state => state.selectedlayer,
    zoom: state => state.zoom,
    center: state => state.center,
    layers: state => state.layers,
};

const mutations = {
    setDrawingOptions: (state, drawingOptions) => {
        state.drawingOptions = { ...state.drawingOptions, ...drawingOptions };
    },
    setConfig: (state, config) => {
        for ( const props in config ) {
            state.config[props] = config[props];
        }
    },
    setLayersProps: (state, layersprops) => {
        state.layersprops = layersprops;
    },
    setSelectedLayer: (state, selectedlayer) => {
        state.selectedlayer = selectedlayer;
    },
    setZoom: (state, zoom) => {
        state.zoom = zoom;
    },
    setCenter: (state, center) => {
        state.center = center; 
    },
    setLayers: (state, layers) => {
        state.layers = layers;
    },
}

const actions = {

}


export default new Vuex.Store({
    state, getters, mutations, actions,
});
