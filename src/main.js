import "@babel/polyfill";

import axios from "axios";
axios.defaults.baseURL = "http://localhost/api/5b555bb77d8c4d384c0251d0";

import Vue from "vue";
import store from "./store";
import router from "./router";
import "./plugins/vuetify";
import App from "./App.vue";
import "./registerServiceWorker";
import i18n from "./i18n";
import Gravatar from "vue-gravatar";
import "./assets/github-markdown.css";

Vue.component("v-gravatar", Gravatar);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
