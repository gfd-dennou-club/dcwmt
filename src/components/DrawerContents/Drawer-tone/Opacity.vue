<template>
    <v-slider
        v-model="opacity"
        :max="max"
        :min="min"
        hide-details
        class="align-center"
        :step="step"
    >
        <template v-slot:append>
            <v-text-field
                v-model="opacity"
                hide-details
                single-line
                type="number"
                style="width: 50px" 
            />
        </template>
    </v-slider>
</template>>

<script>
export default {
    data: () => ({
        opacity: 100,
        max: 100,
        min: 0,
        step: 10,
    }),
}
</script>
