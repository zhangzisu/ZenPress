import cnf from "../zenpress.config";
import "@babel/polyfill";

import axios from "axios";
const protocol = cnf["api-https"] ? "https://" : "http://";
axios.defaults.baseURL = `${protocol}${cnf["api-host"]}/api/${cnf["api-key"]}`;

import Vue from "vue";
import store from "./store";
import router from "./router";
import "./plugins/vuetify";
import App from "./App.vue";
import "./registerServiceWorker";
import i18n from "./i18n";
import Gravatar from "vue-gravatar";
import "./assets/github-markdown.css";
import "./assets/github.css";

Vue.component("v-gravatar", Gravatar);
Vue.config.productionTip = false;
if (store.state.authentication) {
  axios.defaults.headers.auth = store.state.authentication;
}

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount("#app");
