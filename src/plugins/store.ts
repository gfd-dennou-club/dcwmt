import Vue from 'vue';
import Vuex from 'vuex';

import { DrawingOptions, DefinedOptions } from '../dcmwtconfType';
import { ViewerController } from '@/modules/viewer/ViewerController';

Vue.use(Vuex);

type State = {
  drawingOptions: DrawingOptions | undefined;
  definedOptions: DefinedOptions | undefined;
  viewerController: ViewerController | undefined;
};

const state: State = {
  drawingOptions: undefined,
  definedOptions: undefined,
  viewerController: undefined,
};

const getters = {
  drawingOptions: (state: State) => state.drawingOptions,
  definedOptions: (state: State) => state.definedOptions,
  viewerController: (state: State) => state.viewerController,
};

const mutations = {
  setDrawingOptions: (state: State, drawingOptions: DrawingOptions) => {
    state.drawingOptions = drawingOptions;
  },
  setDefinedOptions: (state: State, definedOptions: DefinedOptions) => {
    state.definedOptions = definedOptions;
  },
  setViewerController: (state: State, viewerController: ViewerController) => {
    state.viewerController = viewerController;
  },
};

const actions = {};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
});
