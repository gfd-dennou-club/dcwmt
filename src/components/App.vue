<template>
  <v-app id="app">
    <dcwmt_navigationdrawer :nowlink="nowlink" :canDraw="canDraw" />
    <v-app-bar app>
      <tab @onClick="selectMenu" />
    </v-app-bar>
    <v-main app>
      <dcwmt_map />
    </v-main>
    <v-footer app>
      <dcwmt_footer :viewerController="viewerController" />
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import dcwmt_map from './Dcwmt-map.vue';
//import dcwmt_legend from './Dcwmt-legends.vue';
import dcwmt_navigationdrawer from './Dcwmt-navigationdrawer.vue';
import tab from './Tab.vue';
import dcwmt_footer from './Dcwmt-footer.vue';
import { ViewerController } from '@/modules/viewer/ViewerController';

type AppDataType = {
  canDraw: boolean;
  nowlink: string;
};

export default Vue.extend({
  components: {
    dcwmt_map,
    // dcwmt_legend,
    dcwmt_navigationdrawer,
    tab,
    dcwmt_footer,
  },
  data(): AppDataType {
    return {
      canDraw: false,
      nowlink: '',
    };
  },
  methods: {
    selectMenu: function (link: string) {
      if (!this.nowlink || this.nowlink === link) {
        this.canDraw = !this.canDraw;
      }
      this.nowlink = link;
    },
  },
  computed: {
    viewerController: function(): ViewerController | undefined {
      // @ts-ignore
      return this.$refs.map?.viewerController;
    }
  }
});
</script>