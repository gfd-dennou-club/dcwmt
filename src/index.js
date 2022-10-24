import Vue from "vue";
import App from "./components/App.vue";
import vuetify from "./plugins/vuetify.js";
import store from "./plugins/store.js";

import "../css/animation.css";
import "../css/design.css";
import "../css/layout.css";
import "cesium/Build/Cesium/Widgets/widgets.css";

new Vue({
    vuetify,
    store,
    render: (h) => h(App),
}).$mount('#app');