<template>
    <div>
        <v-row no-gutters>
            <v-col cols="12">
                <colorbar width="500" height="50" :clrindex="clrindex" />
            </v-col>
        </v-row>
        <v-row no-gutters>
            <v-col cols="1">ii</v-col>
            <v-col cols="10">uu</v-col>
            <v-col cols="1">ee</v-col>
        </v-row>
    </div>
</template>

<script>
    import colorbar from "./DrawerContents/Drawer-colormap/Colorbar.vue";
    
    export default {
        components: {
            colorbar,
        },
        computed: {
            clrindex: function() {
                return this.$store.getters.config.clrindex;
            }
        }
    }
</script>
