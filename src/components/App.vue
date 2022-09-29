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
            <dcwmt_legend />
        </v-footer>
    </v-app>
</template>

<script>
import dcwmt_map from './Dcwmt-map.vue';
import tab from './Tab.vue';
import dcwmt_legend from './Dcwmt-legends.vue';
import dcwmt_navigationdrawer from './Dcwmt-navigationdrawer.vue';

export default {
    components: {
        dcwmt_map,
        tab,
        dcwmt_legend,
        dcwmt_navigationdrawer,
    },
    data: () => ({
        canDraw: false,
        nowlink: undefined,
        oldlink: undefined,
    }),
    methods: {
        selectMenu(link) {
            if(!this.oldlink || this.oldlink === link) {
                this.canDraw = !this.canDraw;
            }
            this.nowlink = link;
            this.oldlink = link; 
        },
    }
};
</script>
