import Vue from "vue";
import Router from "vue-router";
import home from "./views/home.vue";
import about from "./views/about.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: home
    },
    {
      path: "/about",
      name: "about",
      component: about
    }
  ]
});
