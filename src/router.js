import Vue from "vue";
import Router from "vue-router";
import store from "./store";
import * as views from "./views";
import * as components from "./components";

Vue.use(Router);

export default new Router({
  mode: "history",
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
      component: views.blog,
      children: [
        {
          path: "",
          name: "blog",
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
      path: "/login",
      name: "login",
      component: views.login,
      beforeEnter: (to, from, next) => {
        if (store.state.authentication) {
          next("/");
        } else {
          next();
        }
      }
    },
    {
      path: "/admin",
      component: views.admin,
      beforeEnter: (to, from, next) => {
        if (store.state.authentication) {
          next();
        } else {
          next("/login");
        }
      },
      children: [
        {
          path: "",
          name: "admin",
          component: components.admin_home
        },
        {
          path: "logout",
          component: components.logout
        },
        {
          path: "site",
          component: components.site_statistics
        },
        {
          path: "site/info",
          component: components.site_info_edit
        },
        {
          path: "site/menu",
          component: components.site_menu_edit
        },
        {
          path: "site/owner",
          component: components.site_owner_edit
        },
        {
          path: "site/password",
          component: components.site_password_edit
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
            return { post_id: route.params.id };
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
