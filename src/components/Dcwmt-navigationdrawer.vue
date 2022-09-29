<template>
    <v-navigation-drawer 
        app
        :value="canDraw"
    >
        <drawer_colormap v-if="nowlink === 'カラーマップ関連'" />
        <drawer_tone v-if="nowlink === 'トーン関連'" />
        <drawer_figure v-if="nowlink === '図'" />
    </v-navigation-drawer>
</template>

<script>
import drawer_colormap from './DrawerContents/Drawer-colormap/Drawer-colormap.vue';
import drawer_tone from './DrawerContents/Drawer-tone/Drawer-tone.vue';
import drawer_figure from './DrawerContents/Drawer-figure/Drawer-figure.vue';

export default {
    components: {
        drawer_colormap,
        drawer_tone,
        drawer_figure,
    },
    props: ["nowlink", "canDraw"],
}
</script>
