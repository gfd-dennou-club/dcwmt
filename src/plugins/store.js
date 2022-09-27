import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const state = {
    clrindex: 3,
};

const getters = {
    clrindex: state => state.clrindex,
};

const mutations = {
    setClrindex (state, newindex) {
        state.clrindex = newindex;
    }
}

const actions = {

}


export default new Vuex.Store({
    state, getters, mutations, actions,
});