<template>
  <v-navigation-drawer app :value="canDraw">
    <drawer_colormap v-if="nowlink === 'カラーマップの切り替え'" />
    <drawer_math v-if="nowlink === '数学的操作'" />
    <drawer_figure v-if="nowlink === '描画方法の切り替え'" />
  </v-navigation-drawer>
</template>

<script lang="ts">
import drawer_math from './DrawerContents/Drawer-math/Drawer-math.vue';
import drawer_colormap from './DrawerContents/Drawer-colormap/Drawer-colormap.vue';
import drawer_figure from './DrawerContents/Drawer-figure/Drawer-figure.vue';

export default {
    components: {
        drawer_colormap,
        drawer_figure,
        drawer_math,
    },
    props: {
        nowlink: String,
        canDraw: Boolean
    }
</script>
