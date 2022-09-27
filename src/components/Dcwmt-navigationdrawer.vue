<template>
    <v-navigation-drawer 
        app
        v-model="canDraw"
    >
        <drawer_colormap v-if="nowlink === 'カラーマップ関連'" />
        <drawer_tone v-if="nowlink === 'トーン関連'" />
    </v-navigation-drawer>
</template>

<script>
import drawer_colormap from './DrawerContents/Drawer-colormap/Drawer-colormap.vue';
import drawer_tone from './DrawerContents/Drawer-tone/Drawer-tone.vue';

export default {
    components: {
        drawer_colormap,
        drawer_tone,
    },
    props: ["nowlink", "canDraw"],
}
</script>
