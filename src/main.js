import Vue from "vue";
import App from "./App.vue";
import Scrollbar from "../components/index.js";
Vue.use(Scrollbar);
new Vue({ render: h => h(App) }).$mount("#app");
