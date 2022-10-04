<template>
    <div id="main-screen">
        <layerselecter :layer_manager="layer_manager" />
    </div>
</template>

<script>
import layerselecter from './Layerselecter.vue';

import define from '../define.js';
import viewer from '../modules/viewer/viewer.js';
import layer from '../modules/layer/layer.js';
import layerManager from '../modules/layerManager/layerManager.js';

export default {
    components: {
        layerselecter,
    },
    data: () => ({  
        tone: [],
        vector: [],
        projection: [ "メルカトル図法", "正距方位図法", "モルワイデ図法", "サンソン図法" ],
        layer_manager: undefined,
    }),
    created: function() {
        this.read_deinejs();
    },
    mounted: function() {
        this.draw();
    },
    computed: {
        config: function() {
            return this.$store.getters.config;
        },
        layersprops: {
            get: function () {
                return this.$store.getters.layersprops;
            },
            set: function ( value ) {
                this.$store.commit("setLayersProps", value);
            }
        }
    },
    methods: {
        read_deinejs: function() {
            const root = define.ROOT;

            define.TONE.forEach((pq) => {
                const url_ary = pq.FIXED.map(fixed => root.concat(`/${pq.NAME}/${fixed}`));
                this.tone.push({
                    name: pq.NAME,
                    url: url_ary,
                    size: pq.SIZE,
                    maximumLevel: pq.MAXIMAMLEVEL,
                });
            });

            define.VECTOR.forEach((pq) => {
                const pq_name = pq.NAME[0].concat("-", pq.NAME[1]);
                const urls_ary = pq.NAME.map(name => root.concat(`/${name}/${pq.FIXED[0]}`));
                this.vector.push({
                    name: pq_name,
                    url: urls_ary,
                    size: pq.SIZE,
                    maximumLevel: pq.MAXIMUMLEVEL,
                });
            });
        },
        draw: async function() {
            // ビュワーの作成
            const wli = this.config.wmtsLibIdentifer;
            const viewer_obj = new viewer({ wmtsLibIdentifer: wli });
            const suitable_viewer = viewer_obj.getSuitableViewer();

            // レイヤマネージャーを作成
            this.layer_manager = new layerManager(wli, suitable_viewer);

            // レイヤの作成とマネージャへの追加
            const layer_types = [this.tone, this.vector];
            layer_types.forEach(layer_type => {
                layer_type.forEach(layer_info => {
                    const layer_option = {
                        name: layer_info.name,
                        url: layer_info.url,
                        size: layer_info.size,
                        level: { min: 0, max: layer_info.maximumLevel },
                        clrindex: this.config.clrindex,
                        alpha: 1.0,
                    };

                    const layer_obj = new layer(layer_option);
                    this.layer_manager.addBaseLayer(layer_obj, layer_info.name);
                    this.layer_manager.addLayer(layer_obj, layer_info.name);
                })
            });

            // レイヤーマネージャのセットアップ
            let layersprops = this.layer_manager.setup(suitable_viewer);
            layersprops = await Promise.all(layersprops);
            this.layersprops = layersprops.filter( v => v );
        }
    },
    watch: {
        config: {
            handler: function(){
                this.draw();
            },
            deep: true,
        }
    }
}
</script>

<style scoped>
    div#main-screen {
        height: 99%;
        display: flex;
    }
</style>