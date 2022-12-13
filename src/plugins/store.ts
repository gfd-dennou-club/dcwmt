import Vue from 'vue';
import Vuex from 'vuex';

import { DrawingOptions } from '../dcmwtconfType';

Vue.use(Vuex);

type State = {
  drawingOptions: DrawingOptions | undefined;
};

const state: State = {
  drawingOptions: undefined,
};

const getters = {
  drawingOptions: (state: State) => state.drawingOptions,
};

const mutations = {
  setDrawingOptions: (state: State, drawingOptions: DrawingOptions) => {
    state.drawingOptions = drawingOptions;
  },
};

const actions = {};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
