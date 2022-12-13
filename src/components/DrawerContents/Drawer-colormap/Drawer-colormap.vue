<template>
  <v-list subheader tile>
    <v-subheader>カラーマップの切り替え</v-subheader>
    <v-list-item-group v-model="selected">
      <v-list-item v-for="(clrmap_name, i) in clrmap_names" :key="i" link>
        <v-list-item-content>
          <v-list-item-title>{{ clrmap_name }}</v-list-item-title>
          <colorbar width="100" height="20" :clrindex="i" />
        </v-list-item-content>
      </v-list-item>
    </v-list-item-group>
  </v-list>
</template>

<script lang="ts">
import colorbar from './Colorbar.vue';

type DrawerColormapDataType = {
  selected: number,
  clrmap_names: Array<string>
}

export default {
  components: {
    colorbar,
  },
  data(): DrawerColormapDataType {
    return {
      selected: 1,
      clrmap_names: new Array(78).fill(""),
    };
  },
  created: function () {
    for (let i = 0; i < this.clrmap_names.length; i++) {
      const clrindex = i + 1;
      const clrmapname = clrindex < 10 ? `clrmap_0${clrindex}` : `clrmap_${clrindex}`;
      this.clrmap_names[i] = clrmapname;
    }
  },
  watch: {
    selected: function (clrindex: number) {
      this.$store.commit('setConfig', { clrindex: clrindex });
    },
  },
};
</script>
