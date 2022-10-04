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
            "数学的操作",
            "カラーマップの切り替え",
            "断面切り替え",
            "描画方法の切り替え"
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