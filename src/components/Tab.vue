<template>
    <v-tabs
        centered
        class="ml-n9"
        color="gray darken-1"
    >
        <v-tab
            v-for="link in links"
            :key="link"
            @click="onClickTab(link)"
        >
            {{link}}
        </v-tab>
    </v-tabs>
</template>>

<script>
export default {
    data: () => ({
        links: [
            "HOME",
            "トーン関連",
            "カラーマップ関連",
            "断面切り替え",
            "図"
        ]
    }),
    methods: {
        onClickTab(link) {
            this.$emit("onClick", link);
        }
    }
}
</script>
>