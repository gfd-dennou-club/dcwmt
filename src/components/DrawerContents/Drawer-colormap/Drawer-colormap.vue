<template>
    <v-list subheader tile>
		<v-subheader>カラーマップの変更</v-subheader>
		<v-list-item-group v-model="selected">
    		<v-list-item
    			v-for="(clrmap_name, i) in clrmap_names"
    			:key="i"
    			link
    		>
    			<v-list-item-content>
    				<v-list-item-title>{{ clrmap_name }}</v-list-item-title>
    		    	<colorbar width="100" height="20" :clrindex="i" />
    		  	</v-list-item-content>
    		</v-list-item>
		</v-list-item-group>
    </v-list>
</template>

<script>
import colorbar from "./Colorbar.vue";

export default {
    components: {
      colorbar,
    },
    data: () => ({
		selected: 1,
		clrmap_names: [],
	}),
    created: function(){
        this.clrmap_names = Array(78).fill(undefined).map(
            (_, index) => {
				const _clrindex = index + 1;
                return (_clrindex < 10 ? "clrmap_0" + _clrindex : "clrmap_" + _clrindex);
            }
        );
    },
	watch: {
		selected: function(clrindex) {
			if (clrindex) {
				this.$store.commit("setConfig", { clrindex: clrindex });
			}
		}
	},
}
</script>
