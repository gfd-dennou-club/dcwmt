<template>
    <v-speed-dial
        v-model="fab"
        direction="left"
        top
        right
        open-on-hover
    >
        <template v-slot:activator >
            <v-btn
                v-model="fab"
                evelation="2"
                fab
                tile
            >

            </v-btn>
        </template>
        <v-card max-width="344">
            <v-list
                subheader
            >
                <v-subheader>Base Layers</v-subheader>
                <v-list-item-group>
                    <v-list-item
                        v-for="layer in baselayers"
                        :key="layer.name"
                    >
                        <template v-slot:default="{ active }">
                            <v-list-item-action>
                                <v-radio :input-value="active" />
                            </v-list-item-action>
                            <v-list-item-title> {{layer.name}} </v-list-item-title>
                        </template>
                    </v-list-item>
                </v-list-item-group>
                <v-divider />
                <v-subheader>Overlay Layers</v-subheader>
                <v-list-item-group>
                    <v-list-item
                        v-for="layer in overlaylayers"
                        :key="layer.name"
                    >
                        <template v-slot:default="{ active }">
                            <v-list-item-action>
                                <v-checkbox :input-value="active" />
                            </v-list-item-action>
                            <v-list-item-title> {{layer.name}} </v-list-item-title>
                        </template>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-card>
    </v-speed-dial>
</template>

<script>
export default {
    data: () => ({
        fab: false,
        baselayers: [ { name: "Ps" }, { name: "vec" } ],
        overlaylayers: [ { name: "Ps" }, { name: "vec" } ],
    }),
    created: function() {
        
    }
}
</script>

<style>
    .v-speed-dial {
        position: absolute !important;
    }
</style>
