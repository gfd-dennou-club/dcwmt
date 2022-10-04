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
                    v-model="legendinfo.min"
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
                    v-model="legendinfo.max"
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
            temp_layersparops: [],
        }),
        computed: {
            clrindex: function() {
                return this.$store.getters.config.clrindex;
            },
            layersprops: {
                get: function () {
                    return this.$store.getters.layersprops;
                },
                set: function ( value ) {
                    this.$store.commit("setLayersProps", value);
                }
            },
            selectedlayer: function () {
                return this.$store.getters.selectedlayer;
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
                },
                set: function ( value ) {
                    let layersprops = this.layersprops;
                    const isExist = prop => prop.name === this.selectedlayer;
                    let propIndex = this.layersprops.findIndex(isExist);
                    layersprops[propIndex] = { ...value };
                    this.temp_layersprops = layersprops;
                }
            }
        },
        methods: {
            changeRange: function () {
                if ( this.temp_layersprops.length !== 0 ) {
                    this.layersprops = this.temp_layersprops;
                    console.log(this.layersprops)
                }
            }
        },
        watch: {
            'legendinfo.min': function (min) {
                min = parseFloat(min)
                this.legendinfo = { min };
            },
            'legendinfo.max': function (max) {
                max = parseFloat(max);
                this.legendinfo = { max };
            }
        }
    }
</script>
