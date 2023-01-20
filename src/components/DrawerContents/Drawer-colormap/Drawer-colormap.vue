<template>
  <v-list subheader tile>
    <v-list-item-group v-model="selected" color="primary">
      <v-list-item v-for="(clrmap_name, i) in clrmap_names" :key="i" link>
        <v-list-item-content>
          <v-list-item-title>{{ clrmap_name }}</v-list-item-title>
          <colorbar :width="200" :height="25" :clrindex="i" />
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import Vue from 'vue';
import colorbar from './Colorbar.vue';

type DrawerColormapDataType = {
  selected: number;
  clrmap_names: Array<string>;
};

export default Vue.extend({
  components: {
    colorbar,
  },
  data(): DrawerColormapDataType {
    return {
      selected: Infinity,
      clrmap_names: new Array(78).fill(''),
    };
  },
  created: function () {
    for (let i = 0; i < this.clrmap_names.length; i++) {
      const clrindex = i + 1;
      const clrmapname =
        clrindex < 10 ? `clrmap_0${clrindex}` : `clrmap_${clrindex}`;
      this.clrmap_names[i] = clrmapname;
    }
  },
  //watch: {
  //  selected: function (clrindex: number) {
  //    console.log(clrindex);
  //    this.$parent.bufColorIndex = clrindex;
  //    console.log(this.$parent)
  //  },
  //},
});
</script>
