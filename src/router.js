import Vue from "vue";
import Router from "vue-router";
import * as views from "./views";
import * as components from "./components";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: views.home
    },
    {
      path: "/about",
      name: "about",
      component: views.about
    },
    {
      path: "/blog",
      name: "blog",
      component: views.blog,
      children: [
        {
          path: "",
          component: components.blog_home
        }
      ]
    }
  ]
});
