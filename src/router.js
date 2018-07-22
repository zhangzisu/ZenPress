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
        },
        {
          path: ":id",
          component: components.blog_details,
          props: function(route) {
            return { post_id: route.params.id };
          }
        }
      ]
    },
    {
      path: "/admin",
      name: "admin",
      component: views.admin,
      beforeEnter: (to, from, next) => {
        next();
      },
      children: [
        {
          path: "",
          component: components.admin_home
        },
        {
          path: "blog",
          component: components.blog_list
        },
        {
          path: "blog/new",
          component: components.blog_edit
        },
        {
          path: "blog/edit/:id",
          component: components.blog_edit,
          props: function(route) {
            return { id: route.params.id };
          }
        }
      ]
    },
    {
      path: "*",
      name: "error404",
      component: views.error,
      props: {
        type: "404",
        summary: "http_error_404",
        details: "The requested path cannot be found."
      }
    }
  ]
});
