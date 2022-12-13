<template>
  <div id="main-screen">
    <ruler :viewer="viewer" />
    <layerselecter :layer_manager="layer_manager" />
  </div>
</template>

<script lang="ts">
import layerselecter from './LayerSelector/Layerselecter.vue';
import ruler from './Dcwmt-ruler.vue';

import { Viewer, ViewerTypesForEachLibs } from '../modules/viewer/viewer';
import { Layer } from '../modules/layer/layer';
import LayerManager from '../modules/layerManager/layerManager.js';
import { WmtsLibIdentifer } from '../modules/utility/wmtsLibIdentifer';
import type { DefinedOptions, DrawingOptions } from '../dcmwtconfType';

type DcwmtMapData = {
  layer_manager: LayerManager | undefined;
  viewer: ViewerTypesForEachLibs | undefined;
  definedOptions: DefinedOptions | undefined;
};

export default {
  components: {
    layerselecter,
    ruler,
  },
  data(): DcwmtMapData {
    return {
      layer_manager: undefined,
      viewer: undefined,
      definedOptions: undefined,
    };
  },
  mounted: async function () {
    await this.read_configfile();
    await this.draw();
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
    read_configfile: async function () {
      const url = './dcwmtconf.json';

      // Fetch data in json file
      const promise = new Promise((resolve, reject) => {
        try {
          const request = new XMLHttpRequest();
          request.open('GET', url);
          request.responseType = 'json';
          request.send();
          request.onload = () => {
            // store in this calss
            this.definedOptions = request.response
              .definedOptions as DefinedOptions;
            // store in vuex
            this.drawingOptions = request.response
              .drawingOptions as DrawingOptions;

            resolve(0);
          };
        } catch (err) {
          reject(new Error(err as string));
        }
      });

      await promise;
    },

    draw: async function () {
      if (!this.definedOptions) {
        throw new Error('Failed to run read_configfile method.');
      }

      // Select WMTS librarys
      const projCode = this.drawingOptions.projection;
      let wli: WmtsLibIdentifer | undefined = undefined;
      if(projCode == 'XY') {
        wli = new WmtsLibIdentifer('Leaflet');
      } else if(projCode == '3d Sphere') {
        wli = new WmtsLibIdentifer('Cesium');
      } else {
        wli = new WmtsLibIdentifer('OpenLayers');
      }

      // Get Native Zoom Level.
      const zoomNativeLevel = {
        min: Math.max(...this.definedOptions.variables.map((v) => v.minZoom)),
        max: Math.min(...this.definedOptions.variables.map((v) => v.maxZoom)),
      };

      // Create Viewer instance
      const viewer_option = {
        wmtsLibIdentifer: wli,
        projection: this.drawingOptions.projection,
        zoomNativeLevel: zoomNativeLevel,
        zoom: this.drawingOptions.zoom || 0,
        center: this.drawingOptions.center || [0, 0],
      };
      const viewer = new Viewer(
        wli,
        projCode,
        zoomNativeLevel,
        this.drawingOptions.zoom || 0,
        this.drawingOptions.center || [0, 0]
      );
      this.viewer = viewer.getSuitableViewer();

      // Create Layer Manager instance
      this.layer_manager = new LayerManager(wli, this.viewer);

      // Create layers instance and Add layers to layer manager
      const root = this.definedOptions.root;
      for (const layer of this.drawingOptions.layers) {
        // Create URL to tiles, variable index, and min-max range
        const pq_names = new Array<String>();
        if (layer.type == 'contour') {
          pq_names.push(layer.name.split('_')[0]);
        } else {
          layer.name.split('-').forEach((l) => {
            pq_names.push(l);
          });
        }
        let url_ary = pq_names.map((pq_name) => root.concat(`/${pq_name}`));
        const varindex = layer.varindex;
        const fixed = layer.fixedindex;
        for (let i = 0; i < url_ary.length; i++) {
          const f = this.definedOptions.variables[varindex].fixed[fixed];
          url_ary[i] = url_ary[i].concat(`/${f}`);
        }
        const minmax = layer.minmax;

        // Create layer instance
        const layer_option = {
          name: layer.name,
          url: url_ary,
          tileSize: this.definedOptions.variables[varindex].tileSize,
          zoomLevel: {
            min: this.definedOptions.variables[varindex].minZoom,
            max: this.definedOptions.variables[varindex].maxZoom,
          },
          clrindex: layer.type == 'tone' ? layer.clrindex : undefined,
          range: { min: minmax[0], max: minmax[1] },
          diagram: layer.type,
        };
        const layer_obj = new Layer(layer_option);

        // Add layer to layer manager
        await this.layer_manager.addLayer(layer_obj, layer.name);
      }

      // レイヤーマネージャのセットアップ
      let layersprops = this.layer_manager.setup(this.viewer);
      layersprops = await Promise.all(layersprops);
      this.layersprops = layersprops.filter((v) => v);
    },
  },
  watch: {
    config: {
      handler: function () {
        if (this.viewer.getView) {
          const view = this.viewer.getView();
          this.zoom = view.getZoom();
          this.center = view.getCenter();
        }
        this.draw();
      },
      deep: true,
    },
    layers: function () {
      this.$store.commit('setLayers', this.layers);
    },
  },
};
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
