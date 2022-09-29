import Vue from "vue";
import Vuex from "vuex";

import wmtsLibIdentifer from "../modules/utility/wmtsLibIdentifer";

Vue.use(Vuex);

const state = {
    config: {
        clrindex: 3,
        wmtsLibIdentifer: new wmtsLibIdentifer("OpenLayers"),
    }
};

const getters = {
    config: state => state.config,
};

const mutations = {
    setConfig: (state, config) => {
        for(const props in config)
            state.config[props] = config[props];
    },
}

const actions = {

}


export default new Vuex.Store({
    state, getters, mutations, actions,
});