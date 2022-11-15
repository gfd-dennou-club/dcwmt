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
                    @mouseup="changeURL(`${variable.title}=${variable.tick_labels[variable.value]}`)"
                ></v-slider>
        </div>
    </div>
</template>

<script>
import define from '../define';

export default {
    data: () => ({
        variables: [],
        intervalID: null,
        sec_per_frame: 2,
    }),
    computed: {
        fixedDim: {
            get: function(){
                return this.$store.getter.config.fixedDim;
            },
            set: function( value ){
                this.$store.commit("setConfig", { fixedDim: value }) 
            }
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
        changeURL: function( value ) {
            this.fixedDim = value;
        },
        animation: function( index ) {
            this.variables[index].value += 1;
            const variable = this.variables[index];
            if ( variable.value >= variable.max ) {
                this.variables[index].value = 0;   
            }

            const value = `${variable.title}=${variable.tick_labels[variable.value]}`;
            this.changeURL(value);
        }
    },
    created: function(){
       const fixed = define.TONE[0].FIXED || define.VECTOR[0].FIXED;
       const dims = fixed.map( v => v.split('/') ).flat();
       dims.forEach( dim => {
            const split = dim.split('=');
            const purpose_index = this.variables.findIndex( v => v.title === split[0] );
            if ( purpose_index == -1 ) {
                console.log(split[1])
                this.variables.push({
                    title: split[0], 
                    value: 0,
                    min: 0,
                    max: 0,
                    step: 1, 
                    tick_labels: [split[1]], 
                    clicked: false 
                });
            } else {
                this.variables[purpose_index]["max"] += 1;
                this.variables[purpose_index]["tick_labels"].push(split[1]);
            }
       });
    },
}
</script>

<style scoped>
</style>
