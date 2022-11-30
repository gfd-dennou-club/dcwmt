<template>
    <div id="main-screen">
        <ruler :viewer="viewer" />
        <layerselecter :layer_manager="layer_manager" />
    </div>
</template>

<script>
import layerselecter from './LayerSelector/Layerselecter.vue';
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
        },
        layers: function(){
            if ( !this.layer_manager ){
               return [];
            } else {
               return this.layer_manager.getLayers();
            }
        },
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
            const layers = this.$store.getters.layers;
            // console.log(layers)
            this.layer_manager = new layerManager(wli, this.viewer, layers);

            // レイヤの作成とマネージャへの追加
            for ( const layer_types of [this.tone, this.vector] ) {
                for ( const layer_type of layer_types ) {

                    // 指定していない次元であっても, 次元名と値が一致していれば変更する.
                    let fixed = "";
                    if ( typeof this.config.fixedDim != "string" ) {
                        fixed = layer_type.fixed[0];
                    } else {
                        const ary_fixedDim = this.config.fixedDim.split('/');
                        fix: for ( const fix of ary_fixedDim ) {
                            for ( const ltf of layer_type.fixed ) {
                                if ( ltf.includes(fix) ) {
                                    fixed = fixed.concat(`${fix}/`);
                                    continue fix;
                                }
                            }
                        }
                        fixed = fixed.slice( 0, -1 );
                    }

                    const url = layer_type.url.map( v => v.concat(`/${fixed}`) );
                    const layer_option = {
                        name: layer_type.name,
                        url: url,
                        size: layer_type.size,
                        level: { min: 0, max: layer_type.maximumLevel },
                        clrindex: this.config.clrindex,
                        math_method: this.config.mathMethod,
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
            console.log(layersprops)
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
        layers: function(){
            this.$store.commit("setLayers", this.layers); 
        }
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
