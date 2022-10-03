<template>
    <v-list subheader tile>
        <v-subheader>描画方法の切り替え</v-subheader>
        <v-list-item-group v-model="selected">
            <v-list-item
                v-for="(drawing_method, i) in drawing_methods"
                :key="i"
                link
            >
                <v-list-item-title>
                    {{drawing_method}}
                </v-list-item-title>
            </v-list-item>
        </v-list-item-group>
    </v-list>
</template>

<script>
import wmtsLibIdentifer from "../../../modules/utility/wmtsLibIdentifer";

export default {
    data: () => ({
        selected: 1,
        drawing_methods: [
            "2次元平面への投影", "３次元球面への投影"
        ],
    }),
    watch: {
        selected: function(nowmethod){
            if (nowmethod !== undefined) {
                const config_obj = { wmtsLibIdentifer: undefined };
                switch(nowmethod) {
                    case 1 :
                        config_obj.wmtsLibIdentifer = new wmtsLibIdentifer("Cesium");
                        break;
                    case 0 :
                        config_obj.wmtsLibIdentifer = new wmtsLibIdentifer("OpenLayers");
                        break;
                }
                this.$store.commit("setConfig", config_obj);
            }
        }
    }
}
</script>