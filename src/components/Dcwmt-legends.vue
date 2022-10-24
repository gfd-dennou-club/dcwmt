<template>
    <div>
        <v-row no-gutters>
            <v-col cols="12" align="center">
                <colorbar width="500" height="50" :clrindex="clrindex" />
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="3" align="center">
                <v-text-field
                    height="50"
                    v-model="min"
                    label="min"
                    outlined
                    hide-details="auto"
                    append-icon="✓"
                    @click:append="changeRange()"
                />
            </v-col>
            <v-col cols="6" align="center">
                {{ legendinfo.name }}
            </v-col>
            <v-col cols="3"  align="center">
                <v-text-field
                    height="50"
                    v-model="max"
                    label="max"
                    outlined
                    hide-details="auto"
                    append-icon="✓"
                    @click:append="changeRange()"
                />
            </v-col>
        </v-row>
    </div>
</template>

<script>
    import colorbar from "./DrawerContents/Drawer-colormap/Colorbar.vue";

    export default {
        components: {
            colorbar,
        },
        data: () => ({
            updatedlayerProp: undefined,
        }),
        computed: {
            clrindex: function() {
                return this.$store.getters.config.clrindex;
            },
            layersprops: function () {
                return this.$store.getters.layersprops;
            },
            selectedlayer: function () {
                return this.$store.getters.selectedlayer;
            },
            toneRange: {
                get: function () {},
                set: function ( value ) {
                    this.$store.commit("setConfig", { toneRange: value });
                }
            },
            legendinfo: {
                get: function () {
                    const isExist = prop => prop.name === this.selectedlayer;
                    const prop = this.layersprops.find(isExist);
                    if ( !prop ) {
                        if ( this.layersprops.length === 0 ) {
                            return { name: "？", max: "？", min: "？" };
                        } else {
                            return this.layersprops[0];
                        }
                    } else {
                        return prop;
                    }
                }
            },
            min: {
                get: function () {  return this.legendinfo.min; },
                set: function ( value ) {
                    this.updatedlayerProp = {...this.legendinfo, min: parseInt(value)}
                }
            },
            max: {
                get: function () {  return this.legendinfo.max; },
                set: function ( value ) {
                    this.updatedlayerProp = {...this.legendinfo, max: parseInt(value)}
                }
            },
        },
        methods: {
            changeRange: function () {
                const isUpdatedlayer = layer => layer.name === this.updatedlayerProp.name;
                const updatedlayerProp = this.layersprops.find(isUpdatedlayer);
                if ( 
                    updatedlayerProp 
                    && (updatedlayerProp.min !== this.updatedlayerProp.min 
                    || updatedlayerProp.max !== this.updatedlayerProp.max)
                ) {
                    this.toneRange = this.updatedlayerProp;
                }
            }
        },
    }
</script>
