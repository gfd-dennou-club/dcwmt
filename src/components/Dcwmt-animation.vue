<template>
  <div>
    <div v-for="(slider, i) in sliders" :key="i">
      <div style="display: flex">
        <v-subheader>
          {{ slider.title + '=' + slider.tick_labels[slider.value] }}
        </v-subheader>
        <v-btn
          outlined
          color="red"
          style="margin: 0 0 0 auto"
          @click="replay(i)"
        >
          {{ slider.clicked ? '■' : '▶︎' }}
        </v-btn>
      </div>
      <v-slider
        v-model="slider.value"
        :tick-size="slider.step"
        :step="slider.step"
        :min="slider.min"
        :max="slider.max"
        ticks="always"
        @mouseup="changeURL()"
      ></v-slider>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

type Slider = {
  title: string;
  value: number;
  tick_label: string[];
  step: number;
  min: number;
  max: number;
  clicked: boolean;
};

type DataType = {
  sliders: Slider[];
  intervalID: number;
  sec_per_frame: number;
  name: string;
  length: number;
};

export default Vue.extend({
  data(): DataType {
    return {
      sliders: new Array<Slider>(),
      intervalID: 0,
      sec_per_frame: 2,
      name: '',
      length: 0,
    };
  },
  computed: {
    draingOptions: {
      get: function () {
        return this.$store.getters.drawingOptions;
      },
      set: function (value) {
        this.$store.commit('setDrawingOptions', value);
      },
    },
  },
  methods: {
  },
  created: function () {
  },
  watch: {
  },
});
</script>

<style scoped>
</style>
