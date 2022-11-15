<template>
    <div id="main-screen">
        <ruler :viewer="viewer" />
        <layerselecter :layer_manager="layer_manager" />
    </div>
</template>

<script>
import layerselecter from './Layerselecter.vue';
import ruler from './Dcwmt-ruler.vue';

import define from '../define.js';
import viewer from '../modules/viewer/viewer.js';
import layer from '../modules/layer/layer.js';
import layerManager from '../modules/layerManager/layerManager.js';

export default {
    components: {
        layerselecter,
        ruler,
    },
    data: () => ({  
        tone: [],
        vector: [],
        layer_manager: undefined,
        viewer: undefined,
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
        },
        zoom: {
            get: function () {
                return this.$store.getters.zoom;
            },
            set: function ( value ) {
                this.$store.commit("setZoom", value); 
            }
        },
        center: {
            get: function () {
                return this.$store.getters.center;
            },
            set: function ( value ) {
                this.$store.commit("setCenter", value); 
            }
        }
    },
    methods: {
        read_deinejs: function() {
            const root = define.ROOT;

            define.TONE.forEach((pq) => {
                const url_ary = root.concat(`/${pq.NAME}`);
                this.tone.push({
                    name: pq.NAME,
                    url: new Array(url_ary),
                    fixed: pq.FIXED,
                    size: pq.SIZE,
                    maximumLevel: pq.MAXIMUMLEVEL,
                });
            });

            define.VECTOR.forEach((pq) => {
                const pq_name = pq.NAME[0].concat("-", pq.NAME[1]);
                const urls_ary = pq.NAME.map( name => root.concat(`/${name}`) );
                this.vector.push({
                    name: pq_name,
                    url: urls_ary,
                    fixed: pq.FIXED,
                    size: pq.SIZE,
                    maximumLevel: pq.MAXIMUMLEVEL,
                });
            });
        },
        draw: async function() {

            // ビュワーの作成
            const wli = this.config.wmtsLibIdentifer;
            const viewer_obj = new viewer({ 
                wmtsLibIdentifer: wli,
                projection: this.config.projection,
                zoom: this.zoom,
                center: this.center
            });
            this.viewer = viewer_obj.getSuitableViewer();

            // レイヤマネージャーを作成
            this.layer_manager = new layerManager(wli, this.viewer);

            // レイヤの作成とマネージャへの追加
            for ( const layer_types of [this.tone, this.vector] ) {
                for ( const layer_type of layer_types ) {
                    const fixed = layer_type.fixed.find( v => v === this.config.fixedDim ) || layer_type.fixed[0];
                    const url = layer_type.url.map( v => v.concat(`/${fixed}`) );
                    const layer_option = {
                        name: layer_type.name,
                        url: url,
                        size: layer_type.size,
                        level: { min: 0, max: layer_type.maximumLevel },
                        clrindex: this.config.clrindex,
                    };

                    const toneRange = this.config.toneRange;
                    if ( layer_option.name === toneRange.name ) {
                        layer_option.range = { min: toneRange.min, max: toneRange.max };
                    }

                    const layer_obj = new layer(layer_option);
                  
                    await this.layer_manager.addBaseLayer(layer_obj, layer_type.name);
                    await this.layer_manager.addLayer(layer_obj, layer_type.name);
                }
            }

            // レイヤーマネージャのセットアップ
            let layersprops = this.layer_manager.setup(this.viewer);
            layersprops = await Promise.all(layersprops);
            this.layersprops = layersprops.filter( v => v );
        }
    },
    watch: {
        config: {
            handler: function(){
                if ( this.viewer.getView ) {
                    const view = this.viewer.getView();
                    this.zoom = view.getZoom();
                    this.center = view.getCenter();
                }
                this.draw();
            },
            deep: true,
        },
    }
}
</script>

<style scoped>
    div#main-screen {
        height: 100%;
        display: flex;
    }

    div#main-screen>div#map {
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        border: none;
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
