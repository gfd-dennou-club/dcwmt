<template>
    <v-list subheader tile>
        <v-subheader>描画方法の切り替え</v-subheader>
        <div
            v-for="(drawing_method, i) in drawing_methods"
            :key="i"
        >
          <v-list-item 
              v-if="!drawing_method.subItem" 
              link
              @click="() => { selected = drawing_method }"
          >
              <v-list-item-title>
                  {{drawing_method.title}} 
              </v-list-item-title>
          </v-list-item>
          
          <v-list-group 
              v-else 
              no-action
          >
              <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title> {{drawing_method.title}} </v-list-item-title>
                  </v-list-item-content>
              </template>
              <v-list-item
                  v-for="(item, j) in drawing_method.subItem"
                  :key="j"
                  link
                  @click="() => { selected = item }"
              > 
                  <v-list-item-content>
                      <v-list-item-title> {{item.title}} </v-list-item-title>
                  </v-list-item-content>
              </v-list-item>
          </v-list-group>
        </div>
    </v-list>
</template>

<script>
import wmtsLibIdentifer from "../../../modules/utility/wmtsLibIdentifer";
import proj4 from "proj4";
import {register} from "ol/proj/proj4";

export default {
    data: () => ({
        selected: undefined,
        drawing_methods: [
            { 
                title: "2次元平面への投影",
                subItem: [
                    {
                        title: "メルカトル図法",
                        proj: 'EPSG:3857',
                        extent: undefined,
                    },
                    {
                        title: "正距方位図法",
                        proj: 'ESRI:54032',
                        extent: [-21e6, -21e6, 21e6, 21e6],
                    },
                    {
                        title: "モルワイデ図法",
                        proj: 'ESRI:54009',
                        extent: [-18e6, -9e6, 18e6, 9e6],
                    },
                    {
                        title: "サンソン図法",
                        proj: 'ESRI:54008',
                        extent: [-18e6, -9e6, 18e6, 9e6],
                    }
                ],
            },
            {
                title: "3次元球面への投影",
            }
            
        ],
    }),
    created: function(){
       //  // 正距方位図法
       //  proj4.defs("ESRI:54032","+proj=aeqd +lat_0=90 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
       //  // モルワイデ図法
       //  proj4.defs("ESRI:54009","+proj=moll +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
       //  // サンソン図法(正弦曲線図法)
       //  proj4.defs("ESRI:54008","+proj=sinu +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
       //  register(proj4);
    },
    watch: {
        selected: function( nowmethod, oldmethod ){
            if ( nowmethod ) {
                const config_obj = { };
                if ( !nowmethod.proj ) {
                    config_obj.wmtsLibIdentifer = new wmtsLibIdentifer("Cesium");
                    this.$store.commit("setConfig", config_obj);
                } else {
                    config_obj.wmtsLibIdentifer = new wmtsLibIdentifer("OpenLayers");
                    config_obj.projection = { code: nowmethod.proj, extent: nowmethod.extent };
                    this.$store.commit("setConfig", config_obj);
                }
            }
        }
    }
}
</script>
