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
      <dcwmt_footer />
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import dcwmt_map from './Dcwmt-map.vue';
import dcwmt_legend from './Dcwmt-legends.vue';
import dcwmt_navigationdrawer from './Dcwmt-navigationdrawer.vue';
import tab from './Tab.vue';
import dcwmt_footer from './Dcwmt-footer.vue';

type AppDataType = {
  canDraw: boolean;
  nowlink: string;
  oldlink: string;
};

export default {
  components: {
    dcwmt_map,
    dcwmt_legend,
    dcwmt_navigationdrawer,
    tab,
    dcwmt_footer,
  },
  data: (): AppDataType => ({
    canDraw: false,
    nowlink: '',
    oldlink: '',
  }),
  methods: {
    selectMenu: function (link: string) {
      if (!this.oldlink || this.oldlink === link) {
        this.canDraw = !this.canDraw;
      }
      this.nowlink = link;
      this.oldlink = link;
    },
  },
};
</script>
