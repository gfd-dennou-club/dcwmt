<template>
    <v-app id="app">
        <v-app-bar app></v-app-bar>
        <v-main app>
            <v-container fluid>
                <dcwmt_map></dcwmt_map>
            </v-container>
        </v-main>
        <v-footer app></v-footer>
    </v-app>
</template>

<script>
import dcwmt_map from './Dcwmt-map';

export default {
    components: {
        dcwmt_map,
    }
};
</script>
