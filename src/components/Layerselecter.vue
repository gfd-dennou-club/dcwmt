<template>
    <v-speed-dial
        v-model="fab"
        direction="left"
        top
        right
    >
        <template v-slot:activator >
            <v-btn
                v-model="fab"
                evelation="2"
                fab
                tile
            />
        </template>
        <div id=toolbar>
            <table> 
                <tbody>
                    <tr 
                        v-for="(layer, index) in layers"
                        :key="index"
                    >
                        <td><input type="checkbox" v-model="layer.show" ></td>
                        <td>
                            <span v-if="!layer.isBaseLayer"> 
                                {{ layer.name }} 
                            </span>
                            <select 
                                v-if="layer.isBaseLayer"
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
                            <input type="range" min="0" max="1" step="0.1" v-model="layer.alpha">
                        </td>
                        <td>
                            <button type="button" @click="raise(layer, index)" v-show="canRaise(index)">
                                ▲
                            </button>
                        </td>
                        <td>
                            <button type="button" @click="lower(layer, index)" v-show="canLower(index)">
                                ▼
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </v-speed-dial>
</template>

<script>
export default {
    props: [ "layer_manager" ],
    data: () => ({
        fab: false,
        uplayer: undefined,
        downlayer: undefined,
        selectedlayer: undefined,
    }),
    methods: {
        raise: function ( layer, index ) {
            console.log("Click!", layer.name, index);
            this.layer_manager.raise(layer);
            this.layer_manager.update();
        },
        lower: function ( layer, index ) {
            console.log("Click!", layer.name, index);
            this.layer_manager.lower(index);
            this.layer_manager.update();
        },
        isSelectablelayer: function ( layer ) {
            return layer.isBaseLayer;
        },
        canRaise: function ( layerindex ) {
            return layerindex > 0;
        },
        canLower: function ( layerindex ) {
            return layerindex >= 0 && layerindex < this.layers.length - 1;
        }
    },
    watch: {
        selectedlayer: function ( baselayer ) {
            const isBaseLayer = layer => layer.name === baselayer;
            baselayer = this.baselayers.find(isBaseLayer);

            const isActiveLayer = layer => layer.isBaseLayer;
            const activelayerIndex = this.layers.findIndex(isActiveLayer);
            const activelayer = this.layers[activelayerIndex];
            
            const show = activelayer.show;
            const alpha = activelayer.alpha;
            this.layer_manager.remove(activelayer, false);
            this.layer_manager.add(baselayer, this.layers.length - activelayerIndex - 1);
            baselayer.show = show;
            baselayer.alpha = alpha;
        }
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
        }
    }
}
</script>

<style scoped>
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
