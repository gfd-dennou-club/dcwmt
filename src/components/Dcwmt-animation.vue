<template>
    <div>
        <div
            v-for="( variable, i ) in variables"
            :key="i"
        >
            <div style="display: flex;">
                <v-subheader>
                    {{variable.title + "=" + variable.tick_labels[variable.value]}}
                </v-subheader>
                <v-btn 
                    outlined
                    color="red"
                    style="margin: 0 0 0 auto;"
                    @click="replay(i)"
                >
                    {{ variable.clicked ? "▶︎" : "■" }}
                </v-btn>
            </div>
                <v-slider
                    v-model="variable.value"
                    :tick-size="variable.step"
                    :step="variable.step"
                    :min="variable.min"
                    :max="variable.max"
                    ticks="always"
                    @mouseup="changeURL()"
                ></v-slider>
        </div>
    </div>
</template>

<script lang="ts">
import define from '../define';

export default {
    data: () => ({
        variables: [],
        intervalID: null,
        sec_per_frame: 2,
        name: null,
        length: 0,
    }),
    computed: {
        fixedDim: {
            get: function(){
                return this.$store.getters.config.fixedDim;
            },
            set: function( value ){
                this.$store.commit("setConfig", { fixedDim: value }) 
            }
        },
        layers: function() {
            return this.$store.getters.layers;
        }
    },
    methods: {
        replay: async function ( index ) {
            this.variables[index].clicked = !this.variables[index].clicked;

            if ( this.variables[index].clicked ) {
                const delay = this.sec_per_frame * 1000;
                this.intervalID = setInterval( this.animation, delay, index );
            } else {
                clearInterval(this.intervalID);
                this.intervalID = null;
            }
        },
        changeURL: function() {
            let buf = "";
            this.variables.forEach( v => {
                buf = buf.concat(`${v.title}=${v.tick_labels[v.value]}/`);
            });
            this.fixedDim = buf.slice(0, -1);
        },
        animation: function( index ) {
            this.variables[index].value += 1;
            const variable = this.variables[index];
            if ( variable.value >= variable.max ) {
                this.variables[index].value = 0;   
            }

            this.changeURL();
        },
        update: function() {
            // if ( this.layers.length < this.length ) {
            //     return;
            // }

            // this.length = this.layers.length;

            // let fixed = define.TONE[0].FIXED || define.VECTOR[0].FIXED;
            let fixed = define.VECTOR[0].FIXED;
            // if ( this.layers.length == 0 ) {}
            // else {
            //     const top = this.layers.length - 1;
            //     const diagrams = this.layers[top].options.diagram.isTone()
            //                         ? define.TONE : define.VECTOR;
            //     for ( const diagram of diagrams ) {
            //         let dname = "";
            //         if ( typeof diagram.NAME == "object") {
            //             diagram.NAME.forEach( v => {
            //                 dname = dname.concat(`${v}-`);
            //             });
            //             dname = dname.slice(0, -1);
            //         } else {
            //             dname = diagram.NAME;
            //         }

            //         const lname = this.layers[top].options.name.split("_")[0];
            //         if ( dname == lname ) {
            //             fixed = diagram.FIXED;
            //             if ( this.name == lname ) { return; }
            //             this.name = lname;
            //             break;
            //         }
            //     }
            // }


            // this.variables.splice(0) 

            const dims = fixed.map( v => v.split('/') ).flat();
            dims.forEach( dim => {
                 const split = dim.split('=');
                 const purpose_index = this.variables.findIndex( v => v.title === split[0] );
                 if ( purpose_index == -1 ) {
                     this.variables.push({
                         title: split[0], 
                         value: 0,
                         min: 0,
                         max: 0,
                         step: 1, 
                         tick_labels: [split[1]], 
                         clicked: false 
                     });
                 } else if ( !this.variables[purpose_index]["tick_labels"].find( v => v === split[1] )) {
                     this.variables[purpose_index]["max"] += 1;
                     this.variables[purpose_index]["tick_labels"].push(split[1]);
                 }
            });
        }
    },
    created: function(){
        this.update();
    },
    watch: {
        layers: function(){
            this.update()
        }
    }
}
</script>

<style scoped>
</style>
