import Vue from "vue";
import Vuex from "vuex";

import wmtsLibIdentifer from "../modules/utility/wmtsLibIdentifer";

Vue.use(Vuex);

const state = {
    config: {
        clrindex: 3,
        wmtsLibIdentifer: new wmtsLibIdentifer("OpenLayers"),
        toneRange: { name: undefined, min: undefined, max: undefined },
    },
    layersprops: [],
    selectedlayer: undefined,
};

const getters = {
    config: state => state.config,
    layersprops: state => state.layersprops,
    selectedlayer: state => state.selectedlayer,
};

const mutations = {
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
    }
}

const actions = {

}


export default new Vuex.Store({
    state, getters, mutations, actions,
});