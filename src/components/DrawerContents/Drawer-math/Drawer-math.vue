<template>
    <div>
        <v-list subheader>
            <v-subheader>数学的操作</v-subheader>
            <v-list-item-group>
                <v-list-item
                    v-for="mathmaticalMethod in mathmaticalMethods"
                    :key="mathmaticalMethod.name"
                    @click="() => { math_method = mathmaticalMethod.method }"
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
          { name: "通常", method: ( datas, size ) => datas },
          { name: "log10", method: ( datas, size ) => datas.map(Math.log10) },
          { name: "sqrt", method: ( datas, size ) => datas.map(Math.sqrt) },
          { name: "eddy_x", method: undefined },
          { name: "eddy_y", method: undefined },
          { name: "eddy_xy", method: undefined },
        ]
    }),
    created: function(){
        this.mathmaticalMethods[3].method = this.eddy_x;
        this.mathmaticalMethods[4].method = this.eddy_y;
        this.mathmaticalMethods[5].method = this.eddy_xy;
    },
    methods: {
      eddy_x: function( datas, size, means ) {
                console.log(means)
          for ( let x = 0; x < size.width; x++ ) {
              for ( let y = 0; y < size.height; y++ ) {
                  const offset = y * size.width;
                  datas[ x + offset ] = datas[ x + offset ] - means.mean_x[x];
              }
          }
          return datas;
      },
      eddy_y: function( datas, size, means ) {
          for ( let y = 0; y < size.height; y++ ) {
              const offset = y * size.width;
              for ( let x = 0; x < size.width; x++ ) {
                  datas[ x + offset ] = datas[ x + offset ] - means.mean_y[y]
              }
          }
          return datas;
      },
      eddy_xy: function( datas, size, means ) {
          for ( let i = 0; i < datas.length; i++ ) {
              datas[i] = datas[i] - means.mean;
          }
          return datas;
      }
    },
    computed: {
          math_method: {
              get: function () {
                  return this.$store.getters.config.mathmaticalMethod;
              },
              set: function ( value ) {
                  const config = { mathmaticalMethod: value };
                  this.$store.commit("setConfig", config);
              }
          }
    }
  }
</script>
