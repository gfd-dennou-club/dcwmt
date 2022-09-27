<template>
    <v-app id="app">
        <v-navigation-drawer 
            app
            v-model="drawer"
        >
            <menu_colormap v-if="drawerComponent === 'カラーマップ関連'" />
            <menu_tone v-if="drawerComponent === 'トーン関連'" />
        </v-navigation-drawer>
        <v-app-bar app>
            <tab @onClick="selectMenu" />
        </v-app-bar>
        <v-main app>
            <dcwmt_map />
        </v-main>
        <v-footer app>
            <legends />
        </v-footer>
    </v-app>
</template>

<script>
import dcwmt_map from './Dcwmt-map.vue';
import tab from './Tab.vue';
import { menu_colormap, menu_tone } from './MenuContents/Menu.js';
import legends from './Legends.vue';

export default {
    components: {
        dcwmt_map,
        tab,
        menu_colormap,
        menu_tone,
        legends,
    },
    data: () => ({
        drawerComponent: undefined,
        drawer: false,
        oldlink: undefined,
    }),
    methods: {
        selectMenu(link) {
            if(!this.oldlink || this.oldlink === link) {
                this.drawer = !this.drawer;
            }
            this.drawerComponent = link;
            this.oldlink = link; 
        }
    }
};
</script>
