<template>
  <v-list subheader tile>
    <v-subheader>描画方法の切り替え</v-subheader>
    <v-list-item
      v-for="projection in projections"
      :key="projection.title"
      @click="
        () => {
          selected = projection.code;
        }
      "
    >
      <v-list-item-title>
        {{ projection.title }}
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import { DrawingOptions } from '@/dcmwtconfType';
import { Projection, projections } from './projection_lib';

type DrawerFigureDataType = {
  selected: Projection;
};

export default Vue.extend({
  data(): DrawerFigureDataType {
    return {
      selected: projections[0],
    };
  },
  computed: {
    drawingOptions: {
      get: function () {
        return this.$store.getters.drawingOptions;
      },
      set: function (value: DrawingOptions) {
        this.$store.commit('setDrawingOptions', value);
      },
    },
  },
  watch: {
    selected: function (proj: Projection) {
      const param = { projCode: proj.code };
      this.drawingOptions = { ...this.drawingOptions, ...param };
    },
  },
});
</script>
