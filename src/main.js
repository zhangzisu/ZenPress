import "@babel/polyfill";
import "./assets/github-markdown.css";

import axios from "axios";
axios.defaults.baseURL = "http://localhost/api/5b546a39727d5d0c10dcc5f0";

import Vue from "vue";
import store from "./store";
import router from "./router";
import "./plugins/vuetify";
import App from "./App.vue";
import "./registerServiceWorker";
import i18n from "./i18n";
import Gravatar from "vue-gravatar";

Vue.component("v-gravatar", Gravatar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
