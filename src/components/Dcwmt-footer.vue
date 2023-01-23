<template>
  <v-row>
    <v-col cols="3" style="display: flex; align-items: center">
      <v-text-field label="title" v-model="textValue">
        <template v-slot:append-outer>
          <v-btn @click="onSave" outlined color="primary">save</v-btn>
        </template>
      </v-text-field>
    </v-col>
    <v-col cols="8">
      <dcwmt_animation />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import Vue from 'vue';
import dcwmt_animation from './Dcwmt-animation.vue';
import { DrawingOptions } from '@/dcmwtconfType';

type DataType = {
  textValue: string;
};

export default Vue.extend({
  components: {
    dcwmt_animation,
  },
  data(): DataType {
    return {
      textValue: '',
    };
  },
  computed: {
    drawingOptions: {
      set: function (value: DrawingOptions) {
        this.$store.commit('setDrawingOptions', value);
      },
      get: function () {
        return this.$store.getters.drawingOptions;
      },
    },
    definedOptions: function () {
      return this.$store.getters.definedOptions;
    },
    viewerController: function () {
      return this.$store.getters.viewerController;
    },
  },
  methods: {
    onSave: async function () {
      // Take a sum nail image
      const sumneil = this.getSumNailImageData();

      const viewer = this.viewerController.get();
      if (!viewer) {
        return;
      }
      const center = viewer.center;
      const zoom = viewer.zoom;
      const title = this.textValue;
      if (title.length <= 0) {
        alert('タイトルを入力してください.');
        return;
      }

      const drawingOptions = { ...this.drawingOptions, sumneil, title, center, zoom };
      const definedOptions = this.definedOptions;
      const confFile = { definedOptions, drawingOptions };

      // Download json file
      const json = JSON.stringify(confFile);
      const blob = new Blob([json], { type: 'application/json' });
      const aEl = document.createElement('a');
      aEl.href = window.URL.createObjectURL(blob);
      aEl.download = 'dcwmtmap.json';
      aEl.click();
      aEl.remove();

      this.textValue = '';
    },
    getSumNailImageData: function () {
      const map = document.getElementById('map')!;
      const canvas = this.getCanvasElement(map) as HTMLCanvasElement;
      return canvas.toDataURL('image/png');
    },
    getCanvasElement: function (ele: Element): Element {
      if (ele.childElementCount <= 0) {
        return ele;
      }
      return this.getCanvasElement(ele.children[0]);
    },
  },
});
</script>
