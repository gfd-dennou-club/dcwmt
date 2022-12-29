<template>
  <div id="main-screen">
    <layerselecter />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import layerselecter from './LayerSelector/Layerselecter.vue';

import type {
  DefinedOptions,
  DrawingOptions,
  LayerTypes,
  Variable,
} from '../dcmwtconfType';
import { Map } from '../modules/viewer/map';
import { ViewerController } from '../modules/viewer/ViewerContoller';
import { LayerController } from '../modules/layerManager/LayerController';
import { ConfFileReader } from './ConfFileReader';

type DcwmtMapData = {
  viewerController: ViewerController | undefined;
  definedOptions: DefinedOptions | undefined;
};

export default Vue.extend({
  components: {
    layerselecter,
    //    ruler,
  },
  data(): DcwmtMapData {
    return {
      viewerController: undefined,
      definedOptions: undefined,
    };
  },
  mounted: async function () {
    const configData = await new ConfFileReader('./dcwmtconf.json').read();
    this.definedOptions = configData.definedOptions;
    this.drawingOptions = configData.drawingOptions;

    const zoomNativeLevel = this.getZoomNativeLevel(this.definedOptions);

    this.viewerController = new ViewerController(
      this.drawingOptions.projCode,
      zoomNativeLevel,
      this.drawingOptions.zoom,
      this.drawingOptions.center
    );
    const layerController = new LayerController(
      this.definedOptions.root,
      this.drawingOptions.projCode
    );

    await this.draw(this.viewerController, layerController);
  },
  computed: {
    drawingOptions: {
      get: function (): DrawingOptions {
        return this.$store.getters.drawingOptions;
      },
      set: function (value: DrawingOptions) {
        this.$store.commit('setDrawingOptions', value);
      },
    },
  },
  methods: {
    getZoomNativeLevel: function (definedOptions: DefinedOptions) {
      return {
        min: Math.max(...definedOptions.variables.map((v) => v.minZoom)),
        max: Math.min(...definedOptions.variables.map((v) => v.maxZoom)),
      };
    },
    draw: async function (
      viewerController: ViewerController,
      layerController: LayerController
    ) {
      if (!this.definedOptions) {
        throw new Error('Failed to run read_configfile method.');
      }

      const mapEl = Map.create();
      Map.mount(mapEl);
      const viewer = viewerController.create(mapEl)!;

      for (const layerOption of this.drawingOptions.layers) {
        const props = this.createPropsForCreateLayerMethod(
          layerOption,
          this.definedOptions.variables
        );
        const layer = await layerController.create(...props);
        layerController.add(layer);
      }

      viewer.register(layerController);
    },
    createPropsForCreateLayerMethod(layer: LayerTypes, variables: Variable[]) {
      const variable = variables[layer.varindex];
      const fixed = variable.fixed[layer.fixedindex];
      const url_ary = variable.name.map(
        (v) => `${this.definedOptions?.root}/${v}/${fixed}`
      );
      const diagramProps = (() => {
        switch (layer.type) {
          case 'tone':
            return layer.clrindex;
          case 'vector':
            return layer.vecinterval;
          case 'contour':
            return layer.thretholdinterval;
        }
      })();

      return [
        layer.type,
        layer.name,
        url_ary,
        variable.tileSize,
        { min: variable.minZoom, max: variable.maxZoom },
        (x: number) => x,
        layer.show,
        layer.opacity,
        layer.minmax ? layer.minmax : undefined,
        diagramProps,
      ] as const;
    },
  },
  watch: {
    'drawingOptions.layers': {
      //@ts-ignore
      handler: function (layer: LayerTypes[]) {
        const viewer = this.viewerController?.get();
        if (viewer) {
          viewer.updateLayers(layer);
        }
      },
      deep: true,
    },
    // config: {
    // handler: function () {
    // if (this.viewer.getView) {
    // const view = this.viewer.getView();
    // this.zoom = view.getZoom();
    // this.center = view.getCenter();
    // }
    // this.draw();
    // },
    // deep: true,
    // },
    // layers: function () {
    // this.$store.commit('setLayers', this.layers);
    // },
  },
});
</script>

<style scoped>
div#main-screen {
  height: 100%;
  display: flex;
}

div#main-screen > div#map {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
