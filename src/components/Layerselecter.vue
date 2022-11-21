<template>
    <div class="fab-button">
        <v-dialog
            v-model="fab"
        >
            <template v-slot:activator="{ on, attrs }" >
                <v-btn
                    evelation="2"
                    fab
                    tile
                    v-bind="attrs"
                    v-on="on"
                />
            </template>

            <!--
            <div id=toolbar>
                <table> 
                    <tbody>
                        <tr 
                            v-for="(layer, index) in layers"
                            :key="index"
                        >
                            <td>
                                <input 
                                    type="checkbox" 
                                    :checked="layer.show" 
                                    @click="toggleDisplay(layer)"
                                >
                            </td>
                            <td>
                                <span v-if="!layer.isBaselayer"> 
                                    {{ layer.name }} 
                                </span>
                                <select 
                                    v-if="layer.isBaselayer"
                                    v-model="selectedlayer"
                                >
                                    <option 
                                        v-for="(baselayer, index) in baselayers"
                                        :key="index"
                                    >
                                        {{ baselayer.name }}
                                    </option>
                                </select>
                            </td>
                            <td>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="1" 
                                    step="0.1" 
                                    :value="layer.alpha" 
                                    @change="changeLayerAlpha(layer, $event.target.value)"
                                >
                            </td>
                            <td>
                                <button type="button" @click="raise(layer)" v-show="canRaise(index)">
                                    ▲
                                </button>
                            </td>
                            <td>
                                <button type="button" @click="lower(layer)" v-show="canLower(index)">
                                    ▼
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            -->
        </v-dialog>
    </div>
</template>

<script>
import panel from '

export default {
    props: [ "layer_manager" ],
    data: () => ({
        fab: false,
    }),
    methods: {
        raise: function ( layer ) {
            this.layer_manager.raise(layer);
        },
        lower: function ( layer ) {
            this.layer_manager.lower(layer);
        },
        isSelectablelayer: function ( layer ) {
            return layer.isBaselayer;
        },
        canRaise: function ( layerindex ) {
            return layerindex > 0;
        },
        canLower: function ( layerindex ) {
            return layerindex >= 0 && layerindex < this.layers.length - 1;
        },
        toggleDisplay: function ( layer ) { 
            const isLayer = _layer => layer === _layer;
            const activelayer = this.layers.find(isLayer);
            activelayer.setShow(!activelayer.show);
            this.layer_manager.update();
        },
        changeLayerAlpha: function ( layer, alpha ) {
            const isLayer = _layer => layer === _layer;
            const activelayer = this.layers.find(isLayer);
            alpha = parseFloat(alpha);
            activelayer.setAlpha(alpha);
            this.layer_manager.update();
        }
    },
    watch: {
        selectedlayer: function ( baselayer ) {
            const isBaseLayer = layer => layer.name === baselayer;
            baselayer = this.baselayers.find(isBaseLayer);

            const isActiveLayer = layer => layer.isBaselayer;
            const activelayerIndex = this.layers.findIndex(isActiveLayer);
            const activelayer = this.layers[activelayerIndex];
            
            const show = activelayer.show;
            const alpha = activelayer.alpha;
            this.layer_manager.remove(activelayer);
            this.layer_manager.add(baselayer, activelayerIndex);
            baselayer.show = show;
            baselayer.alpha = alpha;
            this.layer_manager.update();
        },
    },
    computed: {
        baselayers: function () {
            if ( !this.layer_manager ) {
                return [];
            } else {
                return this.layer_manager.getBaseLayers();
            }
        },
        layers: function () {
            if ( !this.layer_manager ){
                return [];
            } else {
                return this.layer_manager.getLayers();
            }
        },
        selectedlayer: {
            get: function () {
                return this.$store.getters.selectedlayer;
            },
            set: function ( value ) {
                this.$store.commit("setSelectedLayer", value);
            }
        }
    }
}
</script>

<style scoped>
    .fab-button {
        position: absolute;
        top: 15px;
        right: 15px;
        z-index: 2;
    }
    .v-speed-dial {
        position: absolute !important;
    }
    #toolbar {
        background: rgba(255, 255, 255, 0.8);
        padding: 4px;
        border-radius: 4px;
    }
    #toolbar input {
      vertical-align: middle;
      padding-top: 2px;
      padding-bottom: 2px;
    }
    #toolbar table tr {
      transform: translateY(0);
      transition: transform 0.4s ease-out;
    }
</style>
