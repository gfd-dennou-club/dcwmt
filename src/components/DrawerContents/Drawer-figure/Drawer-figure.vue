<template>
  <v-list subheader tile>
    <v-subheader>描画方法の切り替え</v-subheader>
    <div v-for="(drawing_method, i) in drawing_methods" :key="i">
      <v-list-item
        v-if="!drawing_method.subItem"
        link
        @click="
          () => {
            selected = drawing_method;
          }
        "
      >
        <v-list-item-title>
          {{ drawing_method.title }}
        </v-list-item-title>
      </v-list-item>

      <v-list-group v-else no-action>
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title> {{ drawing_method.title }} </v-list-item-title>
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="(item, j) in drawing_method.subItem"
          :key="j"
          link
          @click="
            () => {
              selected = item;
            }
          "
        >
          <v-list-item-content>
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
    </div>
  </v-list>
</template>

<script lang="ts">
import wmtsLibIdentifer from '../../../modules/utility/wmtsLibIdentifer';
import { projections } from './projection_lib';
import type { ProjectionType } from './projection_lib';

type DrawerFigureDataType = {
  selected: ProjectionType;
  drawing_methods: Array<ProjectionType>;
};

export default {
  data(): DrawerFigureDataType {
    return {
      selected: projections[0],
      drawing_methods: projections,    
    };
  },
  watch: {
    selected: function (nowmethod) {
      if (nowmethod) {
        const config_obj = {};
        if (!nowmethod.proj) {
          config_obj.wmtsLibIdentifer = new wmtsLibIdentifer('Cesium');
          this.$store.commit('setConfig', config_obj);
        } else {
          config_obj.wmtsLibIdentifer = new wmtsLibIdentifer('OpenLayers');
          config_obj.projection = {
            code: nowmethod.proj,
            extent: nowmethod.extent,
          };
          this.$store.commit('setConfig', config_obj);
        }
      }
    },
  },
};
</script>
