<template>
    <div>
        <v-list subheader tile>
            <v-subheader>不透明度</v-subheader>
            <opacity />  
        </v-list>
        <v-divider />
        <v-list subheader>
            <v-subheader>トーンの範囲</v-subheader>
        </v-list>
        <v-divider />
        <v-list subheader>
            <v-subheader>数学的操作</v-subheader>
        </v-list>
    </div>
</template>

<script>
    import opacity from "./Opacity.vue";

    export default {
        components: {
            opacity
        },
    }
</script>
