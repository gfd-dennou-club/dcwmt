<template>
    <div>
        <v-list subheader>
            <v-subheader>数学的操作</v-subheader>
            <v-list-item-group>
                <v-list-item
                    v-for="mathmaticalMethod in mathmaticalMethods"
                    :key="mathmaticalMethod.name"
                    @click="() => { math_method = mathmaticalMethod }"
                >
                    <v-list-item-title>
                        {{ mathmaticalMethod.name }}
                    </v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </div>
</template>

<script>
  export default {
    data: () => ({
        mathmaticalMethods: [
          { name: "通常", method: ( data ) => data },
          { name: "log10", method: ( data ) => Math.log10(data) },
          { name: "sqrt", method: ( data ) => Math.sqrt(data) },
        ]
    }),
    created: function(){
    },
    methods: {
    },
    computed: {
          math_method: {
              get: function () {
                  return this.$store.getters.config.mathMethod;
              },
              set: function ( value ) {
                  const config = { mathMethod: value.method };
                  this.$store.commit("setConfig", config);
              }
          }
    }
  }
</script>
