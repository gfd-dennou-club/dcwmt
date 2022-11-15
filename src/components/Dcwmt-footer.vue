<template>
    <v-row>
        <v-col cols="4" style="display: flex; align-items: center;">
           <dcwmt_legends /> 
        </v-col>
        <v-col cols="8">
            <dcwmt_animation />
        </v-col>
    </v-row> 
</template>

<script>
import dcwmt_legends from './Dcwmt-legends.vue';
import dcwmt_animation from './Dcwmt-animation.vue';

export default {
    components: { 
        dcwmt_legends,
        dcwmt_animation
   } 
}
</script>

<style scped>

</style>
