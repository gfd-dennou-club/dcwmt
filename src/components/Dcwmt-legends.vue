<template>
  <div>
    <v-row no-gutters>
      <v-col cols="12" align="center">
        <colorbar
          width="500"
          height="50"
          :clrindex="topLayer.clrindex"
          style="width: 100%; height=100;"
        />
      </v-col>
    </v-row>
    <v-row no-gutters>
      <v-col cols="3" align="center">
        <v-text-field
          height="50"
          value="topLayer.minmax[0]"
          label="min"
          outlined
          hide-details="auto"
          append-icon="✓"
          @click:append="changeRange()"
        />
      </v-col>
      <v-col cols="6" align="center">
        {{ legendinfo.name }}
      </v-col>
      <v-col cols="3" align="center">
        <v-text-field
          height="50"
          value="topLayer.minmax[1]"
          label="max"
          outlined
          hide-details="auto"
          append-icon="✓"
          @click:append="changeRange()"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { DrawingOptions, LayerTypes } from '@/dcmwtconfType';
import Vue from 'vue';
import colorbar from './DrawerContents/Drawer-colormap/Colorbar.vue';

type DataType = {
  minmax: [number, number];
};

export default Vue.extend({
  components: {
    colorbar,
  },
  data(): DataType {
    return {
      minmax: [0, 0],
    };
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
    topLayer: function () {
      const layers: LayerTypes[] = this.drawingOptions.layers;
      for (const layer of layers) {
        if (layer.type === 'tone') {
          return layer;
        }
      }
      return undefined;
    },
  },
  //methods: {
    // changeRange: function () {
      // const layers: LayerTypes[] = this.drawingOptions.layers;
      // for (const layer of layers) {
        // if (layer.type === 'tone') {
        // }
      // }
    // },
  //},
});
</script>
