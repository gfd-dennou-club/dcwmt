<template>
    <v-card>
        <v-container>
            <v-row dense>
                <v-col
                    v-for="(layer, index) in layers"
                    :key="index"
                    cols="12"
                >
                    <v-card>
                        <v-card-text>
                            <div style="display: flex;">
                                <v-switch
                                    :input-value="layer.show"
                                    @change="toggleDisplay(layer)"
                                    inset
                                    style="float: left; margin: 0; padding: 0;"
                                />
                                <div v-if="!layer.isBaselayer">
                                    {{ layer.name }}
                                </div>
                                <div v-if="layer.isBaselayer" style="display: flex;">
                                    <v-select
                                        v-model="selectedlayer"
                                        :items="baselayers"
                                        item-text="name"
                                        dense
                                        style="margin: 0; padding: 0;"
                                    >
                                        <template v-slot:prepend>
                                            <div style="font-size: small;">BaseLayer</div>
                                        </template>
                                    </v-select>
                                </div>
                                <div style="margin-left: auto;">
                                    <v-btn
                                        icon
                                        x-small
                                        v-show="canRaise(index)"
                                        @click="raise(layer)"
                                        color="primary"
                                    >
                                        ▲
                                    </v-btn>
                                    <v-btn
                                        icon
                                        x-small
                                        v-show="canLower(index)"
                                        @click="lower(layer)"
                                        color="primary"
                                    >
                                        ▼
                                    </v-btn>
                                </div>
                            </div>
                            opacity = {{ layer.alpha }}
                            <v-slider
                                min="0"
                                max="1"
                                step="0.1"
                                hide-details
                                :value="layer.alpha"
                                @input="value => changeLayerAlpha(layer, value)"
                            />
                            <div v-if="layer.name.indexOf('contour') != -1">
                                threshold interval
                                <v-slider
                                    min="0"
                                    max="10"
                                    hide-details
                                />
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-card> 
</template>

<script>

export default {
    props: [ "layer_manager" ],
    data: () => ({
        
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
        },
    }
}
</script>

<style scoped>
    .v-card {
        background: rgba(255, 255, 255, 0.8) !important;
        border-radius: 4px;
    }
</style>
