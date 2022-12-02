<template>
    <div id="main-screen">
        <ruler :viewer="viewer" />
        <layerselecter :layer_manager="layer_manager" />
    </div>
</template>

<script>
import layerselecter from './LayerSelector/Layerselecter.vue';
import ruler from './Dcwmt-ruler.vue';

// import define from '../define.js';
import Viewer from '../modules/viewer/viewer.js';
import Layer from '../modules/layer/layer.js';
import LayerManager from '../modules/layerManager/layerManager.js';
import WmtsLibIdentifer from '../modules/utility/wmtsLibIdentifer';

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
    mounted: async function() {
        await this.read_configfile();
        await this.draw();
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
        drawingOptions: {
            get: function() {
                return this.$store.getters.drawingOptions;
            },
            set: function ( value ) {
                this.$store.commit("setDrawingOptions", value);
            }
        }
    },
    methods: {
        read_configfile: async function() {
            const url = "./dcwmtconf.json";

            // Fetch data in json file 
            const promise = new Promise( resolve => {
                const request = new XMLHttpRequest();
                request.open('GET', url);
                request.responseType = "json";
                request.send();
                request.onload = () => {
                    const dcwmtconf = request.response;

                    // store in this calss
                    this.definedOptions = dcwmtconf.definedOptions;
                    // store in vuex
                    this.drawingOptions = dcwmtconf.drawingOptions;

                    resolve();
                }
            });
            
            await promise;
        },
        draw: async function() {
            // Select WMTS librarys
            const axis = this.definedOptions.axis;
            const projection = this.drawingOptions.projection;
            let wli = undefined;
            if ( axis.find( a => a == "lon" ) ) {
                if ( projection == "3D Sphere" ) {
                    wli = new WmtsLibIdentifer("Cesium");
                } else {
                    if ( !projection ) {
                        this.drawingOptions = { projection: "EPSG:3857" };
                    }
                    wli = new WmtsLibIdentifer("OpenLayers");
                }
            } else if ( axis.find( a => a == "x" ) ) {
                wli = new WmtsLibIdentifer("leaflet");
            } else {
                throw new Error("An axis given to dcwntconf.json don't adapt dcwmt. Give \"lon lat\"or \"x y\"");
            }

            // Create Viewer instance
            const zoomNativeLevel = {
                min: Math.max( ...this.definedOptions.variables.map( v => v.minZoom ) ),
                max: Math.min( ...this.definedOptions.variables.map( v => v.maxZoom ) ),
            };
            const viewer_option = {
                wmtsLibIdentifer: wli,
                projection: this.drawingOptions.projection,
                zoomNativeLevel: zoomNativeLevel,
                zoom: this.drawingOptions.zoom || 0,
                center: this.drawingOptions.center || [0, 0]
            };
            const viewer_obj = new Viewer(viewer_option);
            this.viewer = viewer_obj.getSuitableViewer();

            // Create Layer Manager instance
            this.layer_manager = new LayerManager(wli, this.viewer);

            // Create layers instance and Add layers to layer manager
            const root = this.definedOptions.root;
            for ( const layer of this.drawingOptions.layers ) {
                // Create URL to tiles, variable index, and min-max range
                let url_ary, variable, minmax;
                switch(layer.type) {
                    case "tone":
                    case "vector": {
                        const pq_names = layer.name.split('-');
                        url_ary = pq_names.map( pq_name => root.concat(`/${pq_name}`) );
                        variable = layer.variable;
                        const fixed = layer.fixed;
                        url_ary = url_ary.map( url => url.concat(`/${this.definedOptions.variables[variable].fixed[fixed]}`) );
                        minmax = layer.minmax;
                        break;
                    } case "contour": {
                        const baselayer = this.drawingOptions.layers.find( l => l.name == layer.base );
                        url_ary = new Array( root.concat(`${baselayer.name}`) );
                        variable = baselayer.variable;
                        const fixed = baselayer.fixed;
                        url_ary = url_ary.map( url => url.concat(`/${this.definedOptions.variables[variable].fixed[fixed]}`) );
                        minmax = baselayer.minmax;
                        break;
                    }
                }

                // Create layer instance
                const layer_option  = {
                    name: layer.name,
                    url: url_ary,
                    tileSize: this.definedOptions.variables[variable].tileSize,
                    zoomLevel: { 
                        min: this.definedOptions.variables[variable].minZoom,
                        max: this.definedOptions.variables[variable].maxZoom
                    },
                    clrindex: layer.clrindex,
                    range: { min: minmax[0], max: minmax[1] },
                    diagram: layer.type
                };
                const layer_obj = new Layer(layer_option);

                // Add layer to layer manager
                await this.layer_manager.addLayer(layer_obj, layer.name);
            }
            // for ( const layer_types of [this.tone, this.vector] ) {
            //     for ( const layer_type of layer_types ) {

            //         // 指定していない次元であっても, 次元名と値が一致していれば変更する.
            //         let fixed = "";
            //         if ( typeof this.config.fixedDim != "string" ) {
            //             fixed = layer_type.fixed[0];
            //         } else {
            //             const ary_fixedDim = this.config.fixedDim.split('/');
            //             fix: for ( const fix of ary_fixedDim ) {
            //                 for ( const ltf of layer_type.fixed ) {
            //                     if ( ltf.includes(fix) ) {
            //                         fixed = fixed.concat(`${fix}/`);
            //                         continue fix;
            //                     }
            //                 }
            //             }
            //             fixed = fixed.slice( 0, -1 );
            //         }

            //         const url = layer_type.url.map( v => v.concat(`/${fixed}`) );
            //         const layer_option = {
            //             name: layer_type.name,
            //             url: url,
            //             size: layer_type.size,
            //             level: { min: 0, max: layer_type.maximumLevel },
            //             clrindex: this.config.clrindex,
            //             math_method: this.config.mathMethod,
            //         };

            //         const toneRange = this.config.toneRange;
            //         if ( layer_option.name === toneRange.name ) {
            //             layer_option.range = { min: toneRange.min, max: toneRange.max };
            //         }

            //         const layer_obj = new layer(layer_option);
            //       
            //         await this.layer_manager.addBaseLayer(layer_obj, layer_type.name);
            //         await this.layer_manager.addLayer(layer_obj, layer_type.name);
            //     }
            // }

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
